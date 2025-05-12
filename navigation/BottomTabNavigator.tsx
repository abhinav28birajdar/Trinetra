import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Example icons
import { MainBottomTabParamList, HomeStackParamList, ProfileStackParamList } from '../types/navigation';

import HomeScreen from '../screens/Main/HomeScreen';
import LocationMapScreen from '../screens/Main/LocationMapScreen';
import SOSCenterScreen from '../screens/Main/SOSCenterScreen';
import CommunityScreen from '../screens/Main/CommunityScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';

// Stacks for tabs that need internal navigation
const HomeNavStack = createStackNavigator<HomeStackParamList>();
const ProfileNavStack = createStackNavigator<ProfileStackParamList>();

function HomeStackNavigator() {
  // Import other screens for Home stack here
  const SettingsScreen = require('../screens/Main/SettingsScreen').default;
  const ContactListScreen = require('../screens/Main/ContactListScreen').default;
  const AddEditContactScreen = require('../screens/Main/AddEditContactScreen').default;
  const CallingScreen = require('../screens/Main/CallingScreen').default;
  const LocationShareScreen = require('../screens/Main/LocationShareScreen').default;

  return (
    <HomeNavStack.Navigator screenOptions={{ headerShown: false /* Manage header in screens */ }}>
      <HomeNavStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeNavStack.Screen name="Settings" component={SettingsScreen} />
      <HomeNavStack.Screen name="ContactList" component={ContactListScreen} />
      <HomeNavStack.Screen name="AddEditContact" component={AddEditContactScreen} />
      <HomeNavStack.Screen name="Calling" component={CallingScreen} />
      <HomeNavStack.Screen name="LocationShare" component={LocationShareScreen} />
    </HomeNavStack.Navigator>
  );
}

function ProfileStackNavigator() {
    return (
        <ProfileNavStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileNavStack.Screen name="ProfileScreen" component={ProfileScreen} />
        </ProfileNavStack.Navigator>
    )
}


const Tab = createBottomTabNavigator<MainBottomTabParamList>();

// Custom SOS Button
const CustomSOSButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-primary w-16 h-16 rounded-full justify-center items-center -mt-8 border-4 border-white shadow-lg"
  >
    <Text className="text-white font-bold text-lg">SOS</Text>
  </TouchableOpacity>
);

const BottomTabNavigator = () => {
  const navigation = useNavigation<StackNavigationProp<any>>(); // For SOS button action

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4A00A8', // primary
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: 'white', borderTopWidth: 0, height: 60, paddingBottom: 5 }, // Adjust style
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'LocationMapTab') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'CommunityTab') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'ProfileTab') iconName = focused ? 'person-circle' : 'person-circle-outline';
          else return null; // For SOS
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="LocationMapTab" component={LocationMapScreen} options={{ tabBarLabel: 'Location' }} />
      <Tab.Screen
        name="SOSCenterTab"
        component={SOSCenterScreen} // This screen will be navigated to
        options={{
          tabBarLabel: () => null, // No label for SOS
          tabBarButton: (props) => (
            <CustomSOSButton onPress={() => navigation.navigate('MainTabs', { screen: 'SOSCenterTab' })} />
          ),
        }}
      />
      <Tab.Screen name="CommunityTab" component={CommunityScreen} options={{ tabBarLabel: 'Community' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};
export default BottomTabNavigator;