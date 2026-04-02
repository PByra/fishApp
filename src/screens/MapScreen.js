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
  [-92.1173526833007,46.74871224466631],[-92.142514601346,46.73547369098125],
  [-92.14174439527615,46.72572983865709],[-92.14750907929663,46.715459356395655],
  [-92.17008776456734,46.71650817496254],[-92.19280841498588,46.71177250682146],
  [-92.20141114542824,46.69979729694299],[-92.19558385813005,46.67306369208461],
  [-92.20745864638623,46.66289509194553],[-92.20228091849467,46.657363439247405],
  [-92.20323399026552,46.65354189952939],[-92.21169328362745,46.65143397210662],
  [-92.23091807825423,46.65130196856293],[-92.24438294541733,46.64932344605353],
  [-92.25738879633936,46.652356523114776],[-92.2650357227984,46.652751532025604],
  [-92.26810150873585,46.6510388958005],[-92.27306475177784,46.65196100820032],
  [-92.27438430883116,46.65551592256941],[-92.27761940697403,46.657620971280096],
  [-92.28104849544562,46.658804037303184],[-92.28352307831837,46.65985541240519],
  [-92.28617717978732,46.66208922647854],[-92.28729212272555,46.6665562895011],
  [-92.28728557633963,46.667738603484],[-92.29145844651988,46.66825850082279],
  [-92.29170641174846,46.66451221219947],[-92.29216208992148,46.66333490884409],
  [-92.29408800900525,46.0743311027004],[-92.29751164467885,46.07302651501445],
  [-92.30238150405557,46.0726585831344],[-92.30701035812788,46.072524783453645],
  [-92.31207148751733,46.07031733798894],[-92.31898424078534,46.06932841922165],
  [-92.32520493584465,46.06681924503812],[-92.32993170129058,46.0654808315534],
  [-92.33292059396364,46.06290460092333],[-92.33557266606998,46.05898979865532],
  [-92.33697116634202,46.0553088982727],[-92.33841804341395,46.05146037395869],
  [-92.33861088089569,46.04844820141324],[-92.34338428151449,46.04322708255006],
  [-92.3433773695019,46.03697408601835],[-92.34251256890217,46.03427260581657],
  [-92.34251245716325,46.031533572292886],[-92.3438634439878,46.02849442025445],
  [-92.34618712220039,46.02553023950759],[-92.34907013532984,46.023766601396204],
  [-92.35009721784367,46.02200275141442],[-92.35004311433549,46.01892526609177],
  [-92.35069181753579,46.0155845545201],[-92.35798817816148,46.01355766111104],
  [-92.37845927040837,46.01582433255544],[-92.41084806943114,46.027488434813165],
  [-92.42021910229711,46.02688020226503],[-92.43501276196822,46.0213486038501],
  [-92.44516873483846,46.01204047567353],[-92.44405793404785,46.00899692290176],
  [-92.45397661086584,45.99582260374385],[-92.45440983663082,45.991430936462024],
  [-92.46455508499537,45.986506284031776],[-92.46477589266013,45.98301977251734],
  [-92.46062900153768,45.97930951481638],[-92.4717507347803,45.97203478196923],
  [-92.48307954973819,45.97597333101041],[-92.49169618100576,45.975521097622845],
  [-92.50161693587044,45.97953366776093],[-92.52223025447171,45.984307483427244],
  [-92.53617783518261,45.9790070812337],[-92.54393824555092,45.97058669324548],
  [-92.55037245170519,45.967706454131644],[-92.54972303775071,45.95640465426564],
  [-92.55179537749963,45.95132337761845],[-92.56259270549882,45.95117136303185],
  [-92.57392185854725,45.94836479148725],[-92.58930068097014,45.94207205772031],
  [-92.6009633987756,45.94108626287303],[-92.60641281863528,45.93964739644605],
  [-92.61524508194714,45.93403726696522],[-92.62222722607818,45.93547892396822],
  [-92.62768208684777,45.93312682731283],[-92.62942763207259,45.932140425419306],
  [-92.63455517116927,45.9341132116632],[-92.64055386905564,45.93244383552084],
  [-92.63879954618031,45.925389343926525],[-92.64086336885292,45.923875102707854],
  [-92.64566112843127,45.924937522723326],[-92.65580430549709,45.924559474651204],
  [-92.67740166445587,45.911433863941625],[-92.67651854038161,45.90582206635213],
  [-92.68459093570753,45.90400287438001],[-92.68948299115368,45.9012002735804],
  [-92.69515023467348,45.89831740042382],[-92.70027913058955,45.895889053717326],
  [-92.7093294304029,45.89437129781325],[-92.71730226003206,45.887008557759685],
  [-92.72721864872182,45.87638609286208],[-92.73605488311308,45.86477574217463],
  [-92.73790705261361,45.86097927570884],[-92.73583648838274,45.85892752998865],
  [-92.73855039114864,45.84831216604661],[-92.74200258079537,45.84404833066941],
  [-92.75443082440133,45.83789702560176],[-92.76533632991868,45.83022541548715],
  [-92.76380944054014,45.82262700380653],[-92.75893192328243,45.81440974569719],
  [-92.75805891184562,45.80513227836599],[-92.7623054613596,45.80019146308308],
  [-92.76919112651521,45.79820999258416],[-92.77988449484573,45.7828405269853],
  [-92.784711928377,45.76344605380601],[-92.80271081220319,45.75127398608137],
  [-92.81109271847126,45.74290922614361],[-92.8246187751604,45.737504155762],
  [-92.82887011106905,45.733470427187655],[-92.83715939180654,45.732175752671566],
  [-92.8430582822328,45.72882235657028],[-92.84948992695631,45.72844333946716],
  [-92.85165464139035,45.7257085318044],[-92.85186950570794,45.72304623493034],
  [-92.86497115156257,45.72174554090955],[-92.86987918302127,45.71557669406005],
  [-92.87154237419303,45.699732937572435],[-92.87045476944982,45.69532128878947],
  [-92.87535011197846,45.68832679753021],[-92.87763212410835,45.669306421221165],
  [-92.8897147711682,45.64076600563689],[-92.88699021488887,45.632690800004326],
  [-92.88656049554432,45.62035028957021],[-92.88200497702506,45.61022098557703],
  [-92.88652799531951,45.59987169932626],[-92.88652563570679,45.594464046667554],
  [-92.88325928110253,45.588368072721295],[-92.88380011655134,45.574800513602725],
  [-92.87323672163394,45.56885298993569],[-92.86975002821855,45.56679447794258],
  [-92.8509064310286,45.56626073252065],[-92.82149599215039,45.560617567203195],
  [-92.80211162622462,45.56237155524684],[-92.78686567625772,45.568014155472866],
  [-92.77346594676354,45.56793803420919],[-92.76475538613033,45.56313222184417],
  [-92.74994346281666,45.55451758874031],[-92.72532319412421,45.539184796948064],
  [-92.72686524059795,45.52844326796924],[-92.72641687121002,45.5131832525675],
  [-92.71172128155476,45.50409539661297],[-92.70072250635415,45.49127331999202],
  [-92.68981024333394,45.474160043464764],[-92.68251510252685,45.46957667238004],
  [-92.67968330357371,45.46346674358094],[-92.6528921340906,45.45452770068147],
  [-92.64625920086682,45.44081511163722],[-92.64942991817877,45.41567825328812],
  [-92.64690357767729,45.41153213525283],[-92.64986096425554,45.40317224796871],
  [-92.65038960427543,45.39848129429589],[-92.65835234902235,45.396099673680254],
  [-92.67034732199623,45.38881533672463],[-92.67789677069041,45.37775577124211],
  [-92.67863350526927,45.37559200707054],[-92.6782406275536,45.3730363548691],
  [-92.68840375218949,45.36843382841249],[-92.69277898386142,45.36515260621425],
  [-92.7023164739107,45.35876217266858],[-92.70399616772657,45.35571926502962],
  [-92.70370110563002,45.35281718465441],[-92.69973430083098,45.34297037826997],
  [-92.69880046297376,45.33606066646024],[-92.70514166807702,45.32600626253881],
  [-92.7114322902651,45.320063467712345],[-92.71697666927425,45.316814800561474],
  [-92.72872446006426,45.30848402134032],[-92.73727751929592,45.300221255472565],
  [-92.74101311544739,45.299149374695446],[-92.7471082891465,45.29527637087838],
  [-92.75089332542757,45.292855683795096],[-92.75880817182677,45.291161281960626],
  [-92.76175755788745,45.289051960043366],[-92.76229829038854,45.28628555110373],
  [-92.76239653203193,45.28258494090417],[-92.75876023933075,45.27461715091306],
  [-92.75369836758313,45.27112403523415],[-92.75197871903299,45.26520974568996],
  [-92.75389573631364,45.2589833470212],[-92.76028431853221,45.252533975319835],
  [-92.75717461566313,45.230996951399646],[-92.7549645004184,45.22369809976962],
  [-92.75165034317182,45.21909815779932],[-92.75417118025292,45.212450100657804],
  [-92.76311673784309,45.205927421975105],[-92.76561993327434,45.199598852731526],
  [-92.76732962275139,45.19227969444836],[-92.7669315582842,45.18504261170057],
  [-92.76471802490826,45.18234588747171],[-92.75251103139388,45.173602992896406],
  [-92.75219888709823,45.16812425944062],[-92.75250061654533,45.166417472090274],
  [-92.75001990467172,45.163828848916694],[-92.74977094709105,45.16189671358546],
  [-92.75016956032154,45.15929700521036],[-92.75091695382451,45.156978281157166],
  [-92.74909029195838,45.14767945630044],[-92.75205288831046,45.14217611448328],
  [-92.74523082375308,45.1223450839515],[-92.73907212052377,45.1157273487714],
  [-92.74567885138975,45.1072131667363],[-92.75498495232263,45.10285031071422],
  [-92.76114743232266,45.09882013255597],[-92.80046811905171,45.070440690660206],
  [-92.80383668556304,45.06062334105184],[-92.78190316814371,45.03901147972911],
  [-92.7665128597353,45.03106783210532],[-92.7628156697259,45.01890046236946],
  [-92.77355320453906,44.994075594713365],[-92.76598862660042,44.97334708985528],
  [-92.7622211525239,44.96300807821922],[-92.75551668815139,44.949750230827334],
  [-92.75082268250296,44.936453658495964],[-92.75781613571846,44.90933557621679],
  [-92.77449399232954,44.90089189968023],[-92.77518288004781,44.89233337405645],
  [-92.76395811790765,44.87173220907121],[-92.77048971042372,44.85398046659179],
  [-92.76729609809438,44.82992502411278],[-92.77544714647242,44.81837949031103],
  [-92.78490275112415,44.80625444268537],[-92.78489376574075,44.794192818368515],
  [-92.80990368137857,44.75438078536138],[-92.71973013917658,44.70820757905656],
  [-92.61446434701242,44.63239902701682],[-92.62021709292112,44.61099047990356],
  [-92.57907473098427,44.59744530279096],[-92.54371790232742,44.57069174189019],
  [-92.40427250765208,44.558722022597664],[-92.32599979416821,44.549268364379344],
  [-92.28487421971475,44.47421666642944],[-92.22801587014935,44.43868335521614],
  [-92.06813212664777,44.40714134567463],[-91.9785853564304,44.36656501356637],
  [-91.9187152061505,44.321950910988164],[-91.90997461919541,44.2823416751865],
  [-91.87316075899342,44.1994333132526],[-91.7308981605008,44.12746263448628],
  [-91.68072637958092,44.09304271862405],[-91.62382760090419,44.05651586039875],
  [-91.40037000358048,43.962998939696604],[-91.30337814173637,43.870112903506424],
  [-91.25796112581385,43.78090552854471],[-91.23669103930027,43.57493814400232],
  [-91.22148773958993,43.422555364337654],[-91.17272280770734,43.3351626131836],
  [-91.0600781099491,43.24545091675313],[-91.16359476164432,43.161112534055576],
  [-91.17272666405093,43.08112111117748],[-91.16511188832857,42.95091686757081],
  [-91.12096179558445,42.88073502114551],[-91.08060235110463,42.82279566827677],
  [-91.0623434321031,42.73112903363355],[-90.70507443122601,42.628906862401436],
  [-90.63050841114462,42.51013504542573],[-90.6306254903303,42.507310664461016],
  [-87.01233315155756,42.49587481660524],[-87.19815766820834,43.428330627615935],
  [-86.7557183428501,44.693645550180946],[-86.4725571746209,45.10732394712639],
  [-86.23363993892796,45.25078524367305],[-85.47264700357087,45.931905785687064],
  [-84.87093116267337,45.85800344499145],[-84.72237511241983,45.85886147343044],
  [-84.27849060090153,46.48788289180416],[-84.43866242020904,46.49103461784338],
  [-84.48672397814124,46.456363600543284],[-84.57136503011023,46.4610979188015],
  [-84.75443160258767,46.63735849571415],[-84.8734214021406,46.88006661550247],
  [-88.38735265637605,48.319769132034764],[-89.36624478762057,47.95230234612339],
  [-89.52355920330466,48.004957789335975],[-90.1308988811548,47.69954478435872],
  [-90.60684453202349,47.62019833165357],[-91.34196599704717,47.17361668906358],
  [-92.1173526833007,46.74871224466631],
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
