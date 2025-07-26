// Import polyfills first
import '../lib/polyfills';

import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../components/ThemeProvider';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';

// Ensure NativeWind styles are available globally
import '../global.css';

export default function RootLayout() {
  const { session, isLoading, initializeAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Initialize auth store
  useEffect(() => {
    initializeAuth();
  }, []);

  // Navigation logic
  useEffect(() => {
    if (isLoading) return; // Don't do anything while loading

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register'; // Check if on auth screens
    const inAppGroup = segments[0] === '(tabs)'; // Check if in the main app group
    const onSplash = segments[0] === 'splash'; // Check if on splash screen

    console.log("Auth Check - Session:", !!session, "Loading:", isLoading, "Segments:", segments);

    // Allow splash screen to handle its own navigation
    if (onSplash) return;

    if (!session && !inAuthGroup) {
      // If not logged in and not on an auth screen (like login/register)
      console.log("Redirecting to /login");
      router.replace('/login');
    } else if (session && !inAppGroup) {
      // If logged in and not in the main app group (e.g., perhaps landed on /login after login)
      console.log('Redirecting to /(tabs)/');
      router.replace('/(tabs)/' as any); // Type assertion to handle the route
    }
  }, [session, isLoading, segments]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        // The auth store will automatically update via its listener
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center bg-primary-dark">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Slot />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
