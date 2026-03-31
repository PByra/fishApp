import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { bodiesOfWater, getRegions } from '../data/wisconsinWaters';
import { colors, spacing, shadows, typography } from '../theme/colors';
import { launchNavigation } from '../services/navigationService';

// Disable Mapbox token — not needed for MapLibre with OSM
MapLibreGL.setAccessToken(null);

// Wisconsin center + bounding box
const WI_LNG = -89.5;
const WI_LAT = 44.5;
const WI_ZOOM = 6.4;
const WI_BOUNDS = [[-92.89, 42.49], [-86.25, 47.31]];

// World polygon with Wisconsin's geographic outline as the hole.
// Hole ring is clockwise (GeoJSON spec for holes). Non-self-intersecting.
// Door Peninsula is simplified — at z6 the sliver is not meaningful.
const WI_MASK = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        // Outer ring — world (counterclockwise)
        [[-180, -85], [-180, 85], [180, 85], [180, -85], [-180, -85]],
        // Hole — Wisconsin outline (clockwise: SW → north → Lake Superior → NE coast → Lake Michigan → south border → SW)
        [
          [-92.88, 42.50],
          // St. Croix / Mississippi — western border going north
          [-92.80, 43.00], [-92.75, 43.40], [-92.75, 44.00],
          [-92.50, 44.40], [-92.30, 44.70], [-92.00, 45.00],
          [-91.65, 45.40], [-91.20, 45.60], [-90.75, 45.70],
          [-90.14, 46.00], [-89.62, 46.20], [-89.10, 46.28],
          // Lake Superior coast going east
          [-88.70, 46.80], [-88.10, 46.95], [-87.82, 47.07],
          // Michigan/Wisconsin NE border going south
          [-87.64, 46.82], [-87.24, 46.63], [-87.02, 46.57],
          [-86.55, 46.48],
          // NE Wisconsin — Green Bay western shore going south
          [-86.60, 46.07], [-86.84, 45.87], [-87.05, 45.68],
          [-87.25, 45.47], [-87.47, 45.24], [-87.63, 44.97],
          [-87.79, 44.55],
          // Lake Michigan coast going south
          [-87.85, 44.28], [-87.74, 44.10], [-87.64, 43.94],
          [-87.53, 43.73], [-87.56, 43.54], [-87.67, 43.36],
          [-87.78, 43.22], [-87.78, 43.05], [-87.75, 42.84],
          [-87.76, 42.62], [-87.84, 42.50],
          // Southern border going west
          [-88.20, 42.50], [-88.80, 42.50], [-89.40, 42.50],
          [-89.90, 42.50], [-90.40, 42.50], [-90.80, 42.50],
          [-91.14, 42.78], [-91.07, 43.09], [-91.17, 43.37],
          [-91.24, 43.57], [-91.30, 43.81], [-91.37, 44.02],
          [-91.48, 44.25], [-91.65, 44.47], [-91.88, 44.68],
          [-92.09, 44.75], [-92.32, 44.84], [-92.44, 45.06],
          [-92.63, 45.28], [-92.72, 45.56], [-92.75, 45.88],
          [-92.75, 46.08], [-92.76, 46.38], [-92.81, 46.65],
          [-92.88, 42.50],
        ],
      ],
    },
    properties: {},
  }],
};

// Inline OSM raster style — no API key, tiles cache locally after first load
const OSM_STYLE = JSON.stringify({
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
});

const REGION_FILTERS = ['All', ...getRegions()];

// Flatten all spots from bodiesOfWater, carrying parent metadata for the map
const buildMapSpots = () =>
  bodiesOfWater.flatMap(water =>
    water.spots.map(spot => ({
      ...spot,
      waterName: water.name,
      waterType: water.type,
      region: water.region,
    }))
  );

