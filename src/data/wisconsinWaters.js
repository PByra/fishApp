/**
 * Wisconsin Fishing Locations
 * Organized by: Region > Body of Water > Specific Spots
 * Spots marked dogFriendly:true have trail access for dogs on leash
 */

export const bodiesOfWater = [

  // ═══════════════════════════════════════════════════════
  //  MILWAUKEE REGION
  // ═══════════════════════════════════════════════════════

  {
    id: 'lake-michigan-mke',
    name: 'Lake Michigan',
    region: 'Milwaukee',
    type: 'Great Lake',
    dogFriendly: false,
    description: 'Pier and shore access on Lake Michigan. Premier salmon, lake trout, and perch fishery.',
    fish: ['Chinook Salmon', 'Coho Salmon', 'Lake Trout', 'Steelhead', 'Walleye', 'Yellow Perch'],
    spots: [
      {
        id: 1,
        name: 'McKinley Marina Pier',
        query: 'McKinley Marina Public Fishing Pier Milwaukee WI',
        fish: ['Salmon', 'Lake Trout', 'Perch', 'Walleye'],
        difficulty: 'Easy',
        accessPoint: 'Public fishing pier – free',
        dogFriendly: false,
        notes: 'Milwaukee\'s most popular fishing pier. Railings along the sides. Best spring/fall for salmon runs. Parking in McKinley Marina lot.',
        coords: { lat: 43.0405, lng: -87.9002 },
      },
      {
        id: 2,
        name: 'Bradford Beach',
        query: 'Bradford Beach Milwaukee WI fishing Lake Michigan',
        fish: ['Yellow Perch', 'Salmon', 'Steelhead'],
        difficulty: 'Easy',
        accessPoint: 'Sandy beach shore – free',
        dogFriendly: false,
        notes: 'Shore fishing from the beach. Consistent perch action. North Point pier nearby. Street parking off Wahl Ave.',
        coords: { lat: 43.0550, lng: -87.8900 },
      },
      {
        id: 3,
        name: 'Lakeshore State Park',
        query: 'Lakeshore State Park Fishing Milwaukee WI',
        fish: ['Salmon', 'Lake Trout', 'Walleye', 'Perch'],
        difficulty: 'Easy',
        accessPoint: 'State park shore – free, walk-in only',
        dogFriendly: false,
        notes: 'Man-made island connected by footbridge off Summerfest grounds. Rocky shoreline with steep drop-offs. Lower crowds than McKinley.',
        coords: { lat: 43.0355, lng: -87.8975 },
      },
    ],
  },

  {
    id: 'milwaukee-river',
    name: 'Milwaukee River',
    region: 'Milwaukee',
    type: 'River',
    dogFriendly: true,
    description: 'Urban river with excellent smallmouth bass year-round and steelhead/salmon runs in spring and fall.',
    fish: ['Smallmouth Bass', 'Steelhead', 'Chinook Salmon', 'Walleye', 'Channel Catfish'],
    spots: [
      {
        id: 4,
        name: 'Kletzsch Park Falls',
        query: 'Kletzsch Park Waterfall Milwaukee River fishing Glendale WI',
        fish: ['Steelhead', 'Salmon', 'Smallmouth Bass'],
        difficulty: 'Intermediate',
        accessPoint: 'Park trail to river – free',
        dogFriendly: true,
        notes: 'Top Milwaukee County steelhead/salmon hole – fish the deep pools below the falls. Spring (Mar–Apr) and fall (Sep–Nov). Lot off Green Bay Ave. Dogs OK on trail.',
        coords: { lat: 43.1289, lng: -87.9184 },
      },
      {
        id: 5,
        name: 'Estabrook Park',
        query: 'Estabrook Park Beer Garden parking Milwaukee River fishing',
        fish: ['Smallmouth Bass', 'Walleye', 'Channel Catfish', 'Steelhead'],
        difficulty: 'Easy',
        accessPoint: 'River trail – free',
        dogFriendly: true,
        notes: 'Wide wading areas below Estabrook Dam. Multiple trail entry points. Great summer bass fishing. Lot off Estabrook Drive. Dog-friendly riverside trail.',
        coords: { lat: 43.1083, lng: -87.9038 },
      },
    ],
  },

  {
    id: 'menomonee-river',
    name: 'Menomonee River',
    region: 'Milwaukee',
    type: 'River',
    dogFriendly: true,
    description: 'Underrated river through Wauwatosa and Milwaukee County with solid smallmouth, brown trout, and seasonal steelhead.',
    fish: ['Smallmouth Bass', 'Brown Trout', 'Walleye', 'Steelhead', 'Channel Catfish'],
    spots: [
      {
        id: 10,
        name: 'Hoyt Park – River Parkway',
        query: 'Hoyt Park Menomonee River Parkway parking Wauwatosa WI',
        fish: ['Smallmouth Bass', 'Brown Trout', 'Steelhead'],
        difficulty: 'Easy',
        accessPoint: 'Menomonee River Pkwy parking – free',
        dogFriendly: true,
        notes: 'Great river access along the Menomonee River Pkwy trail. Shaded rocky stretches hold smallmouth and brown trout. Dog-friendly paved trail runs alongside.',
        coords: { lat: 43.0660, lng: -88.0280 },
      },
      {
        id: 11,
        name: 'Menomonee Falls – Lime Kiln Park',
        query: 'Lime Kiln Park Menomonee Falls WI river fishing parking',
        fish: ['Smallmouth Bass', 'Walleye', 'Brown Trout'],
        difficulty: 'Easy',
        accessPoint: 'Village park – free',
        dogFriendly: true,
        notes: 'Upper Menomonee River through the village. Wooded banks with good bass structure. Dog-friendly park and trail. Historically a walleye hold-up spot below the falls.',
        coords: { lat: 43.1480, lng: -88.1160 },
      },
    ],
  },

  {
    id: 'kettle-moraine-south',
    name: 'Kettle Moraine – Southern Unit',
    region: 'Milwaukee',
    type: 'State Park Lakes',
    dogFriendly: true,
    description: '~45 min SW of Milwaukee. Glacial lakes inside Kettle Moraine State Forest. Dogs on leash on all trails. Excellent hiking + fishing combo.',
    fish: ['Largemouth Bass', 'Bluegill', 'Crappie', 'Northern Pike', 'Yellow Perch'],
    spots: [
      {
        id: 12,
        name: 'Ottawa Lake Recreation Area',
        query: 'Ottawa Lake Recreation Area Kettle Moraine Southern Unit parking lot WI',
        fish: ['Largemouth Bass', 'Bluegill', 'Crappie', 'Northern Pike'],
        difficulty: 'Easy',
        accessPoint: 'State park lot (vehicle sticker or day pass)',
        dogFriendly: true,
        notes: 'Main lake in Kettle Moraine South. Shore fishing from campground banks and picnic area. Bass and bluegill action. Dogs on leash on all trails – great half-day fishing + hiking spot.',
        coords: { lat: 42.8840, lng: -88.3940 },
      },
      {
        id: 13,
        name: 'Whitewater Lake',
        query: 'Whitewater Lake Kettle Moraine Southern Unit boat launch parking WI',
        fish: ['Largemouth Bass', 'Walleye', 'Northern Pike', 'Yellow Perch'],
        difficulty: 'Intermediate',
        accessPoint: 'Public boat launch / shore – vehicle sticker',
        dogFriendly: true,
        notes: 'Larger glacial lake on the south end of Kettle Moraine. Better for walleye and pike than Ottawa. Public shore access. Dogs welcome on adjacent trail system.',
        coords: { lat: 42.8360, lng: -88.7230 },
      },
    ],
  },

  {
    id: 'harrington-beach-sp',
    name: 'Harrington Beach State Park',
    region: 'Milwaukee',
    type: 'State Park – Lake Michigan & Quarry',
    dogFriendly: true,
    description: '~45 min N of Milwaukee. Lake Michigan shoreline + an inland quarry lake. Dogs on leash on all trails. Excellent combo trip.',
    fish: ['Yellow Perch', 'Chinook Salmon', 'Steelhead', 'Largemouth Bass', 'Bluegill'],
    spots: [
      {
        id: 14,
        name: 'Harrington Beach – Lake Michigan Shore',
        query: 'Harrington Beach State Park main parking lot Belgium WI',
        fish: ['Yellow Perch', 'Salmon', 'Steelhead'],
        difficulty: 'Easy',
        accessPoint: 'State park lot (vehicle sticker or day pass)',
        dogFriendly: true,
        notes: 'Over a mile of Lake Michigan shoreline. Shore cast for perch and seasonal salmon/steelhead runs. Dogs on leash allowed on beach trails year-round. Point to main parking lot.',
        coords: { lat: 43.4980, lng: -87.8170 },
      },
      {
        id: 15,
        name: 'Harrington Beach – Quarry Lake',
        query: 'Harrington Beach State Park Quarry Lake trail parking Belgium WI',
        fish: ['Largemouth Bass', 'Bluegill', 'Crappie'],
        difficulty: 'Easy',
        accessPoint: 'Short trail from main lot (~0.4 mi)',
        dogFriendly: true,
        notes: 'Peaceful inland quarry lake within the park. Warm-water bass and bluegill. Bring a light setup. Dogs on leash. Great short hike to a quiet fishing hole.',
        coords: { lat: 43.5030, lng: -87.8170 },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  //  MAUSTON REGION
  // ═══════════════════════════════════════════════════════

  {
    id: 'castle-rock-lake',
    name: 'Castle Rock Lake / Wisconsin River',
    region: 'Mauston',
    type: 'Reservoir & River',
    dogFriendly: false,
    description: "Wisconsin's 4th largest lake. Trophy walleye, musky and pike. Connected to Wisconsin River above and below the dam.",
    fish: ['Walleye', 'Musky', 'Northern Pike', 'Largemouth Bass', 'Yellow Perch'],
    spots: [
      {
        id: 6,
        name: 'Riverside Park Boat Launch',
        query: 'Riverside Park Mauston WI Boat Launch Wisconsin River',
        fish: ['Walleye', 'Northern Pike', 'Largemouth Bass'],
        difficulty: 'Easy',
        accessPoint: 'City boat launch – free',
        dogFriendly: false,
        notes: 'City of Mauston launch on the Wisconsin River. Good walleye fishing up and downstream. Shore access available.',
        coords: { lat: 43.7966, lng: -90.0802 },
      },
      {
        id: 7,
        name: 'Castle Rock County Park',
        query: 'Castle Rock County Park Boat Ramp Juneau County WI',
        fish: ['Walleye', 'Musky', 'Northern Pike', 'Perch'],
        difficulty: 'Intermediate',
        accessPoint: 'County boat ramp – fee may apply',
        dogFriendly: false,
        notes: 'Main access to Castle Rock Lake. Large ramp for bigger boats. Musky trolling popular in open water.',
        coords: { lat: 43.9183, lng: -90.0502 },
      },
      {
        id: 8,
        name: 'Castle Rock Dam Tailwaters',
        query: 'Castle Rock Dam Public Fishing Area Wisconsin River',
        fish: ['Walleye', 'Northern Pike', 'Perch', 'Catfish'],
        difficulty: 'Intermediate',
        accessPoint: 'Dam public fishing area – free',
        dogFriendly: false,
        notes: 'Shore fishing below the dam. Walleye concentrate here in spring. No boat required. Good catfish at night.',
        coords: { lat: 43.9117, lng: -90.0650 },
      },
    ],
  },

  {
    id: 'lemonweir-river',
    name: 'Lemonweir River',
    region: 'Mauston',
    type: 'River',
    dogFriendly: false,
    description: 'Winding river that feeds into the Wisconsin River near Mauston. Underrated walleye and smallmouth fishery.',
    fish: ['Walleye', 'Smallmouth Bass', 'Channel Catfish', 'Northern Pike'],
    spots: [
      {
        id: 9,
        name: 'Lemonweir Mills Access',
        query: 'Lemonweir Mills Public Fishing Access Mauston WI',
        fish: ['Walleye', 'Smallmouth Bass', 'Channel Catfish'],
        difficulty: 'Easy',
        accessPoint: 'Public river access – free',
        dogFriendly: false,
        notes: 'Good public access on the Lemonweir. Shore fishing and wading for walleye and bass. Low-pressure local spot.',
        coords: { lat: 43.7966, lng: -90.1100 },
      },
    ],
  },
];

export const getWatersByRegion = (region) =>
  bodiesOfWater.filter(w => w.region === region);

export const getRegions = () => [...new Set(bodiesOfWater.map(w => w.region))];

export const getAllSpots = () =>
  bodiesOfWater.flatMap(water =>
    water.spots.map(spot => ({ ...spot, waterName: water.name, region: water.region, dogFriendly: spot.dogFriendly }))
  );

export const searchSpots = (term) => {
  if (!term || !term.trim()) return getAllSpots();
  const q = term.toLowerCase();
  return getAllSpots().filter(
    s =>
      s.name.toLowerCase().includes(q) ||
      s.fish.some(f => f.toLowerCase().includes(q)) ||
      s.waterName.toLowerCase().includes(q)
  );
};

// Legacy compat
export const wisconsinLocations = bodiesOfWater.flatMap(w =>
  w.spots.map(s => ({ id: s.id, name: s.name, region: w.region, query: s.query, fish: s.fish, difficulty: s.difficulty, accessPoint: s.accessPoint }))
);
export const searchLocations = searchSpots;

export default bodiesOfWater;
