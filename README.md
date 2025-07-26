# 🛡️ Trinatra - Women's Safety & Emergency App

A comprehensive React Native application designed for women's safety, featuring emergency services, location sharing, and community support - built with modern UI/UX design.

## 🎨 **Modern Design Features**

- **Purple Gradient Theme** - Beautiful purple gradient backgrounds throughout
- **Figma-Inspired UI** - Professional design matching modern safety app standards
- **Card-Based Layouts** - Clean, modern card components with shadows
- **Responsive Design** - Optimized for various screen sizes
- **Animated Interactions** - Smooth animations and transitions

## 🚀 **Key Features**

### 🆘 **Emergency SOS System**
- **Large TAP Button** - Prominent emergency activation button
- **5-Second Countdown** - Safety countdown with cancel option
- **Multiple Emergency Numbers** - Police (100), Medical (102), Fire (101), Women Helpline (1091)
- **Vibration Feedback** - Physical feedback during emergency activation
- **Instant Calling** - Direct dialing to emergency services

### 📍 **Live Location Sharing**
- **Real-Time Tracking** - Share live location with emergency contacts
- **Duration Control** - Set sharing duration (15min, 30min, 1hr, 2hr, continuous)
- **Contact Selection** - Choose which contacts receive location updates
- **Map Preview** - Visual representation of current location
- **Permission Management** - Proper location permission handling

### 👥 **Emergency Contacts Management**
- **Family Contacts** - Father, Mother, Sister, Uncle with color-coded avatars
- **Emergency Services** - Quick access to Police, Medical, Women Safety
- **Search Functionality** - Easy contact search and filtering
- **One-Touch Calling** - Instant calling with confirmation dialogs
- **Emergency Badges** - Visual indicators for emergency contacts

### 💬 **Community Features**
- **Safety Chat** - Connect with local safety community
- **Emergency Alerts** - Community-wide emergency notifications
- **Message Threading** - Organized conversation threads
- **Quick Stats** - Community activity overview
- **Real-Time Messaging** - Instant communication capabilities

### 📱 **Modern User Interface**
- **Welcome Screen** - Personalized greeting with user information
- **Quick Actions** - Easy access to emergency services and features
- **Location Status** - Visual location permission and GPS status
- **Settings Panel** - Comprehensive app configuration
- **Call Logs** - Emergency call history with statistics

## 🛠️ Tech Stack

- **Frontend**: React Native 0.79.2 with Expo 53.0.9
- **Backend**: Supabase (PostgreSQL with PostGIS)
- **Navigation**: Expo Router with file-based routing
- **State Management**: Zustand
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Maps**: React Native Maps with location services
- **Authentication**: Supabase Auth with JWT
- **Real-time**: Supabase Realtime subscriptions

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (18.0.0 or higher)
- npm or yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)
- A Supabase account and project

## 🏗️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/trinatra.git
cd trinatra
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema located in `database/trinatra_schema.sql`:
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Paste and execute the contents of `database/trinatra_schema.sql`

### 5. Enable Required Extensions
In your Supabase SQL Editor, run:
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location data
CREATE EXTENSION IF NOT EXISTS "postgis";
```

### 6. Configure Row Level Security
The SQL schema includes comprehensive RLS policies. Ensure they're applied by running the full schema file.

## 🚀 Running the Application

### Development Server
```bash
npx expo start
```

### Platform-Specific Commands
```bash
# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios

# Run on Web
npx expo start --web
```

### Clear Cache (if needed)
```bash
npx expo start --clear
```

## 📱 App Structure

```
app/
├── (tabs)/                 # Main tab navigation
│   ├── index.tsx          # Home/Dashboard
│   ├── community.tsx      # Safety communities
│   ├── contacts.tsx       # Emergency contacts
│   ├── call-logs.tsx      # Call history
│   └── profile.tsx        # User profile
├── login.tsx              # Authentication
├── register.tsx           # User registration
├── emergency-access.tsx   # Emergency quick access
├── live-location.tsx      # Live location sharing
└── settings.tsx           # App settings

components/
├── AppHeader.tsx          # Main header component
└── TopHeader.tsx          # Secondary header

lib/
├── supabase.ts           # Supabase client configuration
├── firebase.ts           # Firebase services (optional)
└── polyfills.ts          # Node.js polyfills for React Native

store/
└── auth.ts               # Zustand auth store

types/
├── database.ts           # Database type definitions
└── supabase.ts           # Supabase-generated types
```

## 🗄️ Database Schema

### Main Tables
- **profiles** - User profile information
- **emergency_contacts** - Emergency contact lists
- **safety_groups** - Community safety groups
- **group_memberships** - User-group relationships
- **emergency_alerts** - Panic button alerts
- **live_locations** - Real-time location data
- **chat_messages** - Group communication
- **call_logs** - Emergency call history
- **safety_tips** - Educational content
- **user_settings** - User preferences

### Key Features
- PostGIS integration for location-based queries
- Row Level Security (RLS) for data protection
- Automatic triggers for timestamps
- Comprehensive indexing for performance

## 🔧 Configuration

### Metro Configuration
The app includes comprehensive Node.js polyfills in `metro.config.js` for:
- Crypto operations (`react-native-crypto`)
- Stream processing (`stream-browserify`) 
- Buffer handling (`@craftzdog/react-native-buffer`)
- URL parsing and HTTP requests

### Patches
The following packages have been patched for React Native compatibility:
- `stream-http+3.2.0.patch`
- `https-browserify+1.0.0.patch`
- `cipher-base+1.0.6.patch`
- `hash-base+3.0.5.patch`
- `pbkdf2+3.1.3.patch`

## 🔒 Security Features

### Authentication
- Supabase Auth with email/password
- JWT token management
- Secure session persistence

### Data Protection
- Row Level Security (RLS) on all tables
- User data isolation
- Location data encryption
- Emergency contact protection

### Privacy
- Granular location sharing controls
- Temporary location sharing with expiration
- Optional location data

## 🚨 Emergency Features

### Panic Button
- Instant emergency alert
- Automatic location sharing
- Contact notification system
- Integration with emergency services

### Live Location
- Real-time GPS tracking
- Temporary sharing with auto-expiration
- Trusted contact notification
- Group location sharing

### Emergency Contacts
- Multiple contact categories
- Primary contact designation
- Relationship tracking
- Quick dial functionality

## 🌐 API Integration

### Supabase APIs
- Authentication API
- Database API with RLS
- Real-time subscriptions
- Storage API (for avatars/images)

### Location Services
- React Native Geolocation
- Background location tracking
- Location accuracy optimization
- Privacy-compliant tracking

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# E2E tests (if configured)
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

## 📦 Building for Production

### Android
```bash
# Create production build
npx expo build:android

# Or with EAS Build
eas build --platform android
```

### iOS
```bash
# Create production build
npx expo build:ios

# Or with EAS Build
eas build --platform ios
```

## 🚀 Deployment

### Using EAS (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build for production
eas build --platform all

# Submit to app stores
eas submit --platform all
```

## 🔧 Troubleshooting

### Common Issues

1. **Metro Bundle Errors**
   ```bash
   npx expo start --clear
   rm -rf node_modules && npm install
   ```

2. **Node.js Module Errors**
   - All polyfills are pre-configured
   - Check `metro.config.js` for module resolution
   - Patches are applied automatically

3. **Supabase Connection Issues**
   - Verify `.env` file configuration
   - Check Supabase project status
   - Validate API keys

4. **Location Permission Issues**
   - Check device settings
   - Verify app permissions
   - Test on physical device

## 📚 Documentation

### API Documentation
- [Supabase API Docs](https://supabase.com/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)

### Additional Resources
- [PostGIS Documentation](https://postgis.net/documentation/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Zustand State Management](https://github.com/pmndrs/zustand)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Contact: [your-email@example.com]
- Documentation: [Link to detailed docs]

## 🙏 Acknowledgments

- Supabase team for the excellent backend platform
- Expo team for React Native development tools
- React Native community for continuous innovation
- All contributors and safety advocates

---

**⚠️ Important Safety Notice**: This app is designed to enhance personal safety but should not replace professional emergency services. Always contact local emergency services (911, 112, etc.) in life-threatening situations.
