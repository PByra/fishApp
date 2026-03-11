# Search-to-Navigate Feature - Developer Code Patterns

## 🧠 Quick Code Reference

Copy-paste ready code snippets for common tasks.

---

## 📍 Using Navigation Service

### Launch Maps with Search Query
```javascript
import { launchNavigation } from '../services/navigationService';

// In your component or event handler:
const handleFishButtonPress = async (location) => {
  try {
    await launchNavigation(location.query, location.name);
  } catch (error) {
    console.error('Navigation failed:', error);
    Alert.alert('Error', 'Could not open maps');
  }
};
```

### Open Web Maps Directly
```javascript
import { openWebMaps } from '../services/navigationService';

// Open Google Maps in browser
await openWebMaps("McKinley Marina Public Fishing Pier Milwaukee");
```

### Validate Search Query
```javascript
import { isValidQuery } from '../services/navigationService';

// Before sending to Maps
if (isValidQuery(query)) {
  await launchNavigation(query, name);
} else {
  Alert.alert('Invalid search query');
}
```

---

## 🎣 Working with Location Data

### Get All Locations
```javascript
import { wisconsinLocations } from '../data/wisconsinWaters';

// In component:
const [locations, setLocations] = useState(wisconsinLocations);

// Later: render them
locations.map((location) => (
  <LocationCard key={location.id} location={location} />
))
```

### Filter by Region
```javascript
import { getLocationsByRegion } from '../data/wisconsinWaters';

// Get Milwaukee area fishing spots
const milwaukeeSpots = getLocationsByRegion('Milwaukee Shore');
// or
const milwaukeeSpots = getLocationsByRegion('Milwaukee River');

// Combined Milwaukee (area filter function):
const getMilwaukeeArea = () => {
  const shore = getLocationsByRegion('Milwaukee Shore');
  const river = getLocationsByRegion('Milwaukee River');
  const south = getLocationsByRegion('Milwaukee South');
  const waukesha = getLocationsByRegion('Waukesha');
  return [...shore, ...river, ...south, ...waukesha];
};
```

### Search Locations
```javascript
import { searchLocations } from '../data/wisconsinWaters';

// Search by any field (name, fish, region, query)
const results = searchLocations('Walleye');
// Returns all locations where fish includes Walleye

const results = searchLocations('Milwaukee');
// Returns all Milwaukee area locations

const results = searchLocations('Easy');
// Returns all Easy difficulty locations
```

### Get Lists of Values
```javascript
import { 
  getRegions, 
  getCategories, 
  getFeaturedLocations 
} from '../data/wisconsinWaters';

// Get all available regions for filter options
const regions = getRegions();
// Returns: ["Milwaukee Shore", "Milwaukee River", "Milwaukee South", ...]

// Get all category types
const categories = getCategories();
// Returns: ["Shore Access", "River Access", "Public Park", ...]

// Get beginner-friendly spots
const beginnerSpots = getFeaturedLocations();
// Returns: locations with difficulty === "Easy"
```

---

## 🎨 Using Dark Forest Theme

### Import Theme
```javascript
import darkForestTheme from '../theme/darkForest';
// Or: import darkForestTheme from '../darkForest'; 
// depending on file location

// Access any token:
const bgColor = darkForestTheme.colors.background.primary;     // #1A2421
const accentColor = darkForestTheme.colors.accent.primary;     // #E67E22
const textColor = darkForestTheme.colors.text.primary;         // #FFFFFF
```

### Common Color Usages
```javascript
// Screen backgrounds
<View style={{ backgroundColor: darkForestTheme.colors.background.primary }}>

// Card backgrounds
<View style={{ backgroundColor: darkForestTheme.colors.background.secondary }}>

// Buttons (GO FISH)
<TouchableOpacity style={{
  backgroundColor: darkForestTheme.colors.accent.primary,  // #E67E22
  paddingVertical: darkForestTheme.spacing.lg,
}}>

// Text
<Text style={{ color: darkForestTheme.colors.text.primary }}> 
  Primary text
</Text>
<Text style={{ color: darkForestTheme.colors.text.secondary }}>
  Secondary text
</Text>

// Difficulty badges
<View style={{
  backgroundColor: darkForestTheme.colors.status.success,  // Easy (green)
  paddingHorizontal: darkForestTheme.spacing.md,
  borderRadius: 12,
}}>
  <Text>Easy</Text>
</View>
```

