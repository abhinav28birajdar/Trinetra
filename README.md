# Trinatra Safety App

<div align="center">
  <img src="./assets/images/icon.png" alt="Trinatra Logo" width="150" />

  <!-- Tech Stack Badges -->
  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=black" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
</div>

Trinatra is a comprehensive personal safety application built with React Native and Expo that empowers users to stay safe in emergency situations. With features like one-touch emergency calling, real-time location sharing, and trusted contact management, Trinatra provides peace of mind and critical safety tools when you need them most.

```


```
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

<div align="center">
  <p>Built with ❤️ for safety and peace of mind</p>
  <p>© 2024 Trinatra Safety App</p>


