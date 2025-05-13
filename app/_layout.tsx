import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { ErrorBoundary } from "./error-boundary";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
};

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
  // Important: We're not conditionally rendering routes based on authentication
  // Instead, we're including all routes and handling redirects at the page level
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      {/* Include all routes unconditionally */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ presentation: 'card' }} />
      <Stack.Screen name="contacts" options={{ presentation: 'card' }} />
      <Stack.Screen name="location-share" options={{ presentation: 'card' }} />
      <Stack.Screen name="sos" options={{ presentation: 'card' }} />
      <Stack.Screen name="community" options={{ presentation: 'card' }} />
      <Stack.Screen name="profile" options={{ presentation: 'card' }} />
      <Stack.Screen name="call" options={{ presentation: 'fullScreenModal' }} />
    </Stack>
  );
}