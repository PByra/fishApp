# Android Permissions and Device Setup

## Required Android Permissions

The app requires the following permissions in `app.json` (already configured):

- **android.permission.ACCESS_FINE_LOCATION** - GPS location services for map and weather
- **android.permission.ACCESS_COARSE_LOCATION** - Network-based location
- **android.permission.INTERNET** - Download weather data and access online resources

## Galaxy Flip 3 Specific Setup

### Enable Developer Mode
1. Go to **Settings** > **About Phone**
2. Scroll to **Build Number**
3. Tap **Build Number** 7 times
4. Confirm you want to enable Developer Mode

### Enable USB Debugging
1. Go to **Settings** > **Developer Options**
2. Find **USB Debugging** and toggle ON
3. When connecting to computer, select **File Transfer** when prompted

### Connect to Development Machine

**Windows:**
```bash
adb devices  # Should show your Galaxy Flip 3
npm run android
```

**macOS/Linux:**
```bash
adb devices
npm run android
```

## Using Expo Go (Easiest for Flip 3)

1. Install **Expo Go** from Google Play Store
2. Run `npm start`
3. Scan QR code with Galaxy Flip 3 camera or Expo Go app
4. App instantly loads without installation

## Screen Optimization for Foldable Display

The app is optimized for:
- **Inner Display (Folded)**: 5.2" AMOLED screen
- **Outer Display (Unfolded)**: 4.6" AMOLED screen
- **Refresh Rate**: 120Hz (smooth scrolling)
- **Resolution**: 2340×1080 (inner) or 2636×1440 (outer)

Portrait orientation is fixed for better foldable experience.

## Permission Prompts

When first running, users will see prompts for:
1. **Location Access** - Required for weather and map features
2. **Camera Access** - Not currently used, can be denied

Always allow location for full app functionality.
