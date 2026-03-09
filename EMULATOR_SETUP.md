# Android Emulator + scrcpy Development Setup

## Prerequisites

You'll need:
1. **Android Studio** (includes emulator)
2. **Android SDK** (platform tools)
3. **scrcpy** (display and control Android devices)
4. **Expo CLI & Node.js**

## Step 1: Set Up Android SDK Path

### Windows - Add SDK to PATH

1. **Find your Android SDK location:**
   - Usually: `C:\Users\[YourUsername]\AppData\Local\Android\sdk`
   - Or check Android Studio: File > Settings > Appearance & Behavior > System Settings > Android SDK

2. **Add to Windows PATH:**
   ```powershell
   # Open PowerShell as Administrator and run:
   [Environment]::SetEnvironmentVariable(
       "ANDROID_HOME",
       "C:\Users\03608\AppData\Local\Android\sdk",
       "User"
   )
   
   # Add platform-tools to PATH
   $env:Path += ";C:\Users\03608\AppData\Local\Android\sdk\platform-tools"
   ```

3. **Verify it works:**
   ```powershell
   adb version
   ```

## Step 2: Install scrcpy

### Option A: Using Chocolatey (Easiest)
```powershell
# Install Chocolatey first if needed, then:
choco install scrcpy
```

### Option B: Manual Download
1. Download from [scrcpy GitHub](https://github.com/Genymobile/scrcpy/releases)
2. Extract to `C:\scrcpy` or add to PATH
3. Verify: `scrcpy --version`

## Step 3: Start the Android Emulator

### From Android Studio:
1. Open Android Studio
2. Click **AVD Manager** (device icon)
3. Select your emulator
4. Click **Play** (green triangle)
5. Wait for boot (1-2 minutes)

### From Command Line:
```powershell
# List available emulators
emulator -list-avds

# Start emulator (replace with your AVD name)
emulator -avd Pixel_4_API_30
```

## Step 4: Connect scrcpy to Emulator

Once emulator is running:

```powershell
# Start scrcpy
scrcpy

# Or with options
scrcpy --max-size 1080 --bit-rate 4M --window-title "Galaxy Flip 3 Emulator"
```

### Useful scrcpy Flags:
```powershell
# Lower resolution (faster)
scrcpy --max-size 720

# Better quality
scrcpy --bit-rate 8M

# Record screen
scrcpy --record screen.mp4

# No audio
scrcpy --no-audio

# Stay on top
scrcpy --always-on-top

# Disable screen timeout
scrcpy --turn-screen-off
```

## Step 5: Deploy Fishing App to Emulator

### Terminal 1 - Start Expo Server:
```powershell
cd c:\Users\03608\Desktop\Repos\fishApp
npm start
```

### Terminal 2 - Run on Emulator:
```powershell
cd c:\Users\03608\Desktop\Repos\fishApp
npm run android
```

Or manually through Expo:
1. In Expo terminal, press `a` to open on Android
2. Select the running emulator when prompted

## Complete Workflow Example

Terminal 1 (Emulator):
```powershell
# Start emulator
emulator -avd Pixel_4_API_30

# Wait 1-2 minutes for boot...
```

Terminal 2 (scrcpy - optional but recommended):
```powershell
scrcpy --max-size 1080 --window-title "Fishing App Dev"
```

Terminal 3 (Expo Dev Server):
```powershell
cd c:\Users\03608\Desktop\Repos\fishApp
npm start
```

Terminal 4 (Deploy):
```powershell
cd c:\Users\03608\Desktop\Repos\fishApp
npm run android
```

## Troubleshooting

### "adb: command not found"
**Solution:** Set ANDROID_HOME environment variable:
```powershell
$env:ANDROID_HOME = "C:\Users\03608\AppData\Local\Android\sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"
```

### Emulator won't start
**Solution:** Check if GPU is enabled:
1. Open Android Studio > AVD Manager
2. Right-click emulator > Edit
3. Under "Graphics," select "Hardware - GLES 2.0"
4. Or try "Software" if hardware fails

### scrcpy connection refused
**Solution:** 
1. Ensure emulator is fully booted
2. Run `adb kill-server && adb start-server`
3. Check: `adb devices` (should show your emulator)

### Port already in use
**Solution:**
```powershell
# Find process using port (e.g., 5555)
netstat -ano | findstr :5555

# Kill process
taskkill /PID [PID] /F
```

## Testing the App

Once deployed:

1. **Tap each tab:**
   - 🗺️ Fish Map - Browse Wisconsin waters
   - 🌤️ Weather - Check conditions
   - 📅 Seasonal - In-season fish
   - 🛍️ Supplies - Wisconsin brands

2. **Test interactions:**
   - Expand/collapse cards
   - Filter supplies by category
   - Scroll through lists

3. **Check console:**
   - Expo terminal shows any errors
   - Check for warnings

## Performance Tips

- Use `--max-size 720` for faster rendering
- Reduce `--bit-rate` to 2M if network is slow
- Keep emulator zoom at 100% in scrcpy
- Close unnecessary apps on emulator

## Galaxy Flip 3 Emulator Specific

If using Galaxy Fold emulator:

```powershell
# Set foldable model
scrcpy --max-size 1080 --window-title "Galaxy Flip 3"

# Note: App is portrait-locked for optimal foldable experience
```

---

**Next Steps:**
1. Set ANDROID_HOME path
2. Start emulator
3. Launch scrcpy (optional)
4. Deploy app with `npm run android`
