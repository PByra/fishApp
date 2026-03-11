/**
 * Wisconsin Fishing Locations with Search Query Strings
 * Optimized for Search-to-Navigate feature
 * Supports both browser and native Android navigation
 */

export const wisconsinLocations = [
  // Milwaukee Shore Region
  {
    id: 1,
    name: "McKinley Pier",
    region: "Milwaukee Shore",
    category: "MKE Shore",
    query: "McKinley Marina Public Fishing Pier Milwaukee",
    fish: ["Salmon", "Trout", "Walleye"],
    difficulty: "Easy",
    accessPoint: "Public Fishing Pier",
  },
  {
    id: 2,
    name: "Lakeshore State Park",
    region: "Milwaukee Shore",
    category: "MKE Shore",
    query: "Lakeshore State Park Fishing Access Milwaukee",
    fish: ["Salmon", "Lake Trout", "Walleye"],
    difficulty: "Easy",
    accessPoint: "State Park Shore",
  },

  // Milwaukee River Region
  {
    id: 3,
    name: "Estabrook Park",
    region: "Milwaukee River",
    category: "MKE River",
    query: "Estabrook Park Beer Garden Parking (Best river access)",
    fish: ["Smallmouth Bass", "Walleye", "Catfish"],
    difficulty: "Intermediate",
    accessPoint: "River Access Below Falls",
  },
  {
    id: 4,
    name: "Kletzsch Park",
    region: "Milwaukee River",
    category: "MKE River",
    query: "Kletzsch Park Waterfall Fishing",
    fish: ["Steelhead", "Salmon", "Smallmouth Bass"],
    difficulty: "Hard",
    accessPoint: "Waterfall Access Point",
  },

  // Milwaukee South Region
  {
    id: 5,
    name: "Bender Park",
    region: "Milwaukee South",
    category: "MKE South",
    query: "Bender Park Boat Launch Oak Creek",
    fish: ["Largemouth Bass", "Catfish", "Carp"],
    difficulty: "Easy",
    accessPoint: "Boat Launch",
  },

  // Waukesha Region
  {
    id: 6,
    name: "Pewaukee Lake",
    region: "Waukesha",
    category: "Waukesha",
    query: "Pewaukee Lake Public Boat Launch",
    fish: ["Musky", "Walleye", "Largemouth Bass"],
    difficulty: "Hard",
    accessPoint: "Public Boat Launch",
  },
  {
    id: 7,
    name: "Nagawicka Lake",
    region: "Waukesha",
    category: "Waukesha",
    query: "Naga-Waukee Park Boat Launch",
    fish: ["Largemouth Bass", "Walleye", "Pike"],
    difficulty: "Intermediate",
    accessPoint: "Park Boat Launch",
  },

  // Mauston Area Region
  {
    id: 8,
    name: "Riverside Park",
    region: "Mauston",
    category: "Mauston Area",
    query: "Riverside Park Mauston WI Boat Launch",
    fish: ["Walleye", "Northern Pike", "Largemouth Bass"],
    difficulty: "Intermediate",
    accessPoint: "Riverside Boat Launch",
  },
  {
    id: 9,
    name: "Castle Rock",
    region: "Mauston",
    category: "Mauston Area",
    query: "Castle Rock County Park Boat Ramp",
    fish: ["Walleye", "Musky", "Pike"],
    difficulty: "Hard",
    accessPoint: "County Boat Ramp",
  },
  {
    id: 10,
    name: "Lemonweir River",
    region: "Mauston",
    category: "Mauston Area",
    query: "Lemonweir Mills Public Access Mauston",
    fish: ["Walleye", "Smallmouth Bass", "Catfish"],
    difficulty: "Intermediate",
    accessPoint: "Public River Access",
  },
  {
    id: 11,
    name: "Castle Rock Dam",
    region: "Mauston",
    category: "Mauston Area",
    query: "Castle Rock Dam Public Fishing Area",
    fish: ["Walleye", "Pike", "Perch"],
    difficulty: "Intermediate",
    accessPoint: "Dam Fishing Area",
  },
];

/**
 * Get locations by region
 * @param {string} region - Region name (e.g., "Milwaukee Shore", "Mauston Area")
 * @returns {Array} Array of locations in that region
 */
export const getLocationsByRegion = (region) => {
  return wisconsinLocations.filter(loc => loc.region === region);
};

/**
 * Get unique regions for filtering
 * @returns {Array} Array of unique region names
 */
export const getRegions = () => {
  const regions = new Set(wisconsinLocations.map(loc => loc.region));
  return Array.from(regions).sort();
};

/**
 * Get unique categories for filtering
 * @returns {Array} Array of unique categories
 */
export const getCategories = () => {
  const categories = new Set(wisconsinLocations.map(loc => loc.category));
  return Array.from(categories).sort();
};

/**
 * Search locations by name or fish species
 * @param {string} searchTerm - Search query
 * @returns {Array} Filtered locations
 */
export const searchLocations = (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === "") return wisconsinLocations;
  
  const term = searchTerm.toLowerCase();
  return wisconsinLocations.filter(loc => 
    loc.name.toLowerCase().includes(term) ||
    loc.query.toLowerCase().includes(term) ||
    loc.fish.some(f => f.toLowerCase().includes(term)) ||
    loc.region.toLowerCase().includes(term)
  );
};

/**
 * Get featured locations (easy difficulty for quick trips)
 * @returns {Array} Featured locations
 */
export const getFeaturedLocations = () => {
  return wisconsinLocations.filter(loc => loc.difficulty === "Easy").slice(0, 5);
};

export default wisconsinLocations;
