#!/bin/bash

# Trinatra Setup Script
# This script helps set up the development environment for Trinatra

echo "🚨 Trinatra Safety App Setup Script 🚨"
echo "======================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please install npm and try again."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ""
    echo "📝 Creating .env file template..."
    cat > .env << EOF
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Add your actual Supabase credentials above
# You can find these in your Supabase project dashboard
EOF
    echo "✅ .env file created. Please update it with your Supabase credentials."
else
    echo "✅ .env file already exists"
fi

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo ""
    echo "📱 Installing Expo CLI..."
    npm install -g @expo/cli
    
    if [ $? -ne 0 ]; then
        echo "⚠️  Failed to install Expo CLI globally. You can still run: npx expo start"
    else
        echo "✅ Expo CLI installed successfully"
    fi
else
    echo "✅ Expo CLI is already installed"
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next Steps:"
echo "1. 🗄️  Set up your Supabase database:"
echo "   - Create a new project at https://supabase.com"
echo "   - Copy your project URL and anon key to .env file"
echo "   - Run the SQL script: database/trinatra_schema.sql"
echo ""
echo "2. 🚀 Start the development server:"
echo "   npx expo start"
echo ""
echo "3. 📱 Test on your device:"
echo "   - Install Expo Go app on your phone"
echo "   - Scan the QR code from the terminal"
echo ""
echo "4. 🔧 Build for production (when ready):"
echo "   eas build --platform all"
echo ""
echo "📚 For detailed documentation, see README.md"
echo "🆘 For support, create an issue on GitHub"
echo ""
echo "Happy coding! 🎯"
