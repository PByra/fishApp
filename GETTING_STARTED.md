# Wisconsin Fishing App - Getting Started Guide

## 📱 Quick Start

### System Requirements
- **OS:** Windows 10+, macOS 10.14+, or Linux
- **Node.js:** v16+ 
- **Expo CLI:** Latest version
- **Android Device:** Galaxy Flip 3 or Android 10+ emulator

### Installation Steps

#### 1. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org/) (LTS version)
   - Verify installation: `node --version`

#### 2. **Install Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

#### 3. **Setup the Project**
   **Windows:**
   ```bash
   .\setup.bat
   ```
   
   **macOS/Linux:**
   ```bash
   bash setup.sh
   ```
   
   Or manually:
   ```bash
   npm install
   ```

### Running the App

#### Option 1: Expo Go App (Easiest)
1. **Start dev server:**
   ```bash
   npm start
   ```

2. **On Galaxy Flip 3:**
   - Install "Expo Go" app from Google Play Store
   - Scan the QR code shown in terminal
   - App loads in Expo Go

#### Option 2: Direct Android Build
1. **Start with Android:**
   ```bash
   npm run android
   ```

2. **Requirements:**
   - Android Studio installed and configured
   - USB debugging enabled on Galaxy Flip 3
   - Device connected via USB

#### Option 3: Android Emulator
1. **Start Android Emulator via Android Studio**

2. **Run app:**
   ```bash
   npm run android
   ```

## 🎣 App Features

### 🗺️ **Fish Map Tab**
- Browse Wisconsin's best fishing waters
- Search by location name
- View available fish species
- Check difficulty levels
- Tap cards to expand details

### 🌤️ **Weather Tab**
- Real-time weather for Wisconsin
- 5-day forecast
- Wind speed and direction
- Humidity and pressure
- UV index
- Fishing condition recommendations
- Pull to refresh

### 📅 **Seasonal Tab**
- Current in-season fish
- Peak catch months
- Recommended depths
- Fishing tips per species
- Adventure difficulty levels
- Regulatory information

### 🛍️ **Supplies Tab**
- Wisconsin fishing brands
- Equipment recommendations
- Filter by category
- Price and ratings
- Direct links to manufacturers
- Wisconsin business support info
- License reminder

## 🔧 Configuration

### Weather API Integration (Optional)
To use real weather data:

1. **Get API Key:**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key

2. **Add to .env:**
   ```
   WEATHER_API_KEY=your_api_key_here
   ```

3. **Uncomment in `src/services/weatherService.js`**

## 📂 Project Structure

```
fishApp/
├── App.js                      # Main app entry & navigation
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── README.md                   # Full documentation
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── setup.bat / setup.sh        # Setup scripts
│
├── src/
│   ├── screens/
│   │   ├── MapScreen.js        # Fish location display
│   │   ├── WeatherScreen.js    # Weather dashboard
│   │   ├── SeasonalScreen.js   # In-season tracking
│   │   ├── SuppliesScreen.js   # Supply recommendations
│   │   └── HomeScreen.js       # Welcome screen
│   │
│   ├── data/
│   │   ├── wisconsinWaters.js      # 7 major lakes & rivers
│   │   ├── seasonalData.js         # 10 fish species data
│   │   └── wisconsinSupplies.js    # 10+ Wisconsin brands
│   │
│   └── services/
│       └── weatherService.js   # Weather API wrapper
│
└── assets/
    └── (icon, splash, adaptive-icon - to be added)
```

## 🐟 Supported Fish Species

- Walleye ⭐ Wisconsin classic
- Largemouth Bass
- Smallmouth Bass
- Pike
- Musky
- Lake Trout
- Salmon
- Perch
- Crappie
- Catfish

## 🏪 Featured Wisconsin Brands

- **Abu Garcia** - Madison, WI (Reels)
- **Northland Fishing** - Upper Midwest (Lures & Tackle)
- **Rapala** - Classic northern lakes brand (Lures)
- **Lindy Fishing** - Minnesota/Wisconsin region (Lures)
- **Ugly Stik** - Quality rods
- **Shimano** - Premium reels
- **Berkley** - Soft plastics & bait

## ⚡ Mobile Optimization for Galaxy Flip 3

The app is optimized for:
- **Portrait orientation** (natural for foldable)
- **Flip 3-sized screens** (~5.2 inches inner display)
- **Tab-based navigation** (easy thumb access)
- **Readable text sizes** (16px+ minimum)
- **Touch-friendly buttons** (48px+ height)
- **Dark mode ready** (adjustable colors)

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Run on physical Android device
npm run android

# Run on Android emulator
npm run android -- --emulator

# Run on iOS simulator (requires macOS)
npm run ios

# Run on web browser
npm run web

# Build APK for distribution
expo build:android
```

## 📋 Troubleshooting

### "command not found: expo"
**Solution:** Install Expo CLI globally
```bash
npm install -g expo-cli
```

### "Cannot connect to device"
**Solution:** 
- Ensure USB debugging is enabled
- Check adb devices: `adb devices`
- Restart ADB: `adb kill-server && adb start-server`

### "Module not found" errors
**Solution:** Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

### App won't load on Galaxy Flip 3
**Solution:**
- Update Expo Go app to latest version
- Clear Expo Go cache: Go to Settings > Apps > Expo Go > Storage > Clear Cache
- Restart device and try again

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Wisconsin DNR Fishing](https://dnr.wisconsin.gov/topic/fishing)
- [Android Studio Setup](https://developer.android.com/studio)

## 🎓 Next Steps

1. **Install and run the app**
2. **Explore each tab** (Map, Weather, Seasonal, Supplies)
3. **Add your weather API key** for live data
4. **Test on Galaxy Flip 3** with USB or Expo Go
5. **Customize colors and branding** in App.js

## 📝 License

This project is for personal use. Always check Wisconsin DNR regulations and licensing requirements before fishing.

---

**Happy Fishing!** 🎣
