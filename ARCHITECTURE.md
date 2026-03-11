# Search-to-Navigate Architecture Diagram

## Data Flow

```
User Interface (SearchNavigateScreen.js)
        │
        ├─ Region Filter Toggle
        │  └─ useState: selectedRegion
        │
        ├─ Location Card Selection
        │  ├─ FlatList (2-column Bento Grid)
        │  ├─ Difficulty Badge (E/I/H)
        │  └─ Fish Species Tags
        │
        └─ GO FISH Button Press
           │
           ▼
Navigation Service (navigationService.js)
        │
        ├─ launchNavigation(query, name)
        │  │
        │  ├─ Android Path
        │  │  ├─ geo:0,0?q={query}
        │  │  └─ → Native Google Maps
        │  │
        │  ├─ iOS Path
        │  │  ├─ maps://maps.apple.com/?q={query}
        │  │  └─ → Apple Maps (or web fallback)
        │  │
        │  └─ Web Path
        │     └─ google.com/maps/search?query={query}
        │
        └─ Error Handling
           └─ Alert user on failure
```

## Component Architecture

```
App.js
  │
  ├─ Tab Navigator (BottomTabs)
  │  ├─ Home
  │  ├─ [Search & Fish] ← NEW
  │  ├─ Map
  │  ├─ Weather
  │  ├─ Seasonal
  │  └─ Supplies
  │
  └─ Search & Fish Screen (SearchNavigateScreen.js)
     │
     ├─ Header
     │  └─ "SEARCH & FISH" + location count
     │
     ├─ Search Bar
     │  └─ Input field for location search
     │
     ├─ Filter Container
     │  ├─ Milwaukee Button (45 min)
     │  └─ Mauston Button (90 min)
     │
     ├─ Active Spot (Flip 3 only)
     │  └─ Current selection display + GO FISH quick access
     │
     ├─ Bento Grid (2 columns)
     │  ├─ Location Card 1
     │  ├─ Location Card 2
     │  ├─ Location Card 3
     │  └─ ...
     │
     └─ Location Card (Reusable)
        ├─ Header
        │  ├─ Location Name
        │  ├─ Access Point
        │  └─ Difficulty Badge
        │
        ├─ Fish Tags
        │  ├─ Fish Species 1
        │  ├─ Fish Species 2
        │  └─ +N badge
        │
        └─ GO FISH Button
           └─ launchNavigation(query)
```

## Data Structure Hierarchy

```
wisconsinLocations (Array)
└─ Each Location Object
   ├─ id: Number
   ├─ name: String               "McKinley Pier"
   ├─ region: String             "Milwaukee Shore"
   ├─ category: String           "MKE Shore"
   ├─ query: String              "McKinley Marina Public..."  ← KEY FOR NAVIGATION
   ├─ fish: Array[String]        ["Salmon", "Trout", ...]
   ├─ difficulty: String         "Easy|Intermediate|Hard"
   └─ accessPoint: String        "Public Fishing Pier"
```

## Theme Structure

```
darkForestTheme.js
├─ Background Colors
│  ├─ primary: #1A2421 (base)
│  ├─ secondary: #2A3632 (cards)
│  └─ tertiary: #3A4A42 (hover)
│
├─ Accent Colors
│  ├─ burnt_orange: #E67E22 (PRIMARY CTA)
│  ├─ burnt_orange_light: #EC8C3A
│  └─ burnt_orange_dark: #D67A1E
│
├─ Text Colors
│  ├─ primary: #FFFFFF
│  ├─ secondary: #B0B8B5
│  ├─ tertiary: #7A8A87
│  └─ accent: #E67E22
│
├─ Status Colors
│  ├─ active: #27AE60 (GREEN)
│  ├─ inactive: #7A8A87 (GRAY)
│  ├─ warning: #F39C12 (ORANGE)
│  └─ error: #E74C3C (RED)
│
├─ Spacing Scale (8px base)
│  ├─ xs: 4px
│  ├─ sm: 8px
│  ├─ md: 12px
│  ├─ lg: 16px
│  ├─ xl: 24px
│  └─ xxl: 32px
│
└─ Typography System
   ├─ heading: 28px, 700, line-height 32
   ├─ subheading: 20px, 700, line-height 24
   ├─ body: 14px, 500, line-height 20
   ├─ caption: 12px, 500, line-height 16
   └─ button: 16px, 700, line-height 20
```

## Location Regions Map

```
┌─────────────────────────────────────────────────────────┐
│                      WISCONSIN                          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │            📍 Mauston Area (90 min)            │  │
│  │  ID  8: Riverside Park                        │  │
│  │  ID  9: Castle Rock                           │  │
│  │  ID 10: Lemonweir River                       │  │
│  │  ID 11: Castle Rock Dam                       │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                               │
│                         │ (Transit Zone)               │
│                         ▼                               │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │    📍 Milwaukee Area / Waukesha (45 min)       │  │
│  │                                                  │  │
│  │    Shore Zone:                                 │  │
│  │    ID 1: McKinley Pier                        │  │
│  │    ID 2: Lakeshore State Park                 │  │
│  │                                                  │  │
│  │    River Zone:                                 │  │
│  │    ID 3: Estabrook Park                       │  │
│  │    ID 4: Kletzsch Park                        │  │
│  │                                                  │  │
│  │    South Zone:                                 │  │
│  │    ID 5: Bender Park                          │  │
│  │                                                  │  │
│  │    Waukesha Zone:                              │  │
│  │    ID 6: Pewaukee Lake                        │  │
│  │    ID 7: Nagawicka Lake                       │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Flip 3 Layout Optimization

### Standard Screen (16:9 - ~1080x1920px)
```
┌─────────────────┐
│     HEADER      │  ← "SEARCH & FISH"
├─────────────────┤
│   SEARCH BAR    │  ← Query input
├─────────────────┤
│   FILTER BTNS   │  ← Region toggle
├─────────────────┤
│  GRID ITEM 1    │  ← Card (half width)
│  GRID ITEM 2    │  ← Card (half width)
├─────────────────┤
│  GRID ITEM 3    │  ← Card (half width)
│  GRID ITEM 4    │  ← Card (half width)
├─────────────────┤
│  GRID ITEM 5    │  ← (scroll for more)
│  GRID ITEM 6    │
└─────────────────┘
   4-5 cards visible
```

### Galaxy Flip 3 (22:9 - ~412x915px)
```
┌──────────────┐
│    HEADER    │  ← "SEARCH & FISH"
├──────────────┤
│  SEARCH BAR  │  ← Query input
├──────────────┤
│ FILTER BTNS  │  ← Region toggle
├──────────────┤ ← FLEX MODE SPLIT POINT
│ ACTIVE SPOT  │  ← Current location pinned (Flex)
│ + GO FISH    │
├──────────────┤
│ GRID ITEM 1  │  ← Full width card
├──────────────┤
│ GRID ITEM 2  │  ← Full width card
├──────────────┤
│ GRID ITEM 3  │  ← (scroll for more)
├──────────────┤
│ GRID ITEM 4  │
└──────────────┘
   2-3 cards visible
   One-handed thumb navigation
```

## File Dependencies

```
App.js
  └─ NavigationContainer
     ├─ BottomTabNavigator
        ├─ HomeScreen
        ├─ SearchNavigateScreen.js ← NEW
        │  ├─ wisconsinWaters.js (data)
        │  │  └─ getLocationsByRegion()
        │  │  └─ searchLocations()
        │  ├─ navigationService.js (logic)
        │  │  └─ launchNavigation()
        │  └─ darkForest.js (theming)
        │     └─ Colors, spacing, typography
        ├─ MapScreen (still uses old system)
        ├─ WeatherScreen
        ├─ SeasonalScreen
        └─ SuppliesScreen
```

## Search Query Transformation

```
User Input:        "Walleye fishing near Milwaukee"
                           │
                           ▼
Search Processing:  searchLocations("walleye fishing...")
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    Match Name      Match Fish       Match Query
    "Estabrook"     "McKinley"       "Lakeshore"
           │               │               │
           └───────────────┴───────────────┘
                           │
                           ▼
     Filtered Results: [ID 2, ID 3, ID 4...]
                           │
                           ▼
    User Taps "GO FISH"
                           │
                           ▼
    queryString = "McKinley Marina Public..."
                           │
                           ▼
    launchNavigation(queryString)
                           │
                 ┌─────────┼─────────┐
                 ▼         ▼         ▼
            Android      iOS       Web
           geo:0,0?q=   maps://   google.com/maps/search
```

---

**Diagram Version:** 1.0  
**Last Updated:** March 11, 2026
