import React from "react";
import { Tabs, router } from "expo-router"; // Import router
import { Home, Users, BookOpen, User } from "lucide-react-native"; // Import Lucide icons
import Colors from "@/constants/colors"; // Adjust path if needed
import { View, StyleSheet, Platform } from "react-native";
import { SOSButton } from "@/components/SOSButton"; // Adjust path if needed
import { useSOSStore } from "@/store/sos-store"; // Adjust path if needed

// IMPORTANT: lucide-react-native requires react-native-svg
// Make sure you have run: npx expo install react-native-svg

export default function TabLayout() {
  // Get the function from your Zustand store (or context, etc.)
  const { initiateSOS } = useSOSStore();

  // Define the handler for the SOS button press
  const handleSOSPress = async () => {
    try {
      // You might want to perform the SOS action first
      await initiateSOS();
      // Then navigate to the dedicated SOS screen
      router.push("/sos"); // Ensure you have an app/sos.tsx file for this route
    } catch (error) {
      console.error("Error initiating SOS:", error);
      // Handle error appropriately (e.g., show a message)
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray[500],
        tabBarStyle: {
          height: 60,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,
          backgroundColor: Colors.white,
          borderTopWidth: StyleSheet.hairlineWidth, // Use hairline width for subtle border
          borderTopColor: Colors.gray[200],
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTitleStyle: {
          color: Colors.text, // Use your text color constant
          fontWeight: "600",
        },
        headerShadowVisible: false, // Hide the header shadow line
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        // Matches the '(home)' directory group if you have app/(tabs)/(home)/index.tsx etc.
        // If your home screen is app/(tabs)/index.tsx, change name to "index"
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />, // Use size prop from tab bar
          headerShown: false, // Often hide header for the main tab group screen
        }}
      />

      {/* Contacts Tab */}
      <Tabs.Screen
        // This name MUST match your file structure.
        // Since you deleted app/(tabs)/contacts.tsx and kept app/(tabs)/contacts/index.tsx,
        // the name should be "contacts/index".
        name="contacts/index"
        options={{
          title: "Contacts",
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
          headerTitle: "Emergency Contacts", // Custom header title for this screen
          // headerShown: true, // Ensure header is shown if needed
        }}
      />

      {/* SOS Tab - Custom Button */}
      <Tabs.Screen
        // This name should correspond to a placeholder file like app/(tabs)/sos-tab.tsx
        // This file can just export a simple empty component like:
        // export default function SosTabScreen() { return null; }
        name="sos-tab"
        options={{
          title: "", // No title for the SOS button tab
          tabBarButton: () => (
            <View style={styles.sosButtonContainer}>
              {/* Ensure SOSButton is correctly implemented and handles onPress */}
              <SOSButton onPress={handleSOSPress} />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // Prevent default navigation behavior (going to the sos-tab screen)
            e.preventDefault();
            // Trigger our custom SOS handler instead
            handleSOSPress();
          },
        }}
      />

      {/* Resources Tab */}
      <Tabs.Screen
        // Assumes you have a file like app/(tabs)/resources.tsx or app/(tabs)/resources/index.tsx
        // If it's index.tsx, use name="resources/index"
        name="resources"
        options={{
          title: "Resources",
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
          headerTitle: "Safety Resources",
          // headerShown: true,
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        // Assumes you have a file like app/(tabs)/profile.tsx or app/(tabs)/profile/index.tsx
        // If it's index.tsx, use name="profile/index"
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: "My Profile",
          // headerShown: true,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  sosButtonContainer: {
    // Style to position the SOS button, often raised
    top: -15, // Adjust as needed based on your SOSButton size and desired look
    justifyContent: "center",
    alignItems: "center",
    // Add shadow or other styles if desired
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});