import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useColorScheme } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  const { isAuthenticated } = useAuthStore();
  const colorScheme = useColorScheme();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
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
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen 
            name="sos" 
            options={{ 
              presentation: "modal",
              animation: "fade",
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="safety-tips" 
            options={{ 
              presentation: "card",
              headerShown: true,
              headerTitle: "Safety Tips",
              headerTintColor: "#FF6B8B",
            }} 
          />
          <Stack.Screen 
            name="helplines" 
            options={{ 
              presentation: "card",
              headerShown: true,
              headerTitle: "Emergency Helplines",
              headerTintColor: "#FF6B8B",
            }} 
          />
          <Stack.Screen 
            name="evidence" 
            options={{ 
              presentation: "card",
              headerShown: true,
              headerTitle: "Evidence Collection",
              headerTintColor: "#FF6B8B",
            }} 
          />
          <Stack.Screen 
            name="about" 
            options={{ 
              presentation: "card",
              headerShown: true,
              headerTitle: "About SheSafe",
              headerTintColor: "#FF6B8B",
            }} 
          />
          <Stack.Screen 
            name="contact" 
            options={{ 
              presentation: "card",
              headerShown: true,
              headerTitle: "Contact Us",
              headerTintColor: "#FF6B8B",
            }} 
          />
        </>
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}