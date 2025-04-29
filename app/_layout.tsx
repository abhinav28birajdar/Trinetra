import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { useAuthStore } from "@/store/auth-store";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Fix: Compare with just "(auth)" instead of "./app/(auth)"
    const inAuthGroup = segments[0] === "(auth)";
    
    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page if not authenticated
      router.replace("./(auth)/sign-in");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to the home page if authenticated
      router.replace("./(tabs)");
    }
  }, [isAuthenticated, segments, router]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="sos" 
        options={{ 
          presentation: "modal",
          title: "SOS Alert",
          headerStyle: {
            backgroundColor: "#FF3B30",
          },
          headerTintColor: "#FFFFFF",
        }} 
      />
      <Stack.Screen 
        name="safety-tips" 
        options={{ 
          title: "Safety Tips",
          headerTintColor: "#FF6B8B",
        }} 
      />
      <Stack.Screen 
        name="helplines" 
        options={{ 
          title: "Emergency Helplines",
          headerTintColor: "#FF6B8B",
        }} 
      />
      <Stack.Screen 
        name="evidence" 
        options={{ 
          title: "Capture Evidence",
          headerTintColor: "#FF6B8B",
        }} 
      />
      <Stack.Screen 
        name="about" 
        options={{ 
          title: "About SheSafe",
          headerTintColor: "#FF6B8B",
        }} 
      />
      <Stack.Screen 
        name="contact" 
        options={{ 
          title: "Contact Us",
          headerTintColor: "#FF6B8B",
        }} 
      />
    </Stack>
  );
}