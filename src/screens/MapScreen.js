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
const WI_LNG = -89.9;
const WI_LAT = 44.7;
const WI_ZOOM = 6.2;
// Tight bounds derived from real Census polygon extents
const WI_BOUNDS = [[-93.0, 42.48], [-86.25, 47.10]];

// Real Wisconsin border from US Census / PublicaMundi (74 points).
// Source ring is CCW (RFC 7946 exterior). Reversed here to CW for use as a hole.
// Outer world ring is CCW. MapLibre Native handles RFC 7946 winding correctly.
const WI_HOLE_CW = [
  [-90.415429, 46.568478], [-90.55783, 46.584908], [-90.886446, 46.754694],
  [-90.749522, 46.88614], [-90.837154, 46.95734], [-91.09457, 46.864232],
  [-91.790141, 46.694447], [-92.014696, 46.705401], [-92.091373, 46.749217],
  [-92.29402, 46.667063], [-92.29402, 46.075553], [-92.354266, 46.015307],
  [-92.639067, 45.933153], [-92.869098, 45.719552], [-92.885529, 45.577151],
  [-92.770513, 45.566198], [-92.644544, 45.440228], [-92.75956, 45.286874],
  [-92.737652, 45.117088], [-92.808852, 44.750133], [-92.545959, 44.569394],
  [-92.337835, 44.552964], [-92.233773, 44.443425], [-91.927065, 44.333886],
  [-91.877772, 44.202439], [-91.592971, 44.032654], [-91.43414, 43.994316],
  [-91.242447, 43.775238], [-91.269832, 43.616407], [-91.215062, 43.501391],
  [-91.204109, 43.353514], [-91.056231, 43.254929], [-91.176724, 43.134436],
  [-91.143862, 42.909881], [-91.067185, 42.75105], [-90.711184, 42.636034],
  [-90.639984, 42.510065], [-88.788778, 42.493634], [-87.802929, 42.493634],
  [-87.76459, 42.783912], [-87.885083, 43.002989], [-87.912467, 43.249452],
  [-87.791975, 43.561637], [-87.704344, 43.687607], [-87.737205, 43.8793],
  [-87.644097, 44.103854], [-87.540035, 44.158624], [-87.545512, 44.322932],
  [-87.468835, 44.552964], [-87.189511, 44.969211], [-87.047111, 45.089704],
  [-87.03068, 45.22115], [-87.238804, 45.166381], [-87.403112, 44.914442],
  [-87.611236, 44.837764], [-87.775544, 44.640595], [-87.928898, 44.536533],
  [-88.043914, 44.563917], [-87.983668, 44.722749], [-87.819359, 44.95278],
  [-87.627666, 44.974688], [-87.589328, 45.095181], [-87.742682, 45.199243],
  [-87.649574, 45.341643], [-87.885083, 45.363551], [-87.791975, 45.500474],
  [-87.781021, 45.675736], [-87.989145, 45.796229], [-88.10416, 45.922199],
  [-88.531362, 46.020784], [-88.662808, 45.987922], [-89.09001, 46.135799],
  [-90.119674, 46.338446], [-90.229213, 46.508231], [-90.415429, 46.568478],
];

const WI_MASK = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [[-180, -85], [-180, 85], [180, 85], [180, -85], [-180, -85]],
        WI_HOLE_CW,
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
            style={{ fillColor: 'rgba(14, 38, 70, 0.96)', fillOpacity: 1, fillAntialias: false }}
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
