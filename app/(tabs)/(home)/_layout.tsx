import { Stack } from "expo-router";
import Colors from "@/constants/colors";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
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
      <Stack.Screen
        name="index"
        options={{
          title: "SheSafe",
          headerTitleStyle: {
            color: Colors.primary,
            fontWeight: "bold",
            fontSize: 22,
          },
        }}
      />
    </Stack>
  );
}