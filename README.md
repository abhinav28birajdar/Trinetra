# Trinatra Safety App

<div align="center">
  <img src="./assets/images/icon.png" alt="Trinatra Logo" width="150" />
</div>

Trinatra is a comprehensive personal safety application built with React Native and Expo that empowers users to stay safe in emergency situations. With features like one-touch emergency calling, real-time location sharing, and trusted contact management, Trinatra provides peace of mind and critical safety tools when you need them most.

## Features

- **Emergency SOS**: One-touch emergency assistance with automatic location sharing
- **Live Location Tracking**: Share your real-time location with trusted emergency contacts
- **Safety Network**: Build and manage your personal safety network of trusted contacts
- **Call Logging & History**: Comprehensive record of all emergency interactions
- **User Profiles**: Store critical medical and personal information for emergency responders
- **Offline Capability**: Core features work even with limited connectivity

## Tech Stack

- **Frontend**: React Native, Expo, React Navigation v7
- **UI/UX**: NativeWind (Tailwind CSS for React Native), Expo-Blur
- **Backend**: Supabase (Authentication, Database, Storage)
- **State Management**: Zustand for global state management
- **Location Services**: Expo Location with background tracking
- **Networking**: NetInfo for connectivity monitoring, offline support
- **Security**: Environment variable protection, SQL injection prevention
- **Database**: PostgreSQL (via Supabase) with Row Level Security

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- A Supabase account with project setup
- Android Studio or Xcode for native development (optional)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/trinatra.git
   cd trinatra
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the setup script:
   ```bash
   # For Windows
   ./setup.bat
   
   # For Unix/Linux/Mac
   ./setup.sh
   ```

5. Start the development server:
   ```bash
   npm start
   ```

## Database Setup

The application requires a properly configured Supabase backend. Follow these steps to set up your database:

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)

2. In your Supabase project's SQL Editor, import and run the complete database schema:
   ```sql
   -- Copy and paste the contents of database/trinatra_schema.sql
   ```
   
3. Alternatively, you can use the provided schema update guides:
   ```bash
   # For Windows
   ./update_schema_guide.bat
   
   # For Unix/Linux/Mac
   ./update_schema_guide.sh
   ```

4. If you encounter the error "Database error saving new user" during registration:
   - This is a schema issue
   - Make sure you've run the COMPLETE schema from `database/trinatra_schema.sql`
   - The schema includes critical triggers that automatically create profiles for new users

5. The schema creates the following essential tables:
   - `profiles`: User profile information with emergency details
   - `emergency_contacts`: Trusted contacts for each user
   - `location_sharing`: Real-time location tracking records
   - `call_logs`: History of emergency calls with timestamps and duration
   - `auth.users`: Automatically managed by Supabase Auth

6. Verify your database setup by checking that Row Level Security (RLS) policies are active and triggers are properly configured

## Project Structure

```
trinatra/
├── app/                   # Main application screens using Expo Router
│   ├── (tabs)/            # Tab-based navigation screens
│   ├── _layout.tsx        # Root layout and navigation setup
│   ├── index.tsx          # Entry point redirecting to appropriate screen
│   └── ...                # Other screens (login, register, etc.)
├── assets/                # Static assets (images, fonts)
├── components/            # Reusable React components
├── database/              # SQL schema files
│   └── trinatra_complete_schema.sql  # Complete database schema
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client configuration
│   └── firebase.ts        # Firebase configuration (optional)
├── store/                 # State management
│   └── auth.ts            # Authentication state
└── types/                 # TypeScript type definitions
```

## Key Features Implementation

### Emergency SOS Button
The SOS feature uses Expo's location services to capture the user's current position and automatically shares it with emergency contacts while initiating a call.

### Live Location Sharing
Real-time location tracking is implemented using Expo Location with background capabilities, storing location data in Supabase for trusted contacts to access.

### User Authentication Flow
The app implements a comprehensive authentication system with registration, login, password recovery, and profile management.

## Development

### Starting the Development Server

```bash
# Start the Expo development server
npm start

# Start with a specific platform
npm run android
npm run ios
```

### Running in Development Mode

The development server provides several options:
- Press `a` to open on Android
- Press `i` to open on iOS
- Press `w` to open in web browser

### Building for Production

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Troubleshooting

### Common Issues

#### Port Conflicts
If you encounter a port conflict error (e.g., "Port 8081 is already in use"), you can kill the process using:

**Windows:**
```powershell
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :8081
kill -9 <PID>
```

#### Database Registration Errors
If you see "Database error saving new user" during registration:
1. This is a schema issue that occurs when the required database triggers aren't set up properly
2. Follow these steps to fix it:
   - Go to your Supabase project dashboard
   - Open the SQL Editor
   - Create a new query
   - Copy and paste the ENTIRE contents of `database/trinatra_schema.sql`
   - Run the script
   - Restart your app and try registering again
3. You can verify the fix by checking for the existence of these triggers in your database:
   - `on_auth_user_created` trigger on the `auth.users` table
   - `on_profile_created` trigger on the `profiles` table

The error happens because when a user registers, the auth.users table is created by Supabase, but the corresponding profile isn't automatically created unless the proper triggers are in place.

#### Navigation/Layout Errors
If you encounter "Maximum update depth exceeded" errors:
1. Check for infinite loops in navigation logic
2. Verify that navigation state is properly managed with useRef where needed
3. Make sure conditional rendering doesn't cause infinite renders

#### Network Connectivity Issues
For network-related issues:
1. Check your Supabase project is active and accessible
2. Verify your network connection and firewall settings
3. The app includes offline functionality for core features

### Reset Development Environment

If you encounter persistent issues, try resetting your development environment:

```bash
# Clear Metro bundler cache
npm start -- --reset-cache

# Reset the project using the provided script
npm run reset-project
```

## Security Features

Trinatra implements several security best practices:
- Row Level Security (RLS) in Supabase
- Secure environment variable handling
- Input validation to prevent SQL injection
- Secure authentication flow with session management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <p>Built with ❤️ for safety and peace of mind</p>
  <p>© 2024 Trinatra Safety App</p>
</div>
The app includes network connectivity detection. If you're experiencing database issues, check your internet connection and ensure Supabase services are accessible.

## License

[MIT License](LICENSE)

## Contributors

- Original development team
- Contributors welcome!
