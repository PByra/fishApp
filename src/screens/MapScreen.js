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
import { fetchGaugeCondition } from '../services/usgsService';

// Disable Mapbox token — not needed for MapLibre with OSM
MapLibreGL.setAccessToken(null);

// Expanded center — shifted east to balance WI + Great Lakes + UP
const WI_LNG = -88.5;
const WI_LAT = 45.0;
const WI_ZOOM = 5.5;
// Expanded bounds: includes full Lake Michigan, Lake Superior, and UP Michigan
const WI_BOUNDS = [[-93.5, 41.4], [-82.5, 48.6]];

// Expanded visible region: Wisconsin land border + full Lake Michigan +
// full Lake Superior (including Ontario north shore) + Upper Peninsula of Michigan.
// CW winding for GeoJSON polygon hole (world outer ring is CCW).
const EXPANDED_HOLE_CW = [
  // ── Wisconsin land borders (west + south) — Census-derived, unchanged ──
  [-90.415429, 46.568478], [-90.55783, 46.584908], [-90.886446, 46.754694],
  [-90.749522, 46.88614],  [-90.837154, 46.95734],  [-91.09457, 46.864232],
  [-91.790141, 46.694447], [-92.014696, 46.705401], [-92.091373, 46.749217],
  [-92.29402, 46.667063],  [-92.29402, 46.075553],  [-92.354266, 46.015307],
  [-92.639067, 45.933153], [-92.869098, 45.719552], [-92.885529, 45.577151],
  [-92.770513, 45.566198], [-92.644544, 45.440228], [-92.75956, 45.286874],
  [-92.737652, 45.117088], [-92.808852, 44.750133], [-92.545959, 44.569394],
  [-92.337835, 44.552964], [-92.233773, 44.443425], [-91.927065, 44.333886],
  [-91.877772, 44.202439], [-91.592971, 44.032654], [-91.43414, 43.994316],
  [-91.242447, 43.775238], [-91.269832, 43.616407], [-91.215062, 43.501391],
  [-91.204109, 43.353514], [-91.056231, 43.254929], [-91.176724, 43.134436],
  [-91.143862, 42.909881], [-91.067185, 42.75105],  [-90.711184, 42.636034],
  [-90.639984, 42.510065], [-88.788778, 42.493634], [-87.802929, 42.493634],

  // ── Lake Michigan southern shore (east toward southern tip) ──
  [-87.30, 41.71],   // Illinois Lake Michigan coast
  [-87.20, 41.60],   // Southern tip of Lake Michigan (mid-water)

  // ── Lake Michigan eastern shore — pulled ~0.4° west of actual MI shore ──
  [-86.80, 42.20],   // south Lake Michigan (in water, west of Benton Harbor)
  [-86.65, 43.24],   // mid lake (west of Muskegon)
  [-86.00, 44.20],   // upper lake (west of Manistee)
  [-85.60, 45.20],   // north lake (west of Charlevoix)
  [-85.10, 45.55],   // approaching straits
  [-84.73, 45.78],   // Mackinaw City (south end of Mackinac Bridge)
  [-84.73, 45.86],   // St. Ignace (north end, entering Upper Peninsula)

  // ── Upper Peninsula east tip ───────────────────────────────
  [-84.35, 46.50],   // Sault Ste. Marie (eastern tip of UP)

  // ── Lake Superior north shore (Ontario, going west) ────────
  [-84.85, 47.05],
  [-86.00, 47.30],
  [-87.40, 47.65],
  [-88.50, 48.18],
  [-90.00, 48.15],
  [-91.50, 48.05],
  [-92.50, 47.75],
  [-93.10, 47.50],   // extend NW — covers viewport top-left corner
  [-93.30, 47.05],   // trace MN/Ontario border south
  [-92.80, 46.85],   // western Lake Superior — near MN/WI border

  // ── South to WI/MN Lake Superior coast, east back to start ──
  [-92.12, 46.78],   // Superior, WI / Duluth, MN
  [-91.54, 46.76],
  [-91.09, 46.76],
  [-90.70, 46.62],

  // ── Close ─────────────────────────────────────────────────
  [-90.415429, 46.568478],
];

const WI_MASK = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [[-180, -85], [-180, 85], [180, 85], [180, -85], [-180, -85]],
        EXPANDED_HOLE_CW,
      ],
    },
    properties: {},
  }],
};

