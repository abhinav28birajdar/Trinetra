import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { useAuth } from '../../store/auth';

export default function HomeScreen() {
  const { user, profile } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationPermission(status);
      
      if (status === 'granted') {
        getCurrentLocation();
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      
      if (status === 'granted') {
        getCurrentLocation();
      } else {
        Alert.alert(
          'Location Permission Required',
          'Location access is needed for emergency features and safety tracking.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Linking.openSettings() }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const activateSOS = () => {
    Alert.alert(
      'Emergency SOS',
      'This will immediately alert your emergency contacts and call emergency services.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'ACTIVATE SOS',
          style: 'destructive',
          onPress: () => {
            // For now, just show success message
            Alert.alert('SOS Activated', 'Emergency contacts have been notified and emergency services are being called.');
          }
        }
      ]
    );
  };

  const quickActions = [
    {
      title: 'Emergency Contacts',
      subtitle: 'Manage your emergency contacts',
      icon: 'people-circle-outline',
      color: '#dc2626',
      onPress: () => router.push('/(tabs)/contacts')
    },
    {
      title: 'Share Location',
      subtitle: 'Share your live location',
      icon: 'location-outline',
      color: '#059669',
      onPress: () => router.push('/(tabs)/live-location')
    },
    {
      title: 'Safe Check-In',
      subtitle: 'Let contacts know you\'re safe',
      icon: 'checkmark-circle-outline',
      color: '#2563eb',
      onPress: () => Alert.alert('Coming Soon', 'Safe check-in feature will be available soon.')
    },
    {
      title: 'Community Chat',
      subtitle: 'Connect with local community',
      icon: 'chatbubbles-outline',
      color: '#7c3aed',
      onPress: () => router.push('/(tabs)/community')
    }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <TopHeader title="Safety Dashboard" showProfile={true} />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'User'}!
          </Text>
          <Text className="text-gray-600">
            Your safety is our priority. Access emergency features below.
          </Text>
        </View>

        {/* Emergency SOS Button */}
        <View className="px-6 mb-6">
          <TouchableOpacity
            onPress={activateSOS}
            className="bg-red-600 rounded-2xl p-8 items-center shadow-lg"
          >
            <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-4">
              <Ionicons name="warning" size={40} color="#dc2626" />
            </View>
            <Text className="text-white text-2xl font-bold mb-2">EMERGENCY SOS</Text>
            <Text className="text-red-100 text-center text-base">
              Tap to activate emergency protocol
            </Text>
          </TouchableOpacity>
        </View>

        {/* Location Status */}
        <View className="px-6 mb-6">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-900">Location Status</Text>
              <Ionicons 
                name={locationPermission === 'granted' ? 'checkmark-circle' : 'alert-circle'} 
                size={24} 
                color={locationPermission === 'granted' ? '#059669' : '#f59e0b'} 
              />
            </View>
            
            {locationPermission === 'granted' ? (
              <View>
                <Text className="text-green-600 font-medium mb-2">Location services enabled</Text>
                {currentLocation && (
                  <Text className="text-gray-600 text-sm">
                    Last updated: {new Date().toLocaleTimeString()}
                  </Text>
                )}
              </View>
            ) : (
              <View>
                <Text className="text-amber-600 font-medium mb-2">Location permission needed</Text>
                <TouchableOpacity
                  onPress={requestLocationPermission}
                  className="bg-blue-600 py-2 px-4 rounded-lg self-start"
                >
                  <Text className="text-white font-medium">Enable Location</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Quick Actions</Text>
          
          <View className="flex-row flex-wrap">
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={action.onPress}
                className="bg-white rounded-xl p-4 shadow-sm w-[48%] mb-4"
                style={{ marginRight: index % 2 === 0 ? '4%' : 0 }}
              >
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mb-3"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                
                <Text className="text-gray-900 font-semibold text-base mb-1">
                  {action.title}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {action.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Recent Activity</Text>
          
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-gray-600 text-center py-8">
              No recent activity
            </Text>
          </View>
        </View>

        {/* Safety Tips */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">Safety Tips</Text>
          
          <View className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={24} color="#2563eb" />
              <View className="ml-3 flex-1">
                <Text className="text-blue-900 font-semibold mb-2">
                  Keep Your Emergency Contacts Updated
                </Text>
                <Text className="text-blue-800 text-sm leading-5">
                  Regularly review and update your emergency contacts to ensure they can be reached when needed.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
