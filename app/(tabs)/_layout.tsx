import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Alert, Dimensions, Linking, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';

const { width } = Dimensions.get('window');

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
                started_at: new Date().toISOString(),
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

  // Define the tab order: Home → Contacts → SOS → Location → Community
  const tabOrder = ['index', 'contacts', 'sos', 'live-location', 'community'];
  const allRoutes = state.routes;
  const tabWidth = width / 5; // 5 equal tabs including SOS

  return (
    <SafeAreaView style={{ backgroundColor: '#7C3AED' }}>
      <View style={{
        flexDirection: 'row',
        backgroundColor: '#7C3AED',
        alignItems: 'center',
        height: Platform.OS === 'ios' ? 80 : 70,
        paddingHorizontal: 0,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
      }}>
        {/* Render tabs in proper order with SOS in the middle */}
        {tabOrder.map((routeName: string, index: number) => {
          if (routeName === 'sos') {
            // SOS Button in the middle position
            return (
              <TouchableOpacity
                key="sos"
                onPress={handleSosPress}
                style={{
                  width: tabWidth,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 8,
                }}
              >
                <View style={{
                  backgroundColor: '#EF4444',
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 6,
                }}>
                  <Ionicons name="alert" size={24} color="white" />
                </View>
                <Text style={{
                  fontSize: 10,
                  marginTop: 4,
                  textAlign: 'center',
                  color: '#FFFFFF',
                  fontWeight: '600',
                }}>
                  SOS
                </Text>
              </TouchableOpacity>
            );
          }

          // Find the actual route for this tab
          const route = allRoutes.find((r: any) => r.name === routeName);
          if (!route) return null;

          const { options } = descriptors[route.key];
          const isFocused = state.routes.findIndex((r: any) => r.name === routeName) === state.index;

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

          let iconName: any = 'home';
          let displayLabel = routeName;
          
          if (routeName === 'index') {
            iconName = 'home';
            displayLabel = 'Home';
          } else if (routeName === 'contacts') {
            iconName = 'people';
            displayLabel = 'Contacts';
          } else if (routeName === 'community') {
            iconName = 'chatbubbles';
            displayLabel = 'Community';
          } else if (routeName === 'live-location') {
            iconName = 'location';
            displayLabel = 'Location';
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={{
                width: tabWidth,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 8,
                paddingHorizontal: 4,
                borderRadius: 12,
                backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              }}
            >
              <Ionicons 
                name={iconName} 
                size={22} 
                color={isFocused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'} 
              />
              <Text style={{
                fontSize: 10,
                marginTop: 4,
                textAlign: 'center',
                color: isFocused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                fontWeight: isFocused ? '600' : '400',
              }}>
                {displayLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function TabLayout() {
  const { signOut } = useAuthStore();

  return (
    <Tabs 
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ 
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
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
        name="live-location"
        options={{
          title: 'Location',
          tabBarLabel: 'Location',
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarLabel: 'Community',
        }}
      />
    </Tabs>
  );
}
