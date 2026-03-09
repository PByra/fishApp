# Android Setup for Windows - Complete Guide

## Problem
You see a macOS/Unix path: `~/Library/Android/sdk/emulator`
But you're on Windows and need a Windows path like: `C:\Users\03608\AppData\Local\Android\sdk`

## Solution: Install Android Studio for Windows

### Step 1: Download Android Studio
1. Go to [developer.android.com/studio](https://developer.android.com/studio)
2. Download **Android Studio for Windows**
3. Run the installer: `AndroidStudio-XXXX.exe`

### Step 2: During Installation
- Accept default installation path: `C:\Program Files\Android\Android Studio`
- Let it install the Android SDK (it will be to: `C:\Users\03608\AppData\Local\Android\sdk`)
- Wait for SDK components to download (may take 5-10 minutes)

### Step 3: Complete Installation
1. Launch Android Studio
2. Go through the setup wizard
3. Download at least one Android SDK version (e.g., API 30 or 33)
4. Download Android Emulator when prompted

### Step 4: Verify Installation
```powershell
# Open PowerShell and check if SDK is installed
Test-Path "C:\Users\03608\AppData\Local\Android\sdk\platform-tools\adb.exe"
Test-Path "C:\Users\03608\AppData\Local\Android\sdk\emulator\emulator.exe"
```

If both return `True`, you're good!

## Quick Setup (After Android Studio installed)

```powershell
# Set environment variables
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\03608\AppData\Local\Android\sdk", "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", "C:\Users\03608\AppData\Local\Android\sdk", "User")

# Update current session
$env:ANDROID_HOME = "C:\Users\03608\AppData\Local\Android\sdk"
$env:ANDROID_SDK_ROOT = "C:\Users\03608\AppData\Local\Android\sdk"
$env:Path += ";C:\Users\03608\AppData\Local\Android\sdk\platform-tools"
$env:Path += ";C:\Users\03608\AppData\Local\Android\sdk\emulator"

# Verify
adb version
emulator -list-avds
```

## Alternative: Use Existing macOS SDK

If you need to use the existing macOS path, you would need to:
- Run on a macOS machine
- Use Windows Subsystem for Linux (WSL2) with Android emulator
- Use a cloud-based emulator (Appetize.io, BrowserStack)

## Recommended Path Forward

1. **For Development:** Download Android Studio for Windows (official, easiest)
2. **For Testing:** Use Expo Go app on physical Galaxy Flip 3
3. **For CI/CD:** Use cloud emulators (GitHub Actions, BrowserStack)

---

**Have you installed Android Studio yet?**
- If YES: Let me know the installation path
- If NO: Please download and install Android Studio for Windows, then come back
