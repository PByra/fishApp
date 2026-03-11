# Search-to-Navigate Feature - Wisconsin Fishing App

## Overview
The **Search-to-Navigate** feature enables users to quickly find fishing locations in Wisconsin and launch native or web-based navigation with a single tap. Optimized for Samsung Galaxy Flip 3 (22:9 aspect ratio) with Deep Forest Dark Mode theming.

## Architecture

### 1. Data Structure (`wisconsinWaters.js`)
Each location includes:
- `id` - Unique identifier
- `name` - Display name (e.g., "McKinley Pier")
- `region` - Geographic region
- `category` - Grouping category
- `query` - **Search query string** for Google Maps
- `fish` - Array of species available
- `difficulty` - Skill level (Easy, Intermediate, Hard)
- `accessPoint` - Physical access description

**Example:**
```javascript
{
  id: 1,
  name: "McKinley Pier",
  region: "Milwaukee Shore",
  query: "McKinley Marina Public Fishing Pier Milwaukee",
  fish: ["Salmon", "Trout", "Walleye"],
  difficulty: "Easy",
  accessPoint: "Public Fishing Pier",
}
```

### 2. Navigation Service (`navigationService.js`)

#### `launchNavigation(query, locationName)`
Intelligently routes navigation requests:

**Android:**
- Primary: `geo:0,0?q={searchQuery}` → Native Google Maps
- Fallback: Web-based Google Maps if geo intent fails

**iOS:**
- Primary: Apple Maps
- Fallback: Web-based Google Maps

**Web:**
- Direct: `https://www.google.com/maps/search/?api=1&query={query}`

```javascript
import { launchNavigation } from './services/navigationService';

// Launch navigation
await launchNavigation("McKinley Marina Public Fishing Pier Milwaukee", "McKinley Pier");
```

### 3. UI Component (`SearchNavigateScreen.js`)

#### Layout Features:
1. **Header** - Dark forest background with location count
2. **Search Bar** - Visual search placeholder
3. **Region Filter** - Toggle between Milwaukee (45 min) and Mauston Area (90 min)
4. **Active Spot** (Flip 3 only) - Current selection at top for thumb navigation
5. **Bento Box Grid** - 2-column location card layout
6. **Location Cards** - Name, access point, fish species, difficulty badge, GO FISH button

#### Flip 3 Optimization:
- **22:9 aspect ratio detection** (`screenHeight / screenWidth > 2`)
- **Flex Mode support** - Active spot pinned at top, location grid below
- **One-handed navigation** - Tall, narrow cards with large touch targets (56dp+)
- **Grid layout** - 2 columns with responsive spacing

## Color Palette (Deep Forest Dark Mode)

```javascript
Background:      #1A2421 (Primary), #2A3632 (Cards)
Accent:          #E67E22 (Burnt Orange - Buttons)
Text:            #FFFFFF (Primary), #B0B8B5 (Secondary)
Status Colors:   Green (Active), Orange (Caution), Red (Error)
```

## Usage

### How It Works:

1. **User taps "Search & Fish" tab**
   - App displays all fishing locations in Bento box grid
   - Default filter: Milwaukee Shore area

2. **User selects region filter**
   - Toggle between Milwaukee (45 min) or Mauston Area (90 min)
   - List automatically filters

3. **User taps location card**
   - Card highlights with orange accent border
   - Location becomes "active spot"
   - On Flip 3, moves to top section for easy access

4. **User taps "GO FISH" button**
   - Navigation service builds search query
   - Android: Launches native Google Maps via geo: intent
   - iOS: Launches Apple Maps or web fallback
   - Web: Opens Maps in browser

### LocationsList (11 Total Locations):

#### Milwaukee Area (6 locations, 45 min):
- McKinley Pier (Lake Michigan - Easy)
- Lakeshore State Park (Lake Michigan - Easy)
- Estabrook Park (Milwaukee River - Intermediate)
- Kletzsch Park (Milwaukee River - Hard)
- Bender Park (Oak Creek - Easy)

#### Waukesha Area (2 locations):
- Pewaukee Lake (Hard)
- Nagawicka Lake (Intermediate)

#### Mauston Area (4 locations, 90 min):
- Riverside Park (Intermediate)
- Castle Rock (Hard)
- Lemonweir River (Intermediate)
- Castle Rock Dam (Intermediate)

## Theme System

### Dark Forest Theme (`darkForest.js`)
Provides centralized styling tokens:
- Colors (background, accent, text, status)
- Spacing scale (4px-32px)
- Border radius (8px-50px)
- Typography (heading, body, caption, button)
- Shadow depths (small, medium, large)
- Touch targets (48dp, 56dp, 64dp)

## Integration Points

### MapScreen Update
Consider updating MapScreen to use search queries:
```javascript
// Instead of coordinates
launchNavigation(location.query, location.name);

// Old way (keep for reference):
// launchNavigation(latitude, longitude);
```

### SearchableLocations Helper
Use helper functions for search/filtering:
```javascript
import { 
  getLocationsByRegion,
  searchLocations,
  getFeaturedLocations,
  getRegions 
} from './data/wisconsinWaters';

// Get Milwaukee locations
const mkeSpots = getLocationsByRegion("Milwaukee Shore");

// Search by name or species
const bassSpots = searchLocations("bass");

// Get easy difficulty
const easySpots = getFeaturedLocations();
```

## Responsive Breakpoints

### Galaxy Flip 3 (22:9 - 412 x 915px)
- **Active Spot Section** - Pinned at top when in Flex Mode
- **Bento Grid** - 2 columns, full width
- **Card Height** - ~200px (fits 4-5 cards per screen with scrolling)
- **Touch Targets** - Minimum 56dp

### Regular Android Phones (16:9 - 1080 x 1920px)
- **Bento Grid** - 2 columns
- **Standard scroll** - Full list available

### Tablets/Web
- **Bento Grid** - Can expand to 3-4 columns
- **Active Spot** - Optional sidebar

## Testing Checklist

- [ ] Navigation opens Google Maps on Android
- [ ] Navigation opens Apple Maps on iOS
- [ ] Web fallback works if native intent fails
- [ ] Filter toggle switches regions correctly
- [ ] Grid displays 2 columns on phone, 3+ on tablet
- [ ] Touch targets are 56dp+ minimum
- [ ] Dark theme renders correctly
- [ ] Flip 3 aspect ratio detected properly
- [ ] Active spot updates correctly
- [ ] GO FISH button highlights on press

## Future Enhancements

1. **Search Input** - Make search bar functional to filter by name
2. **Real-time Location** - Show distance based on user GPS
3. **Favorites** - Save frequently visited spots
4. **Recent** - Quick access to recently searched locations
5. **Share** - Share location search query via messaging
6. **Weather Integration** - Show current conditions per location
7. **Catch History** - Record catches and connect to locations
8. **Offline Maps** - Cache location data and maps for offline use

## API Reference

### navigationService.js

#### `launchNavigation(query, locationName)`
- **Parameters:**
  - `query` (string): Google Maps search query
  - `locationName` (string): Display name for error messages
- **Returns:** Promise<void>
- **Example:** `await launchNavigation("McKinley Marina Fishing", "McKinley Pier")`

#### `openWebMaps(query)`
- **Parameters:**
  - `query` (string): Search query
- **Returns:** Promise<void>

#### `buildSearchQuery(location)`
- **Parameters:**
  - `location` (object): Location object with name, region
- **Returns:** String search query

#### `shareLocation(location)`
- **Parameters:**
  - `location` (object): Location object
- **Returns:** String formatted message

#### `isValidQuery(query)`
- **Parameters:**
  - `query` (string): Query to validate
- **Returns:** Boolean

---

**Last Updated:** March 11, 2026  
**Status:** Production Ready  
**Target Device:** Samsung Galaxy Flip 3 (Android 10+)