### Spacing Token Usage
```javascript
// Instead of hardcoding margins/padding:
// ❌ Bad:
<View style={{ padding: 16 }}>

// ✅ Good:
import darkForestTheme from '../theme/darkForest';
<View style={{ padding: darkForestTheme.spacing.lg }}>

// All available sizes:
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 20px
xxl: 32px
```

### Typography Application
```javascript
// Heading
<Text style={[
  darkForestTheme.typography.heading,
  { color: darkForestTheme.colors.text.primary }
]}>
  SEARCH & FISH
</Text>

// Body text
<Text style={[
  darkForestTheme.typography.body,
  { color: darkForestTheme.colors.text.secondary }
]}>
  3 spots near you
</Text>

// Button text
<Text style={[
  darkForestTheme.typography.button,
  { color: darkForestTheme.colors.text.primary }
]}>
  GO FISH
</Text>

// Caption
<Text style={[
  darkForestTheme.typography.caption,
  { color: darkForestTheme.colors.text.tertiary }
]}>
  McKinley Marina Public Fishing Pier
</Text>
```

---

## 📱 Flip 3 Aspect Ratio Detection

### Detect Narrow Aspect Ratio (Flip 3)
```javascript
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Flip 3 is 22:9 aspect ratio ≈ 2.22:1
const isFlip3 = (screenHeight / screenWidth) > 2;

// Use in rendering:
{isFlip3 && (
  <View style={[
    styles.activeSpotSection,
    { marginBottom: darkForestTheme.spacing.lg }
  ]}>
    {/* Pinned active location display */}
  </View>
)}
```

### Responsive Grid Width
```javascript
// Calculate card width for 2-column layout
const cardPadding = darkForestTheme.spacing.lg;
const containerPadding = darkForestTheme.spacing.lg;
const gapBetweenCards = darkForestTheme.spacing.md;

const totalHorizontalPadding = containerPadding * 2 + gapBetweenCards;
const cardWidth = (screenWidth - totalHorizontalPadding) / 2;

// Apply to FlatList columnWrapperStyle:
<FlatList
  columnWrapperStyle={{
    gap: gapBetweenCards,
  }}
  numColumns={2}
  // ...
/>
```

---

## 🔄 State Management Patterns

### Filter State with Region Toggle
```javascript
const [selectedRegion, setSelectedRegion] = useState(null);

// Get filtered locations
const getFilteredLocations = () => {
  if (!selectedRegion) {
    return wisconsinLocations;  // Return all
  } else if (selectedRegion === 'Milwaukee') {
    // Return Milwaukee + Waukesha (7 spots)
    return wisconsinLocations.filter(loc => 
      ['Milwaukee Shore', 'Milwaukee River', 'Milwaukee South', 'Waukesha']
        .includes(loc.region)
    );
  } else if (selectedRegion === 'Mauston') {
    // Return Mauston only (4 spots)
    return wisconsinLocations.filter(loc => loc.region === 'Mauston Area');
  }
};

// Toggle filter
const toggleRegionFilter = (region) => {
  if (selectedRegion === region) {
    setSelectedRegion(null);  // Deselect
  } else {
    setSelectedRegion(region);  // Select
  }
};

// Usage in component
<TouchableOpacity 
  onPress={() => toggleRegionFilter('Milwaukee')}
  style={[
    styles.filterButton,
    selectedRegion === 'Milwaukee' && styles.filterButtonActive
  ]}
>
  <Text>Milwaukee 45 min</Text>
</TouchableOpacity>
```

### Active Spot Tracking
```javascript
const [activeSpot, setActiveSpot] = useState(null);

// On location card tap
const handleLocationPress = (location) => {
  setActiveSpot(location);
};

// Highlight card if it's active
const isActive = activeSpot?.id === location.id;
<View style={[
  styles.locationCard,
  isActive && { borderColor: darkForestTheme.colors.accent.primary, borderWidth: 2 }
]}>
  {/* Card content */}
</View>

// Show active spot section
{isFlip3 && activeSpot && (
  <View style={styles.activeSpotSection}>
    <Text>{activeSpot.name}</Text>
    <TouchableOpacity 
      onPress={() => launchNavigation(activeSpot.query, activeSpot.name)}
      style={styles.goFishButton}
    >
      <Text>GO FISH</Text>
    </TouchableOpacity>
  </View>
)}
```