// OpenFreeMap vector tile style — free, no API key, OSM-based.
// Vector tiles render rivers/lakes/wetlands at all zoom levels with labels.
// Falls back to OSM raster if unavailable.
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/bright';

// Fallback OSM raster style for offline/error conditions
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
  const [gaugeCondition, setGaugeCondition] = useState(null);

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

  // Fetch live USGS gauge condition when a river spot is opened
  useEffect(() => {
    if (!selectedSpot?.gaugeId) { setGaugeCondition(null); return; }
    let cancelled = false;
    fetchGaugeCondition(selectedSpot.gaugeId).then(r => {
      if (!cancelled) setGaugeCondition(r);
    });
    return () => { cancelled = true; };
  }, [selectedSpot?.id]);

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
            styleURL: MAP_STYLE,
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
        styleURL={MAP_STYLE}
        attributionEnabled={false}
        logoEnabled={false}
        compassEnabled
        compassViewPosition={1}
        minZoomLevel={5}
        maxBounds={{ ne: [-82.0, 48.7], sw: [-93.5, 41.3] }}
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

        {/* Wisconsin DNR hydrology overlay — rivers, streams, wetlands */}
        <MapLibreGL.RasterSource
          id="dnrHydro"
          tileUrlTemplates={[
            'https://dnrmaps.wi.gov/arcgis/rest/services/WM_Hydro/EN_WM_Hydro_BaseLayers_WM_Ext/MapServer/tile/{z}/{y}/{x}',
          ]}
          tileSize={256}
        >
          <MapLibreGL.RasterLayer
            id="dnrHydroLayer"
            style={{ rasterOpacity: 0.55 }}
            layerIndex={2}
          />
        </MapLibreGL.RasterSource>

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
              {selectedSpot.seclusionScore && (
                <Chip
                  label={`${selectedSpot.seclusionScore} Seclusion`}
                  seclusion={selectedSpot.seclusionScore}
                />
              )}
            </View>

            {/* Dog-friendly note */}
            {selectedSpot.dogFriendlyNote && (
              <View style={styles.dogNoteRow}>
                <Text style={styles.dogNoteEmoji}>🐕</Text>
                <Text style={styles.dogNoteText}>{selectedSpot.dogFriendlyNote}</Text>
              </View>
            )}

            {/* Live water condition */}
            {gaugeCondition && (
              <View style={[styles.conditionRow, gaugeCondition.mudRisk && styles.conditionRowHigh]}>
                <Feather
                  name="droplet"
                  size={14}
                  color={gaugeCondition.mudRisk ? '#BF360C' : '#1565C0'}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.conditionLabel, gaugeCondition.mudRisk && styles.conditionLabelHigh]}>
                    {gaugeCondition.label}
                  </Text>
                  <Text style={styles.conditionSub}>
                    {gaugeCondition.gageHeight} ft · 7-day avg {gaugeCondition.sevenDayAvg} ft
                  </Text>
                </View>
              </View>
            )}

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

function Chip({ label, accent, dog, seclusion }) {
  return (
    <View
      style={[
        styles.chip,
        accent && styles.chipAccent,
        dog && styles.chipDog,
        seclusion === 'High' && styles.chipSeclusionHigh,
        seclusion === 'Moderate' && styles.chipSeclusionMod,
        seclusion === 'Low' && styles.chipSeclusionLow,
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
  chipSeclusionHigh: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  chipSeclusionMod: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFCC80',
  },
  chipSeclusionLow: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E0E0E0',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary.forest,
    letterSpacing: 0.2,
  },

  // Dog note
  dogNoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: spacing.sm,
  },
  dogNoteEmoji: { fontSize: 13, lineHeight: 18 },
  dogNoteText: {
    flex: 1,
    fontSize: 12,
    color: colors.neutral.textSecondary,
    lineHeight: 17,
    fontStyle: 'italic',
  },

  // Live condition
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#1565C0',
  },
  conditionRowHigh: {
    backgroundColor: '#FBE9E7',
    borderLeftColor: '#BF360C',
  },
  conditionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1565C0',
  },
  conditionLabelHigh: { color: '#BF360C' },
  conditionSub: {
    fontSize: 11,
    color: colors.neutral.textSecondary,
    marginTop: 2,
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
