# Quick Start: Search-to-Navigate Feature

## File Structure
```
src/
├── screens/
│   └── SearchNavigateScreen.js          # Main UI component
├── services/
│   └── navigationService.js             # Navigation logic
├── data/
│   └── wisconsinWaters.js               # Location data with queries
└── theme/
    └── darkForest.js                    # Dark Forest theme tokens
```

## Key Files to Integrate

### 1. App.js (Already Updated)
✅ SearchNavigateScreen imported and added as "Search" tab

### 2. Navigation Service Usage

```javascript
import { launchNavigation } from './services/navigationService';

// Trigger navigation
const handleNavigation = async (location) => {
  await launchNavigation(
    location.query,        // e.g., "McKinley Marina Public Fishing Pier Milwaukee"
    location.name          // e.g., "McKinley Pier"
  );
};
```

### 3. Data Structure
Each location now has:
```javascript
{
  id: 1,
  name: "Location Name",
  region: "Geographic Region",
  query: "Google Maps Search Query String",  // ← CRITICAL
  fish: ["Fish1", "Fish2"],
  difficulty: "Easy|Intermediate|Hard",
  accessPoint: "Physical Access Description"
}
```

## Features Implemented

### ✅ Search-to-Navigate Core
- [x] Search query strings (no coordinates needed)
- [x] Android geo: intent support
- [x] iOS Apple Maps fallback
- [x] Web browser fallback
- [x] Error handling and user feedback

### ✅ UI/UX
- [x] Deep Forest Dark Mode theme (#1A2421, #E67E22)
- [x] Bento box grid layout (2 columns)
- [x] Location cards with difficulty badges
- [x] large "GO FISH" buttons (56dp+ touch targets)
- [x] Region filter toggle (Milwaukee / Mauston)
- [x] Active spot tracking

### ✅ Flip 3 Optimization
- [x] Aspect ratio detection (22:9)
- [x] Active spot pinned to top section
- [x] Flexible layout for Flex Mode
- [x] Large touch targets for gloved hands
- [x] Tall narrow cards for thumb navigation

## Customization Guide

### Change Theme Colors
**File:** `src/theme/darkForest.js`

```javascript
// Update accent color
accent: {
  burnt_orange: '#FF6B35',  // Change from #E67E22
  // ... other colors
}
```

### Add New Location
**File:** `src/data/wisconsinWaters.js`

```javascript
{
  id: 12,
  name: "My Fishing Spot",
  region: "New Area",
  category: "Category Name",
  query: "Search Query For Google Maps",
  fish: ["Bass", "Walleye"],
  difficulty: "Easy",
  accessPoint: "Physical Access",
}
```

### Update Filter Regions
**File:** `src/screens/SearchNavigateScreen.js`

```javascript
// Update filter buttons logic
if (selectedRegion.includes('Milwaukee')) {
  locations = wisconsinLocations.filter(loc => 
    loc.region.includes('Milwaukee') || loc.region === selectedRegion
  );
}
```

## Testing on Device

### Android (Galaxy Flip 3)
```bash
# Start app
npm start

# Option 1: Scan QR with Expo Go
# Option 2: Direct to device
adb reverse tcp:8081 tcp:8081
npm run android
```

### Test Navigation
1. Open "Search & Fish" tab
2. Tap any location card → "GO FISH" button
3. Verify Google Maps opens with location search
4. Return to app and try another location

### Test Filters
1. Tap "Milwaukee" filter → verify list updates
2. Tap "Mauston" filter → verify list shows Mauston spots
3. Active spot updates at top (if device has 22:9 ratio)

## Common Issues & Solutions

### Issue: Navigation doesn't open maps
**Solution:** Check android/AndroidManifest.xml has internet permissions
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### Issue: Can't detect Flip 3 aspect ratio
**Solution:** aspectRatio detection uses `screenHeight / screenWidth > 2`
- Emulator: Set device skin to "Galaxy Flip 3"
- Physical: Should auto-detect

### Issue: Dark theme not applying
**Solution:** Ensure darkForestTheme is imported correctly
```javascript
import darkForestTheme from '../theme/darkForest';
// NOT:
// import { darkForestTheme } from '../theme/darkForest';
```

## Data Migration (From Old System)

### Old System (Coordinates)
```javascript
{ id: 1, name: "McKinley", latitude: 43.0520, longitude: -87.8862 }
```

### New System (Search Queries)
```javascript
{ id: 1, name: "McKinley Pier", query: "McKinley Marina Public Fishing Pier Milwaukee" }
```

### Update MapScreen
If MapScreen still uses old coordinate system:
```javascript
// OLD:
const url = `geo:${latitude},${longitude}`;

// NEW:
await launchNavigation(location.query, location.name);
```

## Performance Notes

- **Grid Rendering:** FlatList with 2 columns optimized for 412px width
- **Search:** Helper functions available (`searchLocations()`, `getLocationsByRegion()`)
- **Theme:** Centralized in `darkForest.js` for consistency
- **Navigation:** Lazy loads only when user taps "GO FISH"

## Next Steps

1. ✅ **Deploy to Galaxy Flip 3** - Test on actual device
2. ⏳ **Add Search Input** - Implement search bar filtering
3. ⏳ **Real-time Location** - Show distance from current location
4. ⏳ **Favorites** - Save frequently visited spots
5. ⏳ **Weather Integration** - Show conditions per location

## Support

For issues or questions:
1. Check SEARCH_TO_NAVIGATE.md for detailed documentation
2. Review navigationService.js for implementation details
3. Test on Galaxy Flip 3 with actual network connection

---
**Version:** 1.0.0  
**Last Updated:** March 11, 2026  
**Maintained by:** Senior Android Developer Team
