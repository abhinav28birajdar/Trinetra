# 👩‍🦰 Trinetra – Women Safety App

<div align="center">
  <img src="./assets/images/icon.png" alt="Trinetra Logo" width="150" />
  <h3>Empowering Women with Real-Time Safety Tools 🚨</h3>
  <p>A React Native + Expo application for SOS alerts, live location sharing, and community-driven safety.</p>

  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=black" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
</div>

---


[https://github.com/user-attachments/assets/424ac820-0f88-475b-a1e2-bfb73653fd86](https://github.com/user-attachments/assets/81078555-2f8d-4ff7-9d8a-9fb54fd2e5dd)


---

## 📖 Overview

**Trinetra** is a **comprehensive personal safety application** built with React Native and Expo. It is specifically designed as a **women’s safety and emergency response app** that empowers users to **act quickly in unsafe situations**. It provides peace of mind and critical safety tools when you need them most, combining **SOS alerts, live location sharing, trusted contacts**, and a **community page** to enhance safety and awareness.

---

## 🌟 Key Features

- **🚨 Emergency SOS**: One-tap alert with automatic live location sharing and initiation of a call to emergency contacts.
- **📡 Live Location Tracking**: Share your real-time location with trusted emergency contacts using background location capabilities.
- **👭 Safety Network**: Build and manage your personal safety network of trusted contacts.
- **📞 Emergency History**: Comprehensive record of all SOS calls and location alerts.
- **👤 Safety Profiles**: Store critical medical and personal information for quick access by emergency responders.
- **📶 Offline Capability**: Core features, including SOS and safety alerts, work even with limited or no internet connectivity.
- **🌐 Community Page**: Connect with local users for:
    - Sharing safety tips & verified alerts.
    - Posting warnings about unsafe areas.
    - Engaging in discussions with the safety community.

---

## 🧰 Tech Stack

- **Frontend**: React Native, Expo, React Navigation v7
- **UI/UX**: NativeWind (Tailwind CSS for React Native), Expo-Blur
- **Backend**: Supabase (Authentication, Database, Storage, Realtime)
- **Database**: PostgreSQL (via Supabase) with **Row Level Security (RLS)**
- **State Management**: Zustand for global state management
- **Location Services**: Expo Location (with background tracking)
- **Networking**: NetInfo for connectivity monitoring and offline support
- **Security**: Environment variable protection, SQL injection prevention

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- A **Supabase account** with a project set up

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


