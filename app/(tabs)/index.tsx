import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { useAuth } from '../../store/auth';

const { width, height } = Dimensions.get('window');

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
            Alert.alert('SOS Activated', 'Emergency contacts have been notified and emergency services are being called.');
          }
        }
      ]
    );
  };

  const quickActions = [
    {
      title: 'Call 911',
      icon: 'call',
      color: '#8B5CF6',
      onPress: () => Linking.openURL('tel:911')
    },
    {
      title: 'Share Location',
      icon: 'location',
      color: '#8B5CF6',
      onPress: () => router.push('/(tabs)/live-location')
    },
    {
      title: 'Community',
      icon: 'people',
      color: '#8B5CF6',
      onPress: () => router.push('/(tabs)/community')
    },
    {
      title: 'Contacts',
      icon: 'person-circle',
      color: '#8B5CF6',
      onPress: () => router.push('/(tabs)/contacts')
    }
  ];

  const emergencyNumbers = [
    { label: 'Police', number: '100', color: '#8B5CF6' },
    { label: 'Fire', number: '101', color: '#EF4444' },
    { label: 'Medical', number: '102', color: '#10B981' }
  ];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#8B5CF6', '#A855F7']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
      >
        {/* Header Section */}
        <View style={{ paddingTop: 50, paddingHorizontal: 24, paddingBottom: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <View>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
                Welcome Back
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
              </Text>
            </View>
            <TouchableOpacity style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20 }}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
            <Text style={{ flex: 1, color: '#9CA3AF', fontSize: 16 }}>Search</Text>
          </View>

          {/* Quick Action Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={action.onPress}
                style={{ 
                  width: 70, 
                  height: 70, 
                  borderRadius: 35, 
                  backgroundColor: 'white', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 5
                }}
              >
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Emergency Numbers */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            {emergencyNumbers.map((emergency, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(`tel:${emergency.number}`)}
                style={{ 
                  flex: 1, 
                  marginHorizontal: 5, 
                  backgroundColor: 'rgba(255,255,255,0.9)', 
                  borderRadius: 15, 
                  paddingVertical: 12, 
                  alignItems: 'center' 
                }}
              >
                <Text style={{ color: emergency.color, fontSize: 18, fontWeight: 'bold' }}>
                  {emergency.number}
                </Text>
                <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>
                  {emergency.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Main Content Card */}
        <View style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          borderTopLeftRadius: 30, 
          borderTopRightRadius: 30, 
          paddingTop: 30,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10
        }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Location Sharing Card */}
            <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
              <View style={{ 
                backgroundColor: '#F8FAFC', 
                borderRadius: 20, 
                padding: 20,
                borderWidth: 1,
                borderColor: '#E2E8F0'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                  <View style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 20, 
                    backgroundColor: '#8B5CF6', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: 12
                  }}>
                    <Ionicons name="location" size={20} color="white" />
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937' }}>
                    Live Location
                  </Text>
                </View>
                
                {/* Location Image Placeholder */}
                <View style={{ 
                  height: 120, 
                  backgroundColor: '#E5E7EB', 
                  borderRadius: 15, 
                  marginBottom: 15,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Ionicons name="map-outline" size={40} color="#9CA3AF" />
                  <Text style={{ color: '#6B7280', marginTop: 8 }}>Location Map</Text>
                </View>

                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/live-location')}
                  style={{ 
                    backgroundColor: '#8B5CF6', 
                    borderRadius: 12, 
                    paddingVertical: 12, 
                    alignItems: 'center' 
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                    Share Location
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* SOS Button - Large and Prominent */}
            <View style={{ paddingHorizontal: 24, marginBottom: 30 }}>
              <TouchableOpacity
                onPress={activateSOS}
                style={{ alignItems: 'center' }}
              >
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  style={{ 
                    width: 150, 
                    height: 150, 
                    borderRadius: 75, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    shadowColor: '#EF4444',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 15,
                    elevation: 10
                  }}
                >
                  <Text style={{ 
                    color: 'white', 
                    fontSize: 24, 
                    fontWeight: 'bold',
                    textAlign: 'center',
                    lineHeight: 28
                  }}>
                    SOS
                  </Text>
                  <Text style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: 12, 
                    marginTop: 4 
                  }}>
                    EMERGENCY
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Bottom Navigation Placeholder */}
        <View style={{ 
          backgroundColor: 'white', 
          paddingVertical: 20, 
          paddingHorizontal: 24,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity style={{ alignItems: 'center' }}>
              <View style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                backgroundColor: '#8B5CF6', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Ionicons name="home" size={20} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => router.push('/(tabs)/community')}>
              <View style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                backgroundColor: '#F3F4F6', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Ionicons name="people-outline" size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => router.push('/(tabs)/call-logs')}>
              <View style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                backgroundColor: '#F3F4F6', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Ionicons name="call-outline" size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => router.push('/(tabs)/profile')}>
              <View style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                backgroundColor: '#F3F4F6', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Ionicons name="person-outline" size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
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