---

## 🎯 Event Handlers

### Filter Button Handler
```javascript
const handleFilterPress = (region) => {
  // Toggle the filter
  if (selectedRegion === region) {
    setSelectedRegion(null);
  } else {
    setSelectedRegion(region);
  }
  
  // Analytics (optional)
  console.log(`Filter toggled: ${region}`);
};

// In JSX:
<TouchableOpacity 
  activeOpacity={0.7}
  onPress={() => handleFilterPress('Milwaukee')}
>
  <Text>Milwaukee</Text>
</TouchableOpacity>
```

### Location Card Press Handler
```javascript
const handleLocationCardPress = (location) => {
  // Update active spot
  setActiveSpot(location);
  
  // Analytics (optional)
  console.log(`Location selected: ${location.name}`);
  
  // Optional: Haptic feedback (if available)
  // Haptics.selectionAsync();
};

// In JSX:
<TouchableOpacity 
  activeOpacity={0.8}
  onPress={() => handleLocationCardPress(location)}
>
  {/* Card content */}
</TouchableOpacity>
```

### GO FISH Button Press Handler
```javascript
const handleGoFishPress = async (location) => {
  try {
    // Show loading state (optional)
    setIsLaunching(true);
    
    // Launch Maps with search query
    await launchNavigation(location.query, location.name);
    
    // Analytics (optional)
    console.log(`Launched navigation to: ${location.name}`);
    
  } catch (error) {
    // Error handling
    Alert.alert(
      'Maps Not Available',
      'Unable to open maps. Please check if Google Maps is installed.',
      [{ text: 'OK' }]
    );
    console.error('Navigation error:', error);
    
  } finally {
    setIsLaunching(false);
  }
};

// In JSX:
<TouchableOpacity 
  onPress={() => handleGoFishPress(location)}
  disabled={isLaunching}
  style={[
    styles.goFishButton,
    isLaunching && { opacity: 0.6 }
  ]}
>
  <Feather name="navigation" size={20} color={darkForestTheme.colors.text.primary} />
  <Text>GO FISH</Text>
</TouchableOpacity>
```

---

## 🔍 Search Implementation (Placeholder - Future)

### Search Input Setup
```javascript
const [searchQuery, setSearchQuery] = useState('');

// Search handler
const handleSearch = (text) => {
  setSearchQuery(text);
};

// Filter results based on search
const getSearchedLocations = () => {
  if (!searchQuery) {
    return getFilteredLocations();
  }
  
  const filtered = getFilteredLocations();
  return searchLocations(searchQuery);  // Uses existing helper
};

// In JSX:
<View style={styles.searchContainer}>
  <Feather name="search" size={20} color={darkForestTheme.colors.text.secondary} />
  <TextInput
    placeholder="Search locations..."
    placeholderTextColor={darkForestTheme.colors.text.tertiary}
    value={searchQuery}
    onChangeText={handleSearch}
    style={styles.searchInput}
  />
</View>
```

---

## 📋 Complete Component Template

### Minimal SearchNavigateScreen Example
```javascript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { wisconsinLocations } from '../data/wisconsinWaters';
import { launchNavigation } from '../services/navigationService';
import darkForestTheme from '../theme/darkForest';

const SearchNavigateScreen = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [activeSpot, setActiveSpot] = useState(null);
  
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isFlip3 = (screenHeight / screenWidth) > 2;

  // Filter logic
  const getFilteredLocations = () => {
    if (!selectedRegion) return wisconsinLocations;
    if (selectedRegion === 'Milwaukee') {
      return wisconsinLocations.filter(loc => 
        ['Milwaukee Shore', 'Milwaukee River', 'Milwaukee South', 'Waukesha'].includes(loc.region)
      );
    }
    if (selectedRegion === 'Mauston') {
      return wisconsinLocations.filter(loc => loc.region === 'Mauston Area');
    }
  };

  // Handlers
  const handleFilterPress = (region) => {
    setSelectedRegion(selectedRegion === region ? null : region);
  };

  const handleGoFish = async (location) => {
    setActiveSpot(location);
    await launchNavigation(location.query, location.name);
  };

  const filteredLocations = getFilteredLocations();

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: darkForestTheme.colors.background.primary 
    }}>
      {/* Header */}
      <View style={{ paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: darkForestTheme.colors.background.secondary }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: darkForestTheme.colors.text.primary }}>
          SEARCH & FISH
        </Text>
        <Text style={{ fontSize: 14, color: darkForestTheme.colors.text.secondary }}>
          {filteredLocations.length} spots near you
        </Text>
      </View>

      {/* Filters */}
      <View style={{ 
        flexDirection: 'row', 
        paddingHorizontal: 16, 
        paddingVertical: 12,
        gap: 8 
      }}>
        {['Milwaukee', 'Mauston'].map(region => (
          <TouchableOpacity
            key={region}
            onPress={() => handleFilterPress(region)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: selectedRegion === region 
                ? darkForestTheme.colors.accent.primary 
                : darkForestTheme.colors.background.secondary
            }}
          >
            <Text style={{ color: darkForestTheme.colors.text.primary, fontWeight: '600' }}>
              {region}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Location Grid */}
      <FlatList
        data={filteredLocations}
        numColumns={2}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setActiveSpot(item)}
            style={{
              flex: 1,
              marginHorizontal: 8,
              marginVertical: 8,
              padding: 12,
              backgroundColor: darkForestTheme.colors.background.secondary,
              borderRadius: 12,
              borderWidth: activeSpot?.id === item.id ? 2 : 0,
              borderColor: darkForestTheme.colors.accent.primary
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: darkForestTheme.colors.text.primary }}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 12, color: darkForestTheme.colors.text.secondary, marginVertical: 4 }}>
              {item.accessPoint}
            </Text>
            <TouchableOpacity
              onPress={() => handleGoFish(item)}
              style={{
                marginTop: 12,
                paddingVertical: 12,
                backgroundColor: darkForestTheme.colors.accent.primary,
                borderRadius: 8,
                alignItems: 'center'
              }}
            >
              <Text style={{ fontWeight: '600', color: darkForestTheme.colors.text.primary }}>
                GO FISH
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchNavigateScreen;
```

---

## 🚨 Debugging Tips

### Check Locations Loaded
```javascript
// In SearchNavigateScreen component
useEffect(() => {
  console.log('Total locations:', wisconsinLocations.length);
  console.log('Locations:', wisconsinLocations);
}, []);

// Expected output: 11 locations with full data
```

### Verify Theme Colors
```javascript
// In any component
useEffect(() => {
  console.log('Theme:', darkForestTheme);
  console.log('Background:', darkForestTheme.colors.background.primary);
  console.log('Accent:', darkForestTheme.colors.accent.primary);
}, []);
```

### Test Navigation
```javascript
// In component or console
import { launchNavigation } from './src/services/navigationService';

launchNavigation("McKinley Marina Public Fishing Pier Milwaukee", "McKinley Pier")
  .then(() => console.log('Navigation successful'))
  .catch(err => console.error('Navigation error:', err));
```

---

## ✅ Quick Validation Checklist

Copy this into your component to verify everything is working:

```javascript
useEffect(() => {
  // 1. Check theme loaded
  console.assert(darkForestTheme.colors.background.primary === '#1A2421', 'Theme color mismatch');
  
  // 2. Check locations loaded
  console.assert(wisconsinLocations.length === 11, `Expected 11 locations, got ${wisconsinLocations.length}`);
  
  // 3. Check each location has required fields
  wisconsinLocations.forEach((loc, idx) => {
    console.assert(loc.id, `Location ${idx} missing id`);
    console.assert(loc.name, `Location ${idx} missing name`);
    console.assert(loc.query, `Location ${idx} missing query`);
    console.assert(loc.region, `Location ${idx} missing region`);
  });
  
  // 4. Check navigation service exists
  console.assert(typeof launchNavigation === 'function', 'Navigation service not found');
  
  console.log('✅ All validations passed!');
}, []);
```

---

**Happy coding! 🎣**
