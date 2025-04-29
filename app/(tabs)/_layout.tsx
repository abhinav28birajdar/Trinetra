import React from "react";
import { Tabs } from "expo-router";
import { Home, Users, BookOpen, User } from "lucide-react-native";
import Colors from "@/constants/colors";
import { View, StyleSheet, Platform } from "react-native";
import { SOSButton } from "@/components/SOSButton";
import { useSOSStore } from "@/store/sos-store";
import { router } from "expo-router";

export default function TabLayout() {
  const { initiateSOS } = useSOSStore();
  
  const handleSOSPress = async () => {
    await initiateSOS();
    router.push("/sos");
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
          color: Colors.text,
          fontWeight: "600",
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="contacts"
        options={{
          title: "Contacts",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          headerTitle: "Emergency Contacts",
        }}
      />
      
      <Tabs.Screen
        name="sos-tab"
        options={{
          title: "",
          tabBarButton: () => (
            <View style={styles.sosButtonContainer}>
              <SOSButton onPress={handleSOSPress} />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // Prevent default navigation
            e.preventDefault();
            handleSOSPress();
          },
        }}
      />
      
      <Tabs.Screen
        name="resources"
        options={{
          title: "Resources",
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
          headerTitle: "Safety Resources",
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
          headerTitle: "My Profile",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  sosButtonContainer: {
    top: -15,
    justifyContent: "center",
    alignItems: "center",
  },
});