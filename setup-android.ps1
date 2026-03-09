# Android SDK & ADB Setup Script for Windows
# Run this script as Administrator to set up adb and Android tools

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Android SDK Setup for fishApp" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check for Android SDK
Write-Host "Step 1/3: Finding Android SDK..." -ForegroundColor Yellow

$possiblePaths = @(
    "C:\Users\03608\AppData\Local\Android\sdk",
    "C:\Android\sdk",
    "D:\Android\sdk",
    "${env:ProgramFiles}\Android\Android-sdk",
    "${env:ProgramFiles(x86)}\Android\android-sdk",
    "C:\Users\03608\AppData\Local\Android\Sdk"
)

$sdkPath = $null
foreach ($path in $possiblePaths) {
    if (Test-Path "$path\platform-tools\adb.exe") {
        $sdkPath = $path
        Write-Host "Found Android SDK at: $sdkPath" -ForegroundColor Green
        break
    }
}

if ($null -eq $sdkPath) {
    Write-Host "Android SDK not found in common locations" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please enter your Android SDK path manually:" -ForegroundColor Yellow
    Write-Host "Example: C:\Users\03608\AppData\Local\Android\sdk" -ForegroundColor Gray
    $sdkPath = Read-Host "Enter Android SDK path"
    
    if (-not (Test-Path "$sdkPath\platform-tools\adb.exe")) {
        Write-Host "adb.exe not found at $sdkPath\platform-tools" -ForegroundColor Red
        Write-Host "Please verify the path and try again" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Set Environment Variables
Write-Host ""
Write-Host "Step 2/3: Setting environment variables..." -ForegroundColor Yellow

[Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdkPath, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $sdkPath, "User")

# Update current session
$env:ANDROID_HOME = $sdkPath
$env:ANDROID_SDK_ROOT = $sdkPath
$env:Path += ";$($sdkPath)\platform-tools;$($sdkPath)\emulator"

Write-Host "ANDROID_HOME set to: $sdkPath" -ForegroundColor Green
Write-Host "Added platform-tools to PATH" -ForegroundColor Green

# Step 3: Verify ADB
Write-Host ""
Write-Host "Step 3/3: Verifying ADB..." -ForegroundColor Yellow

$adbTest = & "$sdkPath\platform-tools\adb.exe" version
if ($adbTest) {
    Write-Host "ADB is working!" -ForegroundColor Green
    Write-Host $adbTest -ForegroundColor Gray
} else {
    Write-Host "ADB verification failed" -ForegroundColor Red
    exit 1
}

# Check for devices/emulators
Write-Host ""
Write-Host "Connected devices/emulators:" -ForegroundColor Cyan
& "$sdkPath\platform-tools\adb.exe" devices

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Close and reopen PowerShell for PATH changes to take effect"
Write-Host "2. Run: emulator -list-avds (to list available emulators)"
Write-Host "3. Run: emulator -avd [AVD_NAME] (to start an emulator)"
Write-Host "4. Run: npm run android (to deploy the app)"
Write-Host ""
