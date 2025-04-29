import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.white }
      }}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});