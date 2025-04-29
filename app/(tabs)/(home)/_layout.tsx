import { Stack } from 'expo-router';
import { colors } from '@/constants/Colors';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'SheSafe',
          headerTitleStyle: {
            color: colors.primary,
            fontWeight: 'bold',
            fontSize: 20,
          },
        }}
      />
    </Stack>
  );
}