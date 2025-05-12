import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Main Bottom Tabs
export type MainBottomTabParamList = {
  HomeTab: undefined; // Points to HomeStack
  LocationMapTab: undefined;
  SOSCenterTab: undefined;
  CommunityTab: undefined;
  ProfileTab: undefined; // Points to ProfileStack
};

// Home Stack (nested in HomeTab)
export type HomeStackParamList = {
  HomeScreen: undefined;
  ContactList: undefined;
  AddEditContact: { contactId?: string }; // Optional for editing
  Calling: { contactName: string; phoneNumber: string };
  LocationShare: undefined;
  Settings: undefined;
};

// Profile Stack (nested in ProfileTab)
export type ProfileStackParamList = {
  ProfileScreen: undefined;
  // Potentially other profile related screens
};

// App Stack (Combines Bottom Tabs and other modal/full-screen stacks)
export type AppStackParamList = {
  MainTabs: undefined; // For BottomTabNavigator
  // Add other top-level screens if any, e.g., a full-screen modal
  // CallingScreen could also be here if you want it full screen over tabs
};

// Props for screens
export type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;
export type HomeScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeStackParamList, 'HomeScreen'>,
  BottomTabNavigationProp<MainBottomTabParamList>
>;
export type CallingScreenRouteProp = RouteProp<HomeStackParamList, 'Calling'>;
// ... other screen props