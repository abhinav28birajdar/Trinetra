@echo off
REM Trinatra Setup Script for Windows
REM This script helps set up the development environment for Trinatra

echo 🚨 Trinatra Safety App Setup Script 🚨
echo =======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available. Please install npm and try again.
    pause
    exit /b 1
)

echo ✅ npm version:
npm --version

REM Install dependencies
echo.
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Check if .env file exists
if not exist ".env" (
    echo.
    echo 📝 Creating .env file template...
    (
        echo # Supabase Configuration
        echo EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
        echo EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
        echo.
        echo # Add your actual Supabase credentials above
        echo # You can find these in your Supabase project dashboard
    ) > .env
    echo ✅ .env file created. Please update it with your Supabase credentials.
) else (
    echo ✅ .env file already exists
)

REM Check if Expo CLI is installed
expo --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo 📱 Installing Expo CLI...
    npm install -g @expo/cli
    
    if %errorlevel% neq 0 (
        echo ⚠️  Failed to install Expo CLI globally. You can still run: npx expo start
    ) else (
        echo ✅ Expo CLI installed successfully
    )
) else (
    echo ✅ Expo CLI is already installed
)

echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo Next Steps:
echo 1. 🗄️  Set up your Supabase database:
echo    - Create a new project at https://supabase.com
echo    - Copy your project URL and anon key to .env file
echo    - Run the SQL script: database/trinatra_schema.sql
echo.
echo 2. 🚀 Start the development server:
echo    npx expo start
echo.
echo 3. 📱 Test on your device:
echo    - Install Expo Go app on your phone
echo    - Scan the QR code from the terminal
echo.
echo 4. 🔧 Build for production (when ready):
echo    eas build --platform all
echo.
echo 📚 For detailed documentation, see README.md
echo 🆘 For support, create an issue on GitHub
echo.
echo Happy coding! 🎯
echo.
pause
