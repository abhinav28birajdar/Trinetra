import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import { AppStackParamList } from '../types/navigation';
// Import other full-screen modals or stacks if needed

const Stack = createStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      {/* Add other screens like CallingScreen here if they should be modal over tabs */}
      {/* <Stack.Screen name="GlobalCallingScreen" component={CallingScreen} options={{ presentation: 'modal' }} /> */}
    </Stack.Navigator>
  );
};
export default AppNavigator;