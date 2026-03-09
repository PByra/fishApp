# Wisconsin Fishing App

> ⚠️ **BETA VERSION** - This app is currently in beta testing. Features and functionality may change.

A comprehensive React Native Android app designed for the Galaxy Flip 3, providing Wisconsin anglers with real-time fishing information, weather tracking, seasonal fish data, and Wisconsin-based supply recommendations.

## Features

### 🗺️ **Fish Map**
- Browse Wisconsin lakes and rivers
- Check available fish species by location
- Identify difficulty levels and best seasons
- Get exact coordinates for navigation

### 🌤️ **Weather**
- Real-time weather conditions for Wisconsin lakes
- 5-day fishing forecast
- Wind, humidity, pressure, and UV index data
- Fishing condition recommendations

### 📅 **Seasonal Tracking**
- Current in-season fish species
- Peak catch months
- Depth ranges and fishing tips
- Difficulty levels for each species

### 🛍️ **Supplies & Gear**
- Wisconsin-based fishing brands
- Equipment recommendations by fish species
- Price comparisons and ratings
- Direct links to manufacturer websites

## Wisconsin Waters Included

- Lake Mendota
- Lake Winnebago
- Wisconsin River
- Door County Waters
- Lake Michigan
- Lake Superior
- Rock River

## Target Fish Species

- Walleye
- Largemouth Bass
- Smallmouth Bass
- Pike
- Musky
- Lake Trout
- Salmon
- Perch
- Crappie
- Catfish

## Wisconsin-Focused Brands

- Abu Garcia (Madison, WI headquarters)
- Northland Fishing Tackle (Upper Midwest)
- Rapala
- Lindy Fishing Lures
- Wisconsin DNR Resources

## Installation

### Prerequisites
- Node.js (v16+)
- Expo CLI
- Android device (Galaxy Flip 3) or Android Studio emulator

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Expo development server:**
   ```bash
   npm start
   ```

3. **Run on Android:**
   ```bash
   npm run android
   ```

## Usage

1. **Map:** Explore Wisconsin fishing waters and see what fish are available
2. **Weather:** Check current conditions before your fishing trip
3. **Seasonal:** Identify which fish are in peak season right now
4. **Supplies:** Find recommended gear and support Wisconsin businesses

## Project Structure

```
fishApp/
├── App.js                 # Main navigation setup
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── src/
│   ├── screens/
│   │   ├── MapScreen.js         # Fish location browsing
│   │   ├── WeatherScreen.js     # Weather display
│   │   ├── SeasonalScreen.js    # In-season tracking
│   │   ├── SuppliesScreen.js    # Supply recommendations
│   │   └── HomeScreen.js        # Welcome screen
│   ├── data/
│   │   ├── wisconsinWaters.js    # Lake and river data
│   │   ├── seasonalData.js       # Fish seasonality
│   │   └── wisconsinSupplies.js  # Brand recommendations
│   └── services/
│       └── weatherService.js     # Weather API integration
└── README.md
```

## License Requirements

A Wisconsin fishing license is required for all anglers. Obtain one at [Wisconsin DNR](https://dnr.wisconsin.gov/topic/fishing)

## Technical Stack

- **Framework:** React Native with Expo
- **Navigation:** React Navigation (Bottom Tabs)
- **UI Components:** Feather Icons
- **State Management:** React Hooks
- **Target Platform:** Android 10+ (Galaxy Flip 3 optimized)

## Future Enhancements

- [ ] Real-time GPS map integration
- [ ] Live weather API (OpenWeatherMap, NOAA)
- [ ] Photo gallery of catches
- [ ] Fishing log and records
- [ ] Community catch reports
- [ ] e-commerce integration for supplies
- [ ] Offline map caching
- [ ] Push notifications for in-season alerts

## Contributing

This is a personal fishing app project. Contributions welcome for:
- Additional Wisconsin waters
- More fish species data
- Additional Wisconsin brands
- Weather API integration

## Support

For issues or feature requests, contact the developer.

---

**Made for Wisconsin Anglers** 🎣
