import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useAuthStore } from '../store/auth';

// Simple redirect component - no actual splash screen
export default function SplashRedirect() {
  const { session, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      // Immediately redirect based on auth state
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [session, isLoading]);

  // Return an empty view while redirecting
  return <View style={{ flex: 1 }} />;
}
