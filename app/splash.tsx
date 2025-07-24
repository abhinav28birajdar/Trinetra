import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '../store/auth';

export default function SplashScreen() {
  const { initializeAuth, session, isLoading } = useAuthStore();

  useEffect(() => {
    // Initialize auth when the app starts
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Navigate based on auth state after loading is complete
      const timer = setTimeout(() => {
        if (session) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      }, 2000); // Show splash for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [session, isLoading]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Trinatra</Text>
        <Text style={styles.subtitle}>Emergency & Safety App</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Connecting you to safety</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e40af',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#93c5fd',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  footerText: {
    color: '#93c5fd',
    fontSize: 14,
  },
});