const ALL_SPOTS = buildMapSpots();

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef(null);
  const sheetAnim = useRef(new Animated.Value(0)).current;

  const [regionFilter, setRegionFilter] = useState('All');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [offlineStatus, setOfflineStatus] = useState('idle'); // idle | downloading | ready

  const visibleSpots =
    regionFilter === 'All'
      ? ALL_SPOTS
      : ALL_SPOTS.filter(s => s.region === regionFilter);

  // Request location once on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserCoords([pos.coords.longitude, pos.coords.latitude]);
    })();
  }, []);

  // Attempt to pre-download Wisconsin tile pack on first launch
  useEffect(() => {
    (async () => {
      try {
        const packs = await MapLibreGL.offlineManager.getPacks();
        if (packs.some(p => p.name === 'wi-tiles')) {
          setOfflineStatus('ready');
          return;
        }
        setOfflineStatus('downloading');
        await MapLibreGL.offlineManager.createPack(
          {
            name: 'wi-tiles',
            styleURL: OSM_STYLE,
            minZoom: 4,
            maxZoom: 14,
            bounds: WI_BOUNDS,
          },
          (_pack, status) => {
            if (status?.percentage === 100) setOfflineStatus('ready');
          },
          () => {
            setOfflineStatus('idle');
          }
        );
      } catch {
        setOfflineStatus('idle');
      }
    })();
  }, []);

  const openSpot = useCallback(
    spot => {
      setSelectedSpot(spot);
      Animated.spring(sheetAnim, {
        toValue: 1,
        tension: 60,
        friction: 12,
        useNativeDriver: true,
      }).start();
    },
    [sheetAnim]
  );

  const closeSheet = useCallback(() => {
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 210,
      useNativeDriver: true,
    }).start(() => setSelectedSpot(null));
  }, [sheetAnim]);

  const flyToMe = () => {
    if (!userCoords || !cameraRef.current) return;
    cameraRef.current.flyTo(userCoords, 700);
  };

  const sheetTranslateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [520, 0],
  });

  return (
    <View style={styles.root}>

      {/* ── MAP — fills edge-to-edge ─────────────────────── */}
      <MapLibreGL.MapView
        style={styles.map}
        styleJSON={OSM_STYLE}
        attributionEnabled={false}
        logoEnabled={false}
        compassEnabled
        compassViewPosition={1}
        minZoomLevel={6}
        maxBounds={{ ne: [-86.25, 47.31], sw: [-92.89, 42.49] }}
      >
        <MapLibreGL.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: [WI_LNG, WI_LAT],
            zoomLevel: WI_ZOOM,
          }}
        />

        {userCoords && (
          <MapLibreGL.UserLocation visible renderMode="native" />
        )}

        {/* Dim mask — everything outside Wisconsin bounding box */}
        <MapLibreGL.ShapeSource id="wiMask" shape={WI_MASK}>
          <MapLibreGL.FillLayer
            id="wiMaskFill"
            style={{ fillColor: 'rgba(14, 38, 70, 0.96)', fillOpacity: 1 }}
          />
        </MapLibreGL.ShapeSource>

        {visibleSpots.map(spot => (
          <MapLibreGL.PointAnnotation
            key={String(spot.id)}
            id={String(spot.id)}
            coordinate={[spot.coords.lng, spot.coords.lat]}
            onSelected={() => openSpot(spot)}
          >
            <PinMarker
              isSelected={selectedSpot?.id === spot.id}
              type={spot.waterType}
            />
          </MapLibreGL.PointAnnotation>
        ))}
      </MapLibreGL.MapView>

      {/* ── STATUS BAR SCRIM — readable over any map tile ── */}
      <View
        style={[styles.statusScrim, { height: insets.top }]}
        pointerEvents="none"
      />

      {/* ── REGION FILTER (floats over map at top) ─────── */}
      <View style={[styles.filterOverlay, { top: insets.top + 8 }]} pointerEvents="box-none">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {REGION_FILTERS.map(r => (
            <TouchableOpacity
              key={r}
              style={[styles.pill, r === regionFilter && styles.pillActive]}
              onPress={() => setRegionFilter(r)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.pillText,
                  r === regionFilter && styles.pillTextActive,
                ]}
              >
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── MY LOCATION button ─────────────────────────── */}
      {userCoords && (
        <TouchableOpacity
          style={[styles.locBtn, { bottom: spacing.xl + Math.max(insets.bottom, 8) }]}
          onPress={flyToMe}
          activeOpacity={0.85}
        >
          <Feather name="crosshair" size={20} color={colors.primary.forest} />
        </TouchableOpacity>
      )}

      {/* ── SPOT COUNT badge ───────────────────────────── */}
      <View
        style={[styles.countBadge, { bottom: spacing.xl + Math.max(insets.bottom, 8) }]}
        pointerEvents="none"
      >
        <Text style={styles.countText}>{visibleSpots.length} spots</Text>
      </View>

      {/* ── OFFLINE download indicator ─────────────────── */}
      {offlineStatus === 'downloading' && (
        <View
          style={[styles.offlineBanner, { bottom: spacing.xl + 52 + Math.max(insets.bottom, 8) }]}
          pointerEvents="none"
        >
          <ActivityIndicator size="small" color={colors.accent.wasabi} />
          <Text style={styles.offlineBannerText}>
            Saving Wisconsin map for offline use…
          </Text>
        </View>
      )}

      {/* ── BOTTOM SHEET ───────────────────────────────── */}
      {selectedSpot && (
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={closeSheet}
        />
      )}

      {selectedSpot && (
        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: sheetTranslateY }] },
          ]}
        >
          <View style={styles.sheetHandle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetBody}
            bounces={false}
          >
            {/* Title row */}
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.spotName} numberOfLines={2}>
                  {selectedSpot.name}
                </Text>
                <Text style={styles.waterName}>{selectedSpot.waterName}</Text>
              </View>
              <TouchableOpacity
                onPress={closeSheet}
                hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
              >
                <Feather
                  name="x"
                  size={22}
                  color={colors.neutral.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Tags */}
            <View style={styles.tagRow}>
              <Chip label={selectedSpot.region} />
              <Chip label={selectedSpot.difficulty || 'Varies'} accent />
              {selectedSpot.dogFriendly && <Chip label="Dog OK" dog />}
            </View>

            {/* Access point */}
            {selectedSpot.accessPoint ? (
              <View style={styles.accessRow}>
                <Feather
                  name="map-pin"
                  size={13}
                  color={colors.accent.persimmon}
                />
                <Text style={styles.accessText}>
                  {selectedSpot.accessPoint}
                </Text>
              </View>
            ) : null}

            {/* Fish species */}
            <Text style={styles.sectionLabel}>FISH HERE</Text>
            <View style={styles.fishRow}>
              {(selectedSpot.fish || []).map((f) => (
                <View key={f} style={styles.fishChip}>
                  <Text style={styles.fishChipText}>{f}</Text>
                </View>
              ))}
            </View>

            {/* Spot notes */}
            {selectedSpot.notes ? (
              <Text style={styles.notes}>{selectedSpot.notes}</Text>
            ) : null}

            {/* GO FISH */}
            <TouchableOpacity
              style={styles.cta}
              onPress={() =>
                launchNavigation(selectedSpot.query, selectedSpot.name)
              }
              activeOpacity={0.85}
            >
              <Feather name="navigation" size={16} color="#fff" />
              <Text style={styles.ctaText}>GO FISH</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

// ── Sub-components ─────────────────────────────────────

function PinMarker({ isSelected, type = '' }) {
  const t = type.toLowerCase();
  let color = colors.accent.persimmon;
  if (t.includes('lake') || t.includes('glacial')) {
    color = colors.environment.lightWater;
  } else if (t.includes('river') || t.includes('stream')) {
    color = colors.accent.wasabi;
  } else if (t.includes('reservoir') || t.includes('state park')) {
    color = colors.primary.lightForest;
  }
  return (
    <View
      style={[
        styles.pinOuter,
        { borderColor: color },
        isSelected && styles.pinOuterSelected,
      ]}
    >
      <View style={[styles.pinInner, { backgroundColor: color }]} />
    </View>
  );
}

function Chip({ label, accent, dog }) {
  return (
    <View
      style={[
        styles.chip,
        accent && styles.chipAccent,
        dog && styles.chipDog,
      ]}
    >
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary.darkForest,
  },
  map: {
    flex: 1,
  },

  // ── Status bar scrim ────────────────────────────────
  statusScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18, 32, 21, 0.52)',
    zIndex: 15,
  },

  // ── Filter bar ──────────────────────────────────────
  filterOverlay: {
    position: 'absolute',
    // top is set inline using insets.top
    left: 0,
    right: 0,
    zIndex: 10,
  },
  filterRow: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 240, 230, 0.93)',
    borderWidth: 1,
    borderColor: colors.neutral.borderLight,
    ...shadows.sm,
  },
  pillActive: {
    backgroundColor: colors.primary.forest,
    borderColor: colors.primary.forest,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary.forest,
  },
  pillTextActive: {
    color: colors.neutral.white,
  },

  // ── My location button ───────────────────────────────
  locBtn: {
    position: 'absolute',
    right: spacing.md,
    // bottom set inline with insets
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },

  // ── Spot count badge ────────────────────────────────
  countBadge: {
    position: 'absolute',
    left: spacing.md,
    // bottom set inline with insets
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(18, 32, 21, 0.82)',
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral.white,
    letterSpacing: 0.4,
  },

  // ── Offline banner ──────────────────────────────────
  offlineBanner: {
    position: 'absolute',
    // bottom set inline with insets
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary.darkForest,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent.wasabi,
    ...shadows.md,
  },
  offlineBannerText: {
    fontSize: 12,
    color: colors.accent.wasabi,
    fontWeight: '500',
    flex: 1,
  },

  // ── Bottom sheet ────────────────────────────────────
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
    zIndex: 20,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: 490,
    ...shadows.xl,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neutral.gray300,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  sheetBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },

  // Title
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  spotName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary.forest,
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  waterName: {
    fontSize: 13,
    color: colors.neutral.textSecondary,
    marginTop: 2,
  },

  // Tags
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.neutral.gray100,
    borderWidth: 1,
    borderColor: colors.neutral.borderLight,
  },
  chipAccent: {
    backgroundColor: '#FFF5F2',
    borderColor: colors.accent.persimmon,
  },
  chipDog: {
    backgroundColor: '#F0F7F4',
    borderColor: colors.accent.wasabi,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary.forest,
    letterSpacing: 0.2,
  },

  // Access
  accessRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
  },
  accessText: {
    fontSize: 13,
    color: colors.neutral.textSecondary,
    flex: 1,
    lineHeight: 18,
  },

  // Fish
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral.textSecondary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  fishRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.md,
  },
  fishChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#F0F7F4',
    borderWidth: 1,
    borderColor: colors.accent.wasabi,
  },
  fishChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary.darkForest,
  },

  // Notes
  notes: {
    fontSize: 13,
    color: colors.neutral.textSecondary,
    lineHeight: 19,
    marginBottom: spacing.md,
  },

  // CTA
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent.persimmon,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: spacing.xs,
    ...shadows.md,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral.white,
    letterSpacing: 1.2,
  },

  // Pin marker
  pinOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinOuterSelected: {
    transform: [{ scale: 1.35 }],
  },
  pinInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
});
