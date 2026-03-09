// Wisconsin lakes, rivers and urban fishing spots with parking and access points
// Research-based from r/milwaukee and r/wisconsin communities + local fishing guides
export const wisconsinWaters = [
  // Milwaukee Urban Fishing
  {
    id: 1,
    name: 'Lake Michigan - Milwaukee',
    type: 'lake',
    location: { latitude: 43.0391, longitude: -87.8993 },
    fish: ['Salmon', 'Lake Trout', 'Walleye', 'Brown Trout', 'Steelhead'],
    difficulty: 'Hard',
    bestSeason: 'Spring - Fall',
    accessPoints: [
      { name: 'Bradford Beach Parking', latitude: 43.0296, longitude: -87.8947, type: 'parking lot & public beach', lakefront: true },
      { name: 'Ohio Street Riverwalk Parking', latitude: 43.0367, longitude: -87.8932, type: 'parking lot & river access', lakefront: true },
      { name: 'South Shore Park Parking', latitude: 43.0205, longitude: -87.8891, type: 'parking lot & fishing platform', lakefront: true },
      { name: 'Veterans Park Marina', latitude: 43.0452, longitude: -87.9008, type: 'boat launch & parking', lakefront: true }
    ]
  },
  {
    id: 2,
    name: 'Milwaukee River - Urban Section',
    type: 'river',
    location: { latitude: 43.0439, longitude: -87.8965 },
    fish: ['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Catfish', 'Carp'],
    difficulty: 'Easy',
    bestSeason: 'Spring - Fall',
    accessPoints: [
      { name: 'Riverside Park Parking', latitude: 43.0439, longitude: -87.8965, type: 'parking lot & river trail', lakefront: true },
      { name: 'Lincoln Park Fishing Area', latitude: 43.0365, longitude: -87.8856, type: 'parking lot & access point', lakefront: true },
      { name: 'Juneau Park Boat Launch', latitude: 43.0459, longitude: -87.8942, type: 'boat launch & parking', lakefront: true }
    ]
  },
  {
    id: 3,
    name: 'Kinnickinnic River',
    type: 'river',
    location: { latitude: 42.9801, longitude: -87.8564 },
    fish: ['Largemouth Bass', 'Smallmouth Bass', 'Carp', 'Catfish', 'Crappie'],
    difficulty: 'Intermediate',
    bestSeason: 'Spring - Summer',
    accessPoints: [
      { name: 'Mitchell Park Parking', latitude: 42.9801, longitude: -87.8564, type: 'parking lot & river access', lakefront: true },
      { name: 'South 16th Street Access', latitude: 42.9945, longitude: -87.8734, type: 'parking lot & access point', lakefront: true },
      { name: 'Oak Creek Nature Preserve', latitude: 42.9680, longitude: -87.8321, type: 'parking lot & scenic trail', lakefront: true }
    ]
  },
  {
    id: 4,
    name: 'Menominee River (North)',
    type: 'river',
    location: { latitude: 43.1856, longitude: -87.8927 },
    fish: ['Walleye', 'Pike', 'Smallmouth Bass', 'Catfish', 'Perch'],
    difficulty: 'Intermediate',
    bestSeason: 'Spring - Fall',
    accessPoints: [
      { name: 'Currie Park Parking & Launch', latitude: 43.1856, longitude: -87.8927, type: 'boat launch & parking', lakefront: true },
      { name: 'River Road Fishing Access', latitude: 43.1742, longitude: -87.8654, type: 'parking lot & riverside', lakefront: true },
      { name: 'North Shore Access Point', latitude: 43.1923, longitude: -87.9107, type: 'parking lot & access point', lakefront: true }
    ]
  },
  // Extended Wisconsin Lakes
  {
    id: 5,
    name: 'Lake Mendota',
    type: 'lake',
    location: { latitude: 43.1106, longitude: -89.4183 },
    fish: ['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Pike', 'Crappie'],
    difficulty: 'Intermediate',
    bestSeason: 'Spring - Fall',
    accessPoints: [
      { name: 'Memorial Beach Park Parking', latitude: 43.0826, longitude: -89.4086, type: 'parking lot & public beach', lakefront: true },
      { name: 'Lake Street Boat Launch Parking', latitude: 43.0760, longitude: -89.4136, type: 'boat launch & parking', lakefront: true },
      { name: 'Babcock Boat Launch Parking', latitude: 43.1095, longitude: -89.3920, type: 'boat launch & parking', lakefront: true },
      { name: 'Mendota Beach Park Parking', latitude: 43.1234, longitude: -89.4180, type: 'parking lot & public beach', lakefront: true }
    ]
  },
  {
    id: 6,
    name: 'Lake Winnebago',
    type: 'lake',
    location: { latitude: 44.0833, longitude: -88.5333 },
    fish: ['Walleye', 'Perch', 'Pike', 'Bass', 'Musky'],
    difficulty: 'Easy',
    bestSeason: 'Spring - Fall',
    accessPoints: [
      { name: 'Fond du Lac Lakefront Parking', latitude: 43.7707, longitude: -88.4496, type: 'parking lot & public park', lakefront: true },
      { name: 'Winneconne Boat Launch Parking', latitude: 43.9999, longitude: -88.6780, type: 'boat launch & parking', lakefront: true },
      { name: 'Oshkosh Lakeside Parking', latitude: 44.0252, longitude: -88.5421, type: 'parking lot & public park', lakefront: true },
      { name: 'High Cliff State Park Lot', latitude: 44.1234, longitude: -88.3045, type: 'parking lot & scenic overlook', lakefront: true }
    ]
  },
  {
    id: 7,
    name: 'Wisconsin River',
    type: 'river',
    location: { latitude: 43.8, longitude: -89.6 },
    fish: ['Musky', 'Walleye', 'Pike', 'Smallmouth Bass', 'Catfish'],
    difficulty: 'Hard',
    bestSeason: 'Spring - Summer',
    accessPoints: [
      { name: 'Rhinelander Flowage Parking', latitude: 45.6412, longitude: -89.1480, type: 'parking lot & access', lakefront: true },
      { name: 'Merrill Public Park Lot', latitude: 45.1765, longitude: -89.4221, type: 'parking lot & river access', lakefront: true },
      { name: 'Wausau Whitewater Parking', latitude: 44.9544, longitude: -89.5968, type: 'boat launch & parking', lakefront: true }
    ]
  },
  {
    id: 8,
    name: 'Door County Waters',
    type: 'lake',
    location: { latitude: 45.3, longitude: -87.6 },
    fish: ['Lake Trout', 'Brown Trout', 'Rainbow Trout', 'Smallmouth Bass', 'Walleye'],
    difficulty: 'Intermediate',
    bestSeason: 'Summer - Fall',
    accessPoints: [
      { name: 'Gill\'s Rock Parking & Launch', latitude: 45.3420, longitude: -87.3089, type: 'boat launch & parking', lakefront: true },
      { name: 'Sister Bay Beach Parking', latitude: 45.2305, longitude: -87.4029, type: 'parking lot & public beach', lakefront: true },
      { name: 'Sturgeon Bay Waterfront Parking', latitude: 44.8314, longitude: -87.8049, type: 'parking lot & public park', lakefront: true }
    ]
  },
  {
    id: 9,
    name: 'Lake Superior - Wisconsin Shore',
    type: 'lake',
    location: { latitude: 46.5, longitude: -87.5 },
    fish: ['Lake Trout', 'Whitefish', 'Salmon', 'Brown Trout'],
    difficulty: 'Hard',
    bestSeason: 'Summer - Fall',
    accessPoints: [
      { name: 'Bayfield Waterfront Parking', latitude: 46.8158, longitude: -90.8169, type: 'parking lot & public park', lakefront: true },
      { name: 'Ashland Marina Parking', latitude: 46.5757, longitude: -90.8928, type: 'boat launch & parking', lakefront: true },
      { name: 'Superior Lakefront Parking', latitude: 46.7214, longitude: -92.1040, type: 'parking lot & public park', lakefront: true }
    ]
  },
  {
    id: 10,
    name: 'Rock River',
    type: 'river',
    location: { latitude: 43.3, longitude: -88.3 },
    fish: ['Largemouth Bass', 'Crappie', 'Catfish', 'Carp', 'Smallmouth Bass'],
    difficulty: 'Easy',
    bestSeason: 'Spring - Summer',
    accessPoints: [
      { name: 'Watertown Park Access Parking', latitude: 43.1923, longitude: -88.7290, type: 'parking lot & river park', lakefront: true },
      { name: 'Janesville Lakefront Parking', latitude: 42.6829, longitude: -88.9968, type: 'parking lot & public park', lakefront: true },
      { name: 'Jefferson County Park Lot', latitude: 43.2145, longitude: -88.7654, type: 'parking lot & river access', lakefront: true }
    ]
  },
  {
    id: 11,
    name: 'Okauchee Lake',
    type: 'lake',
    location: { latitude: 43.1485, longitude: -88.4427 },
    fish: ['Largemouth Bass', 'Pike', 'Walleye', 'Crappie', 'Perch'],
    difficulty: 'Intermediate',
    bestSeason: 'Spring - Fall',
    accessPoints: [
      { name: 'Okauchee Village Beach Parking', latitude: 43.1485, longitude: -88.4427, type: 'parking lot & public beach', lakefront: true },
      { name: 'Okauchee County Park Lot', latitude: 43.1634, longitude: -88.4501, type: 'parking lot & boat launch', lakefront: true },
      { name: 'North Shore Access Parking', latitude: 43.1702, longitude: -88.4389, type: 'parking lot & fishing access', lakefront: true }
    ]
  }
];
