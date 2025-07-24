import React from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Text, Alert, Linking } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '../../store/auth';
import { supabase } from '../../lib/supabase';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { user } = useAuthStore();

  const handleSosPress = async () => {
    Alert.alert(
      "Emergency SOS",
      "This will call emergency services and notify your emergency contacts.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call Emergency", 
          style: "destructive",
          onPress: async () => {
            // Log the emergency call
            if (user) {
              await supabase.from('call_logs').insert({
                user_id: user.id,
                phone_number: '100',
                contact_name: 'Emergency - Police',
                call_type: 'outgoing',
                timestamp: new Date().toISOString(),
                duration: 0,
              });
            }
            
            // Call emergency services
            Linking.openURL('tel:100').catch(err => 
              console.error('Error calling emergency:', err)
            );
          }
        }
      ]
    );
  };

  return (
    <View className="flex-row bg-primary justify-around items-center h-20 pb-3 pt-2 px-2">
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Skip rendering the SOS button here, we'll add it separately
        if (route.name === 'placeholder') {
          return <View key={route.key} className="w-12 h-12" />;
        }

        let iconName: any = 'home';
        if (route.name === 'index') iconName = 'home';
        else if (route.name === 'contacts') iconName = 'people';
        else if (route.name === 'call-logs') iconName = 'call';
        else if (route.name === 'community') iconName = 'chatbubbles';
        else if (route.name === 'live-location') iconName = 'location';
        else if (route.name === 'profile') iconName = 'person';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className={`items-center justify-center p-2 rounded-lg ${
              isFocused ? 'bg-white bg-opacity-20' : ''
            }`}
          >
            <Ionicons 
              name={iconName} 
              size={24} 
              color={isFocused ? '#FFFFFF' : '#C084FC'} 
            />
            <Text className={`text-xs mt-1 ${
              isFocused ? 'text-white font-semibold' : 'text-purple-200'
            }`}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* SOS Button */}
      <TouchableOpacity
        onPress={handleSosPress}
        className="bg-red-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ 
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: 2 }, 
          shadowOpacity: 0.25, 
          shadowRadius: 3.84,
          elevation: 5 
        }}
      >
        <Text className="text-white font-bold text-xs">SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const { signOut } = useAuthStore();

  return (
    <Tabs 
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarLabel: 'Contacts',
        }}
      />
      <Tabs.Screen
        name="call-logs"
        options={{
          title: 'Calls',
          tabBarLabel: 'Calls',
        }}
      />
      <Tabs.Screen
        name="placeholder"
        options={{
          title: '',
          tabBarLabel: '',
        }}
      />
      <Tabs.Screen
        name="live-location"
        options={{
          title: 'Location',
          tabBarLabel: 'Location',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
