@echo off
REM Wisconsin Fishing App - Setup Script for Windows
REM This script installs dependencies and prepares the app for development

echo ===================================
echo Wisconsin Fishing App - Setup
echo ===================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 16+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] %NODE_VERSION% detected
echo.

REM Install npm dependencies
echo [INFO] Installing dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo [OK] Dependencies installed successfully
) else (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

echo.
echo ===================================
echo [OK] Setup Complete!
echo ===================================
echo.
echo Next steps:
echo.
echo 1. Start Expo development server:
echo    npm start
echo.
echo 2. Run on Android device/emulator:
echo    npm run android
echo.
echo 3. To test on Galaxy Flip 3:
echo    - Ensure developer mode is enabled
echo    - Enable USB debugging
echo    - Run: npx expo start --android
echo.
