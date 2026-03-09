#!/bin/bash

# Wisconsin Fishing App - Setup Script
# This script installs dependencies and prepares the app for development

echo "==================================="
echo "Wisconsin Fishing App - Setup"
echo "==================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✓ Node.js $(node --version) detected"
echo ""

# Install npm dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "==================================="
echo "✓ Setup Complete!"
echo "==================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Start Expo development server:"
echo "   npm start"
echo ""
echo "2. Run on Android device/emulator:"
echo "   npm run android"
echo ""
echo "3. To test on Galaxy Flip 3:"
echo "   - Ensure developer mode is enabled"
echo "   - Enable USB debugging"
echo "   - Run: npx expo start --android"
echo ""
