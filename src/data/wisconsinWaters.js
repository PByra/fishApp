/**
 * Wisconsin Fishing Locations
 * Organized by: Region > Body of Water > Specific Spots
 * Regions: Southeast | South Central | Northeast | Northern | West Central
 * Spots marked dogFriendly:true have trail/shore access for dogs on leash
 */

export const bodiesOfWater = [

  // ═══════════════════════════════════════════════════════
  //  SOUTHEAST REGION
  // ═══════════════════════════════════════════════════════

  {
    id: 'lake-michigan-mke',
    name: 'Lake Michigan',
    region: 'Southeast',
    type: 'Great Lake',
    dogFriendly: false,
    description: 'Pier and shore access on Lake Michigan along the Milwaukee lakefront. Premier salmon, lake trout, and perch fishery. Spring and fall salmon/steelhead runs draw crowds to the piers.',
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
        notes: 'Milwaukee\'s most popular and productive fishing pier. Railings along both sides make it accessible for all skill levels. Best action in spring (Apr–May) and fall (Sep–Nov) for Chinook and Coho salmon runs. Perch fishing can be excellent in summer near the pier base. Parking in the McKinley Marina lot off Lincoln Memorial Drive — can fill up on weekends. No dogs on the pier.',
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
        notes: 'Shore fishing from the sandy beach and the rocky North Point breakwater nearby. Consistent yellow perch action throughout summer, especially early morning. Steelhead and coho move through in spring. Street parking available off Wahl Ave — busy in summer beach season so arrive early. No dogs on beach May–Oct.',
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
        notes: 'Man-made island connected by a footbridge off the Summerfest grounds on Harbor Drive. Rocky shoreline with steep drop-offs — ideal for jigging or casting spoons for lake trout. Lower crowds than McKinley Marina pier. No vehicle entry; park on Harbor Drive and walk the bridge. Good low-pressure alternative during busy weekends.',
        coords: { lat: 43.0355, lng: -87.8975 },
      },
    ],
  },

  {
    id: 'milwaukee-river',
    name: 'Milwaukee River',
    region: 'Southeast',
    type: 'River',
    dogFriendly: true,
    description: 'Urban river flowing south through Glendale and Milwaukee County with excellent smallmouth bass year-round. Significant steelhead and Chinook salmon runs in spring (Mar–May) and fall (Sep–Nov). Multiple park entry points along the parkway system.',
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
        notes: 'The premier Milwaukee County steelhead and salmon run spot. Fish the deep plunge pools and eddies directly below the falls — fish stack up here waiting to ascend. Spring run peaks mid-March through late April; fall salmon run peaks October. Wading recommended but watch the current after heavy rain. Lot off Green Bay Ave. Dog-friendly trail runs along the river.',
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
        notes: 'Wide, wadeable stretches below Estabrook Dam. Multiple trail entry points along the river. Excellent summer smallmouth bass fishing — work the rocky structure and current seams with tubes or swimbaits. Catfish are active after dark from the bank. Dog-friendly riverside trail runs the length of the park. Lot off Estabrook Drive; the famous Estabrook Beer Garden is a welcome post-fish stop.',
        coords: { lat: 43.1083, lng: -87.9038 },
      },
    ],
  },

  {
    id: 'menomonee-river',
    name: 'Menomonee River',
    region: 'Southeast',
    type: 'River',
    dogFriendly: true,
    description: 'Underrated urban river through Wauwatosa and western Milwaukee County. Solid smallmouth bass and brown trout throughout the season, plus seasonal steelhead. Clear-running stretches with rocky substrate hold surprisingly high-quality fish for a metro fishery.',
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
        notes: 'Great river access along the Menomonee River Parkway trail system. Shaded rocky stretches hold smallmouth and resident brown trout throughout summer. Spring steelhead pass through March–April. Wading is generally safe in normal flows — check USGS gauge before entering after rain. Dog-friendly paved trail runs alongside the river for a long stretch. Low fishing pressure for a metro river.',
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
        notes: 'Upper Menomonee River through the village of Menomonee Falls. Wooded banks with good bass structure — boulders, logs, and current breaks. Historically a walleye hold-up spot below the old falls area, especially in fall. Brown trout present in cooler months. Dog-friendly park and trail system. Good access from the village center with free parking.',
        coords: { lat: 43.1480, lng: -88.1160 },
      },
    ],
  },

  {
    id: 'kettle-moraine-south',
    name: 'Kettle Moraine – Southern Unit',
    region: 'Southeast',
    type: 'State Park Lakes',
    dogFriendly: true,
    description: 'About 45 minutes southwest of Milwaukee. Glacial lakes embedded in Kettle Moraine State Forest — Southern Unit. WI State Park vehicle sticker required. Dogs on leash on all trails. Excellent hiking and fishing combo destination.',
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
        notes: 'The main lake in Kettle Moraine South. Shore fishing from the campground banks and picnic area is productive for bass and bluegill, especially around the reed edges in summer. Small boats and canoes welcome. Dogs on leash allowed on all trails — great half-day fishing and hiking destination. State park vehicle sticker required at the lot.',
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
        notes: 'Larger glacial lake on the south end of Kettle Moraine. Better walleye and northern pike fishing than Ottawa Lake — work the weedlines at dawn and dusk. Boat launch available. Shore access points along the adjacent trail. Dogs welcome on the adjacent Kettle Moraine trail system. State park vehicle sticker required.',
        coords: { lat: 42.8360, lng: -88.7230 },
      },
    ],
  },

  {
    id: 'harrington-beach-sp',
    name: 'Harrington Beach State Park',
    region: 'Southeast',
    type: 'State Park – Lake Michigan & Quarry',
    dogFriendly: true,
    description: 'About 45 minutes north of Milwaukee near Belgium, WI. Lake Michigan shoreline access plus a peaceful inland quarry lake. Dogs on leash on all trails year-round. An excellent combo trip — fish Lake Michigan in the morning, hike to the quarry in the afternoon.',
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
        notes: 'Over a mile of Lake Michigan shoreline within the park. Shore cast for yellow perch in summer and early fall. Seasonal Chinook salmon and steelhead runs move through in spring (Apr–May) and fall (Sep–Oct). Dogs on leash are allowed on the beach trails year-round — one of the few Lake Michigan parks that allows it. State park vehicle sticker required. Navigate to the main parking lot.',
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
        notes: 'A peaceful inland quarry lake accessed via a short 0.4-mile trail from the main parking area. Clear water and a unique rock-walled setting. Warm-water bass and bluegill throughout summer. Bring a light spinning or panfish setup. Dogs on leash welcome on the trail and along the lake. A great spot when Lake Michigan is rough or unfishable.',
        coords: { lat: 43.5030, lng: -87.8170 },
      },
    ],
  },

  {
    id: 'geneva-lake',
    name: 'Geneva Lake',
    region: 'Southeast',
    type: 'Glacial Lake',
    dogFriendly: false,
    description: 'Pristine glacial lake in Walworth County — one of the clearest and deepest lakes in SE Wisconsin. Trophy largemouth bass, northern pike, and walleye. NOTE: Nearly all shoreline is private. Public access is limited to the public boat launch and pier area in the city of Lake Geneva. Shore fishing outside the designated public area is not permitted.',
    fish: ['Largemouth Bass', 'Smallmouth Bass', 'Northern Pike', 'Walleye', 'Bluegill'],
    spots: [
      {
        id: 16,
        name: 'Lake Geneva Public Boat Launch',
        query: 'Lake Geneva Public Boat Launch Lake Geneva WI',
        fish: ['Largemouth Bass', 'Smallmouth Bass', 'Northern Pike', 'Walleye', 'Bluegill'],
        difficulty: 'Easy',
        accessPoint: 'City public boat launch – fee may apply',
        dogFriendly: false,
        notes: 'The primary legal public access on Geneva Lake. Trophy largemouth bass are present along the deep weedlines; smallmouth bass relate to the rocky drop-offs. Northern pike and walleye are present but can be pressure-sensitive. IMPORTANT: Geneva Lake has almost entirely private shoreline — the public boat launch and the adjacent pier are the only legal shore-fishing access points. Float tubes and kayaks may only be launched from the public launch area. No dogs at this launch. Summer boat traffic is heavy — early morning fishing recommended.',
        coords: { lat: 42.5898, lng: -88.4346 },
      },
    ],
  },

  {
    id: 'delavan-lake',
    name: 'Delavan Lake',
    region: 'Southeast',
    type: 'Glacial Lake',
    dogFriendly: false,
    description: 'Walworth County glacial lake with the best musky fishing in SE Wisconsin. Delavan Lake has undergone significant restoration and now supports a world-class musky and walleye fishery. Clear water with deep structure and excellent weed growth.',
    fish: ['Musky', 'Walleye', 'Largemouth Bass', 'Northern Pike', 'Crappie'],
    spots: [
      {
        id: 17,
        name: 'Delavan Lake Public Boat Launch',
        query: 'Delavan Lake Public Boat Launch Delavan WI',
        fish: ['Musky', 'Walleye', 'Largemouth Bass', 'Northern Pike', 'Crappie'],
        difficulty: 'Easy',
        accessPoint: 'Public boat launch – free',
        dogFriendly: false,
        notes: 'Gateway to one of the top musky fisheries in SE Wisconsin. Trophy musky in the 40–50 inch range are regularly reported — work large bucktails and swimbaits along the deep weedlines at dawn. Walleye fishing is excellent in spring around the rocky points. Crappie action in the shallows during spring spawn. No dogs at the launch. Boat is essentially required for best results — limited shore access. Check current musky regulations for size and bag limits before fishing.',
        coords: { lat: 42.6294, lng: -88.5870 },
      },
    ],
  },

  {
    id: 'big-muskego-lake',
    name: 'Big Muskego Lake',
    region: 'Southeast',
    type: 'Natural Lake',
    dogFriendly: false,
    description: 'Natural lake in Waukesha County near the Milwaukee metro area. Good bass and panfish lake with surprisingly consistent bluegill and crappie action. Accessible public launch makes it a convenient local option.',
    fish: ['Largemouth Bass', 'Bluegill', 'Crappie', 'Yellow Perch', 'Northern Pike'],
    spots: [
      {
        id: 18,
        name: 'Big Muskego Lake Public Boat Access',
        query: 'Big Muskego Lake Public Boat Access Muskego WI',
        fish: ['Largemouth Bass', 'Bluegill', 'Crappie', 'Yellow Perch', 'Northern Pike'],
        difficulty: 'Easy',
        accessPoint: 'Public boat access – free',
        dogFriendly: false,
        notes: 'Public boat access on Big Muskego Lake. Excellent bluegill and crappie fishing in summer — concentrate near the submerged weed edges and docks in the 6–12 foot range with a small jig or bobber rig. Largemouth bass hold in the shallow weedy bays in warmer months. Northern pike cruise the weedlines. Good option for a close-to-Milwaukee family panfish outing. No dogs at the launch.',
        coords: { lat: 42.8878, lng: -88.1423 },
      },
    ],
  },

  {
    id: 'pike-lake-sp',
    name: 'Pike Lake (Kettle Moraine North)',
    region: 'Southeast',
    type: 'State Park Lake',
    dogFriendly: true,
    description: 'State park lake within the Northern Unit of Kettle Moraine State Forest near Hartford. Excellent walleye and bass fishery in a scenic glacial setting. WI State Park vehicle sticker required. Dog-friendly trails throughout the park.',
    fish: ['Walleye', 'Largemouth Bass', 'Smallmouth Bass', 'Bluegill', 'Crappie'],
    spots: [
      {
        id: 19,
        name: 'Pike Lake State Park Boat Launch',
        query: 'Pike Lake State Park Boat Launch Hartford WI',
        fish: ['Walleye', 'Largemouth Bass', 'Smallmouth Bass', 'Bluegill', 'Crappie'],
        difficulty: 'Easy',
        accessPoint: 'State park boat launch (vehicle sticker required)',
        dogFriendly: true,
        notes: 'Well-maintained boat launch on Pike Lake within Kettle Moraine Northern Unit. Walleye fishing is best at dawn and dusk along the deeper breaks — jigging and live-crawler rigs both produce. Largemouth and smallmouth bass hold near the rocky shoreline structure. Crappie and bluegill in the shallows during spring. State park vehicle sticker required at all times. Dog-friendly hiking trails throughout the park make this a great all-day outing. No wake zone near the swim beach — be courteous of non-anglers.',
        coords: { lat: 43.3617, lng: -88.3356 },
      },
    ],
  },

  {
    id: 'root-river',
    name: 'Root River',
    region: 'Southeast',
    type: 'River',
    dogFriendly: true,
    description: 'The best Lake Michigan tributary in SE Wisconsin for salmon and trout runs. The Root River Steelhead Facility in Racine provides structured access for the famous spring steelhead and fall salmon runs. Dog-friendly paved trail runs along the river corridor.',
    fish: ['Steelhead', 'Chinook Salmon', 'Coho Salmon', 'Brown Trout'],
    spots: [
      {
        id: 20,
        name: 'Root River Steelhead Facility',
        query: 'Root River Steelhead Facility Racine WI',
        fish: ['Steelhead', 'Chinook Salmon', 'Coho Salmon', 'Brown Trout'],
        difficulty: 'Intermediate',
        accessPoint: 'WDNR steelhead facility – free, walk-in',
        dogFriendly: true,
        notes: 'The premier SE Wisconsin spot for migratory fish. Spring steelhead run peaks mid-March through early May — use spawn sacks, jigs under a float, or small spoons in the plunge pools and current seams. Fall Chinook and Coho salmon enter September through November. SPECIAL REGULATIONS: Steelhead are catch-and-release only outside the designated harvest period — check current WI DNR regulations before keeping any fish, as rules can change season to season. Brown trout are present year-round in the deeper stretches. Dog-friendly paved trail follows the river. Can get crowded during peak runs — arrive at first light.',
        coords: { lat: 42.7205, lng: -87.9032 },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  //  SOUTH CENTRAL REGION
  // ═══════════════════════════════════════════════════════

  {
    id: 'castle-rock-lake',
    name: 'Castle Rock Lake / Wisconsin River',
    region: 'South Central',
    type: 'Reservoir & River',
    dogFriendly: false,
    description: "Wisconsin's 4th largest lake at roughly 14,000 acres. Trophy walleye, musky, and pike. Castle Rock is connected to the Wisconsin River above and below the dam — the tailwaters below the dam are particularly productive for walleye in spring.",
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
        notes: 'City of Mauston launch on the Wisconsin River, providing access to the lower flowage and main river channel. Good walleye fishing both up and downstream — jig or troll along the channel edges. Shore access available from the park. Convenient launch for a day trip on the water without driving to the main lake.',
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
        notes: 'Main access point to Castle Rock Lake proper. Larger concrete ramp that can handle bigger boats — good for musky trolling setups on this big water. Walleye are best at dawn and dusk working the rocky points and weedlines. Musky trolling with large stick baits in open water produces well in summer. Fee may apply at the county ramp — bring cash or check current county park fees. No shore fishing from the ramp area.',
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
        notes: 'Shore fishing below the Castle Rock Dam on the Wisconsin River. Walleye concentrate in the turbulent tailwater in spring — March through May is peak time. No boat required; work jigs or crawler rigs from the bank into the current breaks and eddies. Channel catfish are active from the bank on summer nights with cut bait. Some rocky scrambling needed to reach the best spots below the structure.',
        coords: { lat: 43.9117, lng: -90.0650 },
      },
    ],
  },

  {
    id: 'lemonweir-river',
    name: 'Lemonweir River',
    region: 'South Central',
    type: 'River',
    dogFriendly: false,
    description: 'A winding river that feeds into the Wisconsin River near Mauston. An underrated and low-pressure walleye and smallmouth bass fishery. Clear water and sand/gravel bottom make for good wading. Minimal crowds compared to Castle Rock Lake.',
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
        notes: 'Good public access point on the Lemonweir River. Shore fishing and wading for walleye and smallmouth bass. Walleye are most active at dawn and dusk — fish the deeper pools below any current breaks. Smallmouth bass throughout the gravel runs in summer. Low-pressure local spot that receives a fraction of the traffic of the nearby Wisconsin River fisheries. Light spinning or fly gear works well here.',
        coords: { lat: 43.7966, lng: -90.1100 },
      },
    ],
  },

  {
    id: 'lake-monona',
    name: 'Lake Monona',
    region: 'South Central',
    type: 'Natural Lake',
    dogFriendly: true,
    description: 'Urban Madison lake surrounded by the city and the UW-Madison campus. Trophy musky and walleye fishery with surprisingly low fishing pressure for its quality. Connected to Lake Mendota via the Yahara River. Free public launches available.',
    fish: ['Musky', 'Walleye', 'Largemouth Bass', 'Smallmouth Bass', 'Yellow Perch'],
    spots: [
      {
        id: 21,
        name: 'Law Park Boat Launch, Madison',
        query: 'Law Park Boat Launch Madison WI Lake Monona',
        fish: ['Musky', 'Walleye', 'Largemouth Bass', 'Smallmouth Bass', 'Yellow Perch'],
        difficulty: 'Easy',
        accessPoint: 'City boat launch – free launch, metered street parking',
        dogFriendly: true,
        notes: 'Madison\'s most accessible Lake Monona launch, located right off John Nolen Drive. Free boat launch with metered parking nearby on John Nolen Dr. Trophy musky in the 40–50+ inch range have been taken here — work large glide baits and figure-eight at the boat. Walleye fishing is excellent in spring near the Yahara River inlet at the east end. Smallmouth bass relate to the rocky riprap along the causeway. Good dog-friendly shoreline access along the adjacent Capitol City State Trail. Boat traffic can be heavy on summer weekends — early morning is best.',
        coords: { lat: 43.0651, lng: -89.3837 },
      },
    ],
  },

  {
    id: 'lake-mendota',
    name: 'Lake Mendota',
    region: 'South Central',
    type: 'Natural Lake',
    dogFriendly: true,
    description: '"The Jewel of Madison" — UW-Madison\'s research lake and a world-class fishery. One of the most studied lakes in North America. Dense walleye and musky populations. Surrounded by the city on three sides but fishing quality rivals any Northwoods lake. Connected to Lake Monona via the Yahara River.',
    fish: ['Walleye', 'Musky', 'Largemouth Bass', 'Smallmouth Bass', 'White Bass', 'Yellow Perch'],
    spots: [
      {
        id: 22,
        name: 'Tenney Park Boat Launch',
        query: 'Tenney Park Boat Launch Madison WI Lake Mendota',
        fish: ['Walleye', 'Musky', 'Largemouth Bass', 'Smallmouth Bass', 'White Bass', 'Yellow Perch'],
        difficulty: 'Easy',
        accessPoint: 'City park boat launch – free',
        dogFriendly: true,
        notes: 'Iconic Madison fishing spot at the northeast end of Lake Mendota, right where the Yahara River enters. Free boat launch in the city park. Walleye congregate near the Yahara River mouth in spring — one of the most reliable walleye bites in South Central WI during the April run. White bass school up in the same area in late spring. Musky are present throughout the lake — troll the deeper basin edges in summer. Dog-friendly park with shoreline walk. Good shore fishing access from Tenney Park itself for those without a boat.',
        coords: { lat: 43.0839, lng: -89.3605 },
      },
    ],
  },

  {
    id: 'lake-koshkonong',
    name: 'Lake Koshkonong',
    region: 'South Central',
    type: 'Natural Lake',
    dogFriendly: false,
    description: 'Massive shallow lake on the Rock River near Fort Atkinson. One of Wisconsin\'s best walleye lakes, with giant fish regularly reported. Also known for exceptional channel catfish and flathead catfish fishing. Low fishing pressure relative to its size and quality — many anglers overlook this gem.',
    fish: ['Walleye', 'Channel Catfish', 'Flathead Catfish', 'Largemouth Bass', 'Bluegill', 'Crappie'],
    spots: [
      {
        id: 23,
        name: 'Lake Koshkonong Public Access',
        query: 'Lake Koshkonong Public Access Fort Atkinson WI',
        fish: ['Walleye', 'Channel Catfish', 'Flathead Catfish', 'Largemouth Bass', 'Bluegill', 'Crappie'],
        difficulty: 'Easy',
        accessPoint: 'Public boat access – free',
        dogFriendly: false,
        notes: 'Primary public access to Lake Koshkonong on the Rock River system. Walleye fishing is excellent — the shallow, weedy lake supports a dense population and trophy fish over 25 inches are taken regularly. Work slip bobbers with live crawlers over the weedflats at dusk. Channel catfish and flathead catfish are exceptional here in summer nights — fish cut bait or live bluegill on the bottom near structure. Largemouth bass and panfish round out a full day. Low pressure fishery that is often overlooked by SE Wisconsin anglers focused on Walworth County lakes.',
        coords: { lat: 42.7027, lng: -88.9697 },
      },
    ],
  },

  {
    id: 'prairie-du-sac-tailwaters',
    name: 'Wisconsin River — Prairie du Sac Tailwaters',
    region: 'South Central',
    type: 'River — Tailwaters',
    dogFriendly: false,
    description: 'World-class tailwater fishery below the Merrimac/Prairie du Sac Dam on the Wisconsin River. Year-round open water due to the dam discharge. Trophy sauger, walleye, and catfish. Consistently ranked among the best tailwaters in the entire Midwest. Ice-free water makes it a top winter destination.',
    fish: ['Walleye', 'Sauger', 'Channel Catfish', 'Northern Pike', 'White Bass'],
    spots: [
      {
        id: 24,
        name: 'Prairie du Sac Dam Public Fishing Area',
        query: 'Prairie du Sac Dam Public Fishing Area Prairie du Sac WI Wisconsin River',
        fish: ['Walleye', 'Sauger', 'Channel Catfish', 'Northern Pike', 'White Bass'],
        difficulty: 'Easy',
        accessPoint: 'WDNR public fishing area – free',
        dogFriendly: false,
        notes: 'One of the finest tailwater fisheries in the Midwest. Sauger and walleye stack in the turbulent water below the dam year-round — this is the spot in South Central WI when the inland lakes are frozen. Jig directly into the current seams with 1/4–1/2 oz lead-head jigs in white or chartreuse. White bass school up in massive numbers in late spring below the dam. Channel catfish take cut bait from the bank in summer. REGULATIONS: Walleye slot limits apply on this stretch of the Wisconsin River — check current WI DNR regulations before keeping fish, as slot limits are actively enforced and subject to change. Shore fishing access is excellent from the public fishing area.',
        coords: { lat: 43.3019, lng: -89.7318 },
      },
    ],
  },

  {
    id: 'petenwell-flowage',
    name: 'Petenwell Flowage',
    region: 'South Central',
    type: 'Reservoir',
    dogFriendly: false,
    description: 'The second largest lake in Wisconsin at approximately 23,000 acres. Trophy walleye, musky, and northern pike on big open water. Part of the Wisconsin River chain with Castle Rock Lake to the south. Excellent spring walleye bite and world-class summer musky trolling.',
    fish: ['Walleye', 'Musky', 'Northern Pike', 'Largemouth Bass', 'Yellow Perch'],
    spots: [
      {
        id: 25,
        name: 'Petenwell County Park Boat Launch',
        query: 'Petenwell County Park Boat Launch Adams County WI',
        fish: ['Walleye', 'Musky', 'Northern Pike', 'Largemouth Bass', 'Yellow Perch'],
        difficulty: 'Easy',
        accessPoint: 'County park boat launch – fee may apply',
        dogFriendly: false,
        notes: 'Primary access to the massive Petenwell Flowage. Big water demands big gear — musky trolling in summer with large stick baits and bucktails over the mid-lake humps and submerged structure is very productive. Walleye bite best in spring around the rocky points and dam structure and again in fall. Northern pike in the shallower back bays. This is a big-water fishery — a seaworthy boat and checking the weather before launching is strongly recommended. County park fee may apply; bring cash.',
        coords: { lat: 44.0197, lng: -89.8497 },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  //  NORTHEAST REGION
  // ═══════════════════════════════════════════════════════

  {
    id: 'lake-winnebago',
    name: 'Lake Winnebago',
    region: 'Northeast',
    type: 'Natural Lake',
    dogFriendly: false,
    description: 'Wisconsin\'s largest inland lake at 137,000+ acres — truly big water. Nicknamed "The Walleye Capital of Wisconsin." Home to the famous February sturgeon spearing season, which draws thousands of participants to spearing shanties across the ice. A unique Wisconsin fishing experience unlike anything else in the Midwest.',
    fish: ['Walleye', 'Lake Sturgeon', 'White Bass', 'Yellow Perch', 'Freshwater Drum', 'Channel Catfish'],
    spots: [
      {
        id: 26,
        name: 'High Cliff State Park Boat Launch',
        query: 'High Cliff State Park Boat Launch Sherwood WI Lake Winnebago',
        fish: ['Walleye', 'Lake Sturgeon', 'White Bass', 'Yellow Perch', 'Freshwater Drum', 'Channel Catfish'],
        difficulty: 'Easy',
        accessPoint: 'State park boat launch (vehicle sticker required)',
        dogFriendly: false,
        notes: 'Excellent launch access on the northwest shore of Lake Winnebago at High Cliff State Park. Premier walleye fishing — troll crawler harnesses or jig the rocky bluff edges at dawn. White bass schooling action can be explosive in late spring. Yellow perch are consistent around the rocky structure. SPECIAL REGULATIONS: Lake Sturgeon spearing in February requires a SEPARATE Wisconsin sturgeon spearing license — it is not included in a standard fishing license. Spearing season is short and highly regulated with a lake-wide quota. Walleye slot limit is in effect on Lake Winnebago — check current WI DNR regulations before keeping any walleye. State park vehicle sticker required.',
        coords: { lat: 44.1553, lng: -88.2782 },
      },
    ],
  },

  {
    id: 'fox-river-de-pere',
    name: 'Fox River (De Pere)',
    region: 'Northeast',
    type: 'River',
    dogFriendly: true,
    description: 'The spring walleye run below the De Pere dam is one of the most reliable and spectacular walleye runs in all of Wisconsin. Every March and April, massive numbers of walleye stack below the dam on their spawning run up from Green Bay. Shore fishing access is excellent and crowds are manageable compared to the fish density.',
    fish: ['Walleye', 'White Bass', 'Smallmouth Bass', 'Yellow Perch', 'Channel Catfish'],
    spots: [
      {
        id: 27,
        name: 'Voyageur Park Boat Launch, De Pere',
        query: 'Voyageur Park Boat Launch De Pere WI Fox River',
        fish: ['Walleye', 'White Bass', 'Smallmouth Bass', 'Yellow Perch', 'Channel Catfish'],
        difficulty: 'Easy',
        accessPoint: 'City park boat launch – free',
        dogFriendly: true,
        notes: 'The go-to access point for the famous De Pere walleye run. Walleye arrive below the dam as early as mid-March, peaking in April when water temps hit 40–45°F. Shore fishing from the west bank below the dam is excellent — jig with 1/8–1/4 oz jigs in orange, yellow, or chartreuse on a light line. Boat anglers can anchor below the dam in the current. White bass school through in late May in impressive numbers. Smallmouth bass and perch provide summer action. Dog-friendly park and river trail. This is a must-fish event for any NE Wisconsin angler — the March–April walleye run is genuinely spectacular.',
        coords: { lat: 44.4486, lng: -88.0652 },
      },
    ],
  },

  {
    id: 'sturgeon-bay',
    name: 'Sturgeon Bay (Door County)',
    region: 'Northeast',
    type: 'Bay — Lake Michigan',
    dogFriendly: false,
    description: 'World-class smallmouth bass fishery in Door County. Crystal-clear water and rocky limestone structure make Sturgeon Bay one of the finest smallmouth destinations in the entire Great Lakes region. Also provides direct access to Lake Michigan for lake trout, brown trout, and salmon — either by boat or via local charter services.',
    fish: ['Smallmouth Bass', 'Chinook Salmon', 'Lake Trout', 'Brown Trout', 'Steelhead'],
    spots: [
      {
        id: 28,
        name: 'Sawyer Park Boat Launch, Sturgeon Bay',
        query: 'Sawyer Park Boat Launch Sturgeon Bay WI',
        fish: ['Smallmouth Bass', 'Chinook Salmon', 'Lake Trout', 'Brown Trout', 'Steelhead'],
        difficulty: 'Easy',
        accessPoint: 'City park boat launch – free',
        dogFriendly: false,
        notes: 'Primary public launch on Sturgeon Bay. World-class smallmouth bass fishing from June through September — the clear, rock-strewn bay produces smallmouth in the 3–5 lb range regularly. Tube baits, drop-shot rigs, and small swimbaits all produce on the rocky structure visible in the transparent water. From here you can also run out to Lake Michigan for Chinook and Coho salmon (best July–August) and lake trout — or book a charter at the nearby marina. Brown trout and steelhead are taken close to the bay mouth in spring. No dogs at the city launch. This is genuinely one of the best smallmouth fisheries in the country.',
        coords: { lat: 44.8327, lng: -87.3809 },
      },
    ],
  },

  {
    id: 'wolf-river-fremont',
    name: 'Wolf River',
    region: 'Northeast',
    type: 'River',
    dogFriendly: true,
    description: 'Famous throughout Wisconsin for the spring white bass run in Fremont and the Northwoods segments above. Wild and scenic river with excellent walleye and musky fishing year-round. The river transitions from warm-water fishery in the lower stretches near Lake Poygan to a more diverse cold-water system in the upper reaches.',
    fish: ['White Bass', 'Walleye', 'Musky', 'Smallmouth Bass', 'Channel Catfish'],
    spots: [
      {
        id: 29,
        name: 'Wolf River Public Access, Fremont',
        query: 'Wolf River Public Access Fremont WI',
        fish: ['White Bass', 'Walleye', 'Musky', 'Smallmouth Bass', 'Channel Catfish'],
        difficulty: 'Easy',
        accessPoint: 'Public river access – free',
        dogFriendly: true,
        notes: 'The famous Fremont white bass run draws crowds every May when white bass push up from Lake Poygan in massive schools. Small jigs and spinners in white or chartreuse produce fish after fish from the bank — this is one of the most exciting freshwater fishing events in WI. Walleye and musky are present year-round and provide quality fishing outside the white bass run. Smallmouth bass in the rocky stretches during summer. SPECIAL REGULATIONS: The Wolf River walleye regulations include specific harvest restrictions and slot limits that differ from statewide rules — some stretches have special size limits. Always check the current WI DNR regulations for the Wolf River Zone before keeping walleye. Dog-friendly access.',
        coords: { lat: 44.2608, lng: -89.0627 },
      },
    ],
  },

  {
    id: 'green-bay-pinney',
    name: 'Green Bay (Lake Michigan)',
    region: 'Northeast',
    type: 'Great Bay',
    dogFriendly: false,
    description: 'Prime Lake Michigan bay access on the west shore of Green Bay. Walleye and yellow perch dominate the inshore bite. The bay also provides a gateway to open Lake Michigan for salmon and lake trout trolling. Excellent spring walleye action as fish push along the shoreline in April.',
    fish: ['Walleye', 'Yellow Perch', 'Chinook Salmon', 'Lake Trout', 'Smallmouth Bass'],
    spots: [
      {
        id: 30,
        name: 'George K. Pinney County Park, Green Bay',
        query: 'George K. Pinney County Park Green Bay WI Lake Michigan',
        fish: ['Walleye', 'Yellow Perch', 'Chinook Salmon', 'Lake Trout', 'Smallmouth Bass'],
        difficulty: 'Easy',
        accessPoint: 'County park boat launch and shore access – free',
        dogFriendly: false,
        notes: 'Good Lake Michigan bay access on the west shore of Green Bay. Shore fishing for yellow perch is consistent from the pier and breakwater — perch are present spring through fall and respond well to small jigs and live minnows. Spring walleye run along the shoreline in April is the highlight — cast from the shore or anchor a boat in 8–15 feet of water. Salmon and lake trout are accessible from here with a capable boat run to the mouth of the bay and beyond. Smallmouth bass along the rocky shoreline in summer. Free county park access.',
        coords: { lat: 44.4956, lng: -88.0267 },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  //  NORTHERN REGION
  // ═══════════════════════════════════════════════════════

  {
    id: 'eagle-river-chain',
    name: 'Eagle River Chain of Lakes',
    region: 'Northern',
    type: 'Chain of Lakes',
    dogFriendly: false,
    description: 'The world\'s largest inland chain of 28 interconnected lakes covering approximately 3,200 acres in Vilas County. A legendary Northwoods musky and walleye destination that draws anglers from across the country. Multiple launch points throughout the chain allow access to wildly different fishing environments within one connected system.',
    fish: ['Musky', 'Walleye', 'Largemouth Bass', 'Smallmouth Bass', 'Northern Pike', 'Yellow Perch'],
    spots: [
      {
        id: 31,
        name: 'Eagle River Chain Public Boat Landing',
        query: 'Eagle River Chain of Lakes Public Boat Landing Eagle River WI',
        fish: ['Musky', 'Walleye', 'Largemouth Bass', 'Smallmouth Bass', 'Northern Pike', 'Yellow Perch'],
        difficulty: 'Easy',
        accessPoint: 'Public boat landing – free',
        dogFriendly: false,
        notes: 'Entry point to the legendary 28-lake chain — arguably the musky capital of the Northwoods. Musky fishing is exceptional throughout the chain; local guide services have perfected trolling and casting patterns over generations. Walleye are abundant and best targeted at dawn and dusk on jigs and crawler harnesses near the weedy bays and rocky points. Smallmouth bass in the clearer, rockier lakes on the upper end of the chain. Multiple launch points exist throughout the chain — pick up a chain map at any local tackle shop in Eagle River. The town itself is a full-service Northwoods fishing hub.',
        coords: { lat: 45.9166, lng: -89.2443 },
      },
    ],
  },

  {
    id: 'lake-namakagon',
    name: 'Lake Namakagon',
    region: 'Northern',
    type: 'Natural Lake',
    dogFriendly: false,
    description: 'Top-tier musky water in Bayfield County with pristine, clear water and excellent natural structure. Part of the Namekagon-St. Croix National Scenic Riverway system — special regulations apply to connected river sections. One of the most beautiful lakes in Northern Wisconsin with a first-class musky fishery.',
    fish: ['Musky', 'Walleye', 'Largemouth Bass', 'Northern Pike', 'Smallmouth Bass'],
    spots: [
      {
        id: 32,
        name: 'Lake Namakagon Public Boat Launch, Cable',
        query: 'Lake Namakagon Public Boat Launch Cable WI',
        fish: ['Musky', 'Walleye', 'Largemouth Bass', 'Northern Pike', 'Smallmouth Bass'],
        difficulty: 'Easy',
        accessPoint: 'Public boat launch – free',
        dogFriendly: false,
        notes: 'Access to one of NW Wisconsin\'s finest musky lakes. Clear water makes sight-fishing for musky possible on calm days — watch for fish following your lure on the retrieve and be ready for a figure-eight. Large bucktails, glide baits, and surface lures all produce on Namakagon. Walleye fishing is solid in spring and fall near the rocky shoreline points. SPECIAL REGULATIONS: Lake Namakagon outlets into the Namekagon River, which is part of the St. Croix National Scenic Riverway. Connected river sections have special size and bag limits for musky that differ from the lake regulations — check both WI DNR AND National Park Service regulations if fishing the connecting waterways. On the lake itself, follow standard WI Ceded Territory musky regulations.',
        coords: { lat: 46.1800, lng: -91.2833 },
      },
    ],
  },

  {
    id: 'chequamegon-bay',
    name: 'Chequamegon Bay (Lake Superior)',
    region: 'Northern',
    type: 'Lake Superior Bay',
    dogFriendly: false,
    description: 'Lake Superior access at Ashland, WI. This is a completely different fishery from any inland Wisconsin lake — Lake Superior is the largest freshwater lake in the world by surface area, with icy cold, deep water and trophy fish that dwarf anything in the inland lakes. Giant lake trout, brown trout, and salmon in pristine cold water.',
    fish: ['Lake Trout', 'Brown Trout', 'Coho Salmon', 'Chinook Salmon', 'Smallmouth Bass', 'Walleye'],
    spots: [
      {
        id: 33,
        name: 'Ashland Marina Boat Launch',
        query: 'Ashland Marina Boat Launch Ashland WI Lake Superior',
        fish: ['Lake Trout', 'Brown Trout', 'Coho Salmon', 'Chinook Salmon', 'Smallmouth Bass', 'Walleye'],
        difficulty: 'Intermediate',
        accessPoint: 'Marina boat launch – fee may apply',
        dogFriendly: false,
        notes: 'Gateway to Lake Superior fishing from Ashland. Lake trout and brown trout are the primary targets — troll deep-diving lures or lead-core line in 60–120 feet of water along the submerged structure. Coho and Chinook salmon are available in summer, particularly July through September. Smallmouth bass and walleye are found in the shallower Chequamegon Bay proper. SPECIAL REGULATIONS: Lake Superior operates under completely separate WI DNR regulations from inland Wisconsin waters — bag limits, size limits, and season dates are DIFFERENT. You must read the Lake Superior-specific section of the WI DNR fishing regulations before keeping any fish. Weather can turn dangerous quickly on Superior — check forecasts, respect the lake, and do not go out in marginal conditions.',
        coords: { lat: 46.5919, lng: -90.8920 },
      },
    ],
  },

  {
    id: 'chippewa-flowage',
    name: 'Chippewa Flowage (Big Chip)',
    region: 'Northern',
    type: 'Reservoir',
    dogFriendly: false,
    description: 'Home of the World Record Musky — a 69 lb 11 oz giant caught in 1949 that still stands. "Big Chip" is hallowed musky water in the WI Northwoods. At 15,300 acres of wild, remote reservoir with hundreds of islands and bays, it is as much an experience as it is a fishery. Local guide tradition here runs generations deep.',
    fish: ['Musky', 'Walleye', 'Largemouth Bass', 'Smallmouth Bass', 'Northern Pike', 'Yellow Perch'],
    spots: [
      {
        id: 34,
        name: 'CC North Boat Launch, Hayward',
        query: 'CC North Boat Launch Chippewa Flowage Hayward WI',
        fish: ['Musky', 'Walleye', 'Largemouth Bass', 'Smallmouth Bass', 'Northern Pike', 'Yellow Perch'],
        difficulty: 'Easy',
        accessPoint: 'Public boat launch – free',
        dogFriendly: false,
        notes: 'One of the primary launches on the legendary Chippewa Flowage. This is bucket-list musky water — the same reservoir that produced the standing world record. SPECIAL REGULATIONS: Musky minimum size is 40 inches, strictly enforced. The local guide community strongly encourages voluntary catch-and-release for all musky to preserve the trophy fishery — please respect this culture. Walleye fishing is excellent here as well, particularly in spring and fall on the rocky main lake points. The flowage\'s hundreds of islands and bays create endless structure to explore. A detailed lake map (available at Hayward area tackle shops) is essential — this is a large, complex body of water. Bass and perch provide consistent action throughout summer.',
        coords: { lat: 45.7869, lng: -91.2050 },
      },
    ],
  },

  {
    id: 'brule-river',
    name: 'Brule River',
    region: 'Northern',
    type: 'River — Trout Stream',
    dogFriendly: true,
    description: 'Wisconsin\'s premier trout fly-fishing stream. Cold, gin-clear water fed by natural springs maintains temperatures suitable for wild trout year-round. Presidents Coolidge, Hoover, and Eisenhower all fished the Brule — it has been called the "River of Presidents." Wild and scenic designation protects the corridor.',
    fish: ['Brown Trout', 'Rainbow Trout', 'Brook Trout', 'Steelhead', 'Chinook Salmon'],
    spots: [
      {
        id: 35,
        name: 'Bois Brule River Public Access, Brule',
        query: 'Bois Brule River Public Access Brule WI',
        fish: ['Brown Trout', 'Rainbow Trout', 'Brook Trout', 'Steelhead', 'Chinook Salmon'],
        difficulty: 'Intermediate',
        accessPoint: 'WDNR public access – free, trail walk required',
        dogFriendly: true,
        notes: 'Wisconsin\'s finest trout stream. Spring steelhead run (March–May) and fall Chinook salmon run (September–October) draw serious anglers from across the region. Resident brown trout, rainbow trout, and brook trout are present year-round in the cold spring-fed water. SPECIAL REGULATIONS: A Wisconsin Trout Stamp is required in addition to a standard fishing license. The upper river contains catch-and-release only sections — check the DNR Trout Stream regulations map carefully to identify which stretches are C&R and which allow harvest. Some sections are designated fly fishing only. Wading the river requires careful footing on the mossy rocks. Dog-friendly access along much of the corridor — keep dogs on leash near other anglers. This is a must-do for any WI trout angler.',
        coords: { lat: 46.5300, lng: -91.6000 },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  //  WEST CENTRAL REGION
  // ═══════════════════════════════════════════════════════

  {
    id: 'mississippi-pool8',
    name: 'Mississippi River (Pool 8)',
    region: 'West Central',
    type: 'River — Boundary Water',
    dogFriendly: false,
    description: 'Boundary water between Wisconsin and Minnesota. Pool 8 near La Crosse is one of the best backwater bass and catfish fisheries on the upper Mississippi River. The extensive backwater sloughs, islands, and oxbows create incredible habitat diversity. A unique fishery unlike anything else in Wisconsin.',
    fish: ['Largemouth Bass', 'Smallmouth Bass', 'Channel Catfish', 'Sauger', 'Walleye', 'Bluegill', 'Crappie'],
    spots: [
      {
        id: 36,
        name: 'Pettibone Park Boat Launch, La Crosse',
        query: 'Pettibone Park Boat Launch La Crosse WI Mississippi River',
        fish: ['Largemouth Bass', 'Smallmouth Bass', 'Channel Catfish', 'Sauger', 'Walleye', 'Bluegill', 'Crappie'],
        difficulty: 'Easy',
        accessPoint: 'City park boat launch – free',
        dogFriendly: false,
        notes: 'Excellent access to the Pool 8 Mississippi backwaters from La Crosse. Largemouth bass in the shallow sloughs and backwater lakes respond to topwater lures and frogs early morning. Channel catfish are exceptional on cut bait near the main channel and wing dams. Sauger (not walleye — sauger are the dominant species here) concentrate below the dams and around wing dams on jigs. SPECIAL REGULATIONS: The Mississippi River is a boundary water — technically both a valid Wisconsin fishing license AND a valid Minnesota fishing license are individually accepted for fishing from the WI or MN side respectively. However, bag limits follow the MORE RESTRICTIVE of the two states\' rules. Always check current WI-MN Mississippi River boundary water regulations, as they are updated annually and differ from standard inland regs. No dogs at the La Crosse city launch.',
        coords: { lat: 43.8080, lng: -91.2527 },
      },
    ],
  },

  {
    id: 'black-river',
    name: 'Black River',
    region: 'West Central',
    type: 'River',
    dogFriendly: true,
    description: 'Wild river flowing through Black River State Forest in Jackson County. Scenic sandstone bluffs and clear water. Excellent smallmouth bass throughout the summer on the gravelly runs. Walleye concentrate below the Black River Falls dam in spring and fall. A great float-fishing river with multiple canoe/kayak launch options.',
    fish: ['Walleye', 'Smallmouth Bass', 'Northern Pike', 'Channel Catfish'],
    spots: [
      {
        id: 37,
        name: 'Black River Falls Dam Fishing Access',
        query: 'Black River Falls Dam Fishing Access Black River Falls WI',
        fish: ['Walleye', 'Smallmouth Bass', 'Northern Pike', 'Channel Catfish'],
        difficulty: 'Easy',
        accessPoint: 'Public dam fishing area – free',
        dogFriendly: true,
        notes: 'Walleye concentrate below the dam in spring (April–May) and again in fall — jig the current seams and eddies just below the turbulent water with 1/4 oz jigs in natural colors. Smallmouth bass are the summer workhorse throughout the river — float a section with tube baits, crayfish patterns, or small spinners and expect consistent action on the gravelly runs. Channel catfish take cut bait from the bank on summer evenings below the dam. Northern pike in the slower backwater areas. Dog-friendly access along the riverbank. A short float from the dam access down to the next takeout makes for an excellent half-day smallmouth outing.',
        coords: { lat: 44.2954, lng: -90.8512 },
      },
    ],
  },

  {
    id: 'lake-wissota',
    name: 'Lake Wissota',
    region: 'West Central',
    type: 'Reservoir',
    dogFriendly: true,
    description: 'Man-made reservoir on the Chippewa River near Chippewa Falls. Created in 1917 by the Wissota Hydroelectric Dam. Excellent walleye and bass fishery with good structure from the submerged river channel. State park provides a maintained launch and dog-friendly hiking trails.',
    fish: ['Walleye', 'Largemouth Bass', 'Smallmouth Bass', 'Northern Pike', 'Yellow Perch'],
    spots: [
      {
        id: 38,
        name: 'Lake Wissota State Park Boat Launch',
        query: 'Lake Wissota State Park Boat Launch Chippewa Falls WI',
        fish: ['Walleye', 'Largemouth Bass', 'Smallmouth Bass', 'Northern Pike', 'Yellow Perch'],
        difficulty: 'Easy',
        accessPoint: 'State park boat launch (vehicle sticker required)',
        dogFriendly: true,
        notes: 'Well-maintained launch within Lake Wissota State Park. Walleye are the primary draw — fish the old Chippewa River channel bed running through the reservoir, which is marked on lake maps available at the park. Dawn and dusk trolling or jigging the channel edges produces consistently. Largemouth and smallmouth bass in the rocky coves and brush piles. Northern pike in the shallow weedy bays. Yellow perch year-round near the bottom. State park vehicle sticker required. Dog-friendly hiking trails throughout the park make this an ideal all-day outing — fish in the morning, hike in the afternoon.',
        coords: { lat: 44.9172, lng: -91.3003 },
      },
    ],
  },

];

// ───────────────────────────────────────────────────────
//  Utility Exports
// ───────────────────────────────────────────────────────

export const getWatersByRegion = (region) =>
  bodiesOfWater.filter(w => w.region === region);

export const getRegions = () => [...new Set(bodiesOfWater.map(w => w.region))];

export const getAllSpots = () =>
  bodiesOfWater.flatMap(water =>
    water.spots.map(spot => ({
      ...spot,
      waterName: water.name,
      region: water.region,
      dogFriendly: spot.dogFriendly,
    }))
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
  w.spots.map(s => ({
    id: s.id,
    name: s.name,
    region: w.region,
    query: s.query,
    fish: s.fish,
    difficulty: s.difficulty,
    accessPoint: s.accessPoint,
  }))
);
export const searchLocations = searchSpots;

export default bodiesOfWater;
