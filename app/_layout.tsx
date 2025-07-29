import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../components/ThemeProvider';
import '../global.css';
import { useAuthStore } from '../store/auth';

// Immediately hide the splash screen
SplashScreen.hideAsync().catch(() => {
  // Ignore errors
  console.log('Failed to hide splash screen');
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session, isLoading } = useAuthStore();
  const segments = useSegments();
  const hasNavigated = useRef(false);
  const initialNavigation = useRef(false);
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Initialize auth only once when component mounts
  useEffect(() => {
    const initAuth = async () => {
      const { initializeAuth } = useAuthStore.getState();
      initializeAuth();
    };
    initAuth();
  }, []); // Empty dependency array - run only once

  // Reset navigation flag when changing routes
  useEffect(() => {
    // Reset the navigation flag for future navigations
    return () => {
      initialNavigation.current = true;
    };
  }, [segments]);

  // Handle navigation based on auth state - with protection against infinite redirects
  useEffect(() => {
    // Only run navigation if auth is loaded and we haven't navigated yet
    if (!isLoading && !initialNavigation.current) {
      initialNavigation.current = true; // Mark that we've done initial navigation
      
      const currentRoute = segments[0];
      const isAuthRoute = currentRoute === 'login' || 
                          currentRoute === 'register' || 
                          currentRoute === 'welcome' || 
                          currentRoute === 'forgot-password';
      
      if (session && !currentRoute?.includes('tabs')) {
        console.log("User is authenticated, redirecting to home");
        router.replace('/(tabs)');
      } else if (!session && !isAuthRoute) {
        console.log("User is not authenticated, redirecting to login");
        router.replace('/login');
      }
    }
  }, [session, isLoading, segments]);

  if (!loaded || isLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="emergency-call" options={{ headerShown: false }} />
            <Stack.Screen name="emergency-access" options={{ headerShown: false }} />
            <Stack.Screen name="sos" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
            <Stack.Screen name="safety-tips" options={{ headerShown: false }} />
          </Stack>
        </NavigationThemeProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
