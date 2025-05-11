import { Stack } from "expo-router";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function AppLayout() {
  const { user, session } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    
    if (!user && !session && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/(auth)/login");
    }
  }, [user, session, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="sos" options={{ presentation: 'modal' }} />
      <Stack.Screen name="call" options={{ presentation: 'modal' }} />
      <Stack.Screen name="location-share" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="add-contact" options={{ presentation: 'modal' }} />
      <Stack.Screen name="chat" options={{ presentation: 'card' }} />
    </Stack>
  );
}