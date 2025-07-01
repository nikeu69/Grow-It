#!/bin/bash

echo "🌱 Setting up Growth It! Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
if [ "$(printf '%s\n' "$NODE_VERSION" "16.0.0" | sort -V | head -n1)" != "16.0.0" ]; then
    echo "❌ Node.js version must be 16.0.0 or higher. Current version: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js version is compatible: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if running on macOS for iOS setup
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 macOS detected - setting up iOS dependencies..."
    
    # Check if CocoaPods is installed
    if ! command -v pod &> /dev/null; then
        echo "📱 Installing CocoaPods..."
        sudo gem install cocoapods
    fi
    
    # Install iOS pods
    echo "📱 Installing iOS pods..."
    cd ios && pod install && cd ..
    
    if [ $? -eq 0 ]; then
        echo "✅ iOS setup completed"
    else
        echo "⚠️ iOS setup failed, but you can still develop for Android"
    fi
else
    echo "🤖 Non-macOS system detected - iOS development not available"
fi

# Create development directories
echo "📁 Creating development directories..."
mkdir -p assets/images
mkdir -p assets/sounds/sfx
mkdir -p assets/sounds/music
mkdir -p assets/sounds/voice
mkdir -p assets/sounds/ambient

echo ""
echo "🎉 Setup complete! Growth It! is ready for development."
echo ""
echo "Next steps:"
echo "1. 🚀 Start Metro bundler: npm start"
echo "2. 🤖 Run on Android: npm run android"
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "3. 🍎 Run on iOS: npm run ios"
fi
echo ""
echo "Happy coding! Let's help Pipsqueak grow! 🌱📏"