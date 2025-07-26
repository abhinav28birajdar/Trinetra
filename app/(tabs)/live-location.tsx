import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LiveLocationScreen() {
  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
  const [sharingDuration, setSharingDuration] = useState(60); // minutes

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
        accuracy: Location.Accuracy.High,
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
        Alert.alert('Permission Denied', 'Location access is required for sharing your location.');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const toggleLocationSharing = () => {
    if (locationPermission !== 'granted') {
      requestLocationPermission();
      return;
    }

    if (!isSharing) {
      Alert.alert(
        'Share Location',
        `Share your live location for ${sharingDuration} minutes?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Start Sharing',
            onPress: () => {
              setIsSharing(true);
              getCurrentLocation();
              Alert.alert('Location Sharing Started', 'Your location is being shared with emergency contacts.');
            }
          }
        ]
      );
    } else {
      setIsSharing(false);
      Alert.alert('Location Sharing Stopped', 'You are no longer sharing your location.');
    }
  };

  const durations = [15, 30, 60, 120, 240]; // minutes
  const emergencyContacts = [
    { name: 'Police', color: '#3B82F6', action: 'Alert' },
    { name: 'Father', color: '#EF4444', action: 'Share' },
    { name: 'Mother', color: '#10B981', action: 'Share' },
    { name: 'Women Safety', color: '#8B5CF6', action: 'Share' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#8B5CF6', '#A855F7']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
      >
        {/* Header */}
        <View style={{ paddingTop: 50, paddingHorizontal: 24, paddingBottom: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
              Location Share
            </Text>
            
            <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center' }}>
            Share your location with trusted contacts
          </Text>
        </View>

        {/* Main Content */}
        <View style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          borderTopLeftRadius: 30, 
          borderTopRightRadius: 30,
          paddingTop: 30
        }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Location Map Preview */}
            <View style={{ paddingHorizontal: 24, marginBottom: 30 }}>
              <View style={{ 
                height: 200, 
                backgroundColor: '#F1F5F9', 
                borderRadius: 20, 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: 20,
                borderWidth: 2,
                borderColor: isSharing ? '#10B981' : '#E2E8F0'
              }}>
                <View style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: 40, 
                  backgroundColor: isSharing ? '#10B981' : '#8B5CF6', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: 12
                }}>
                  <Ionicons name="location" size={40} color="white" />
                </View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 }}>
                  {isSharing ? 'Live Location Active' : 'Location Ready to Share'}
                </Text>
                {currentLocation && (
                  <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
                    Lat: {currentLocation.coords.latitude.toFixed(6)}{'\n'}
                    Lng: {currentLocation.coords.longitude.toFixed(6)}
                  </Text>
                )}
              </View>

              {/* Sharing Toggle */}
              <View style={{ 
                backgroundColor: '#F8FAFC', 
                borderRadius: 16, 
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 }}>
                    Share Live Location
                  </Text>
                  <Text style={{ fontSize: 14, color: '#6B7280' }}>
                    {isSharing ? `Sharing for ${sharingDuration} minutes` : 'Enable location sharing'}
                  </Text>
                </View>
                <Switch
                  value={isSharing}
                  onValueChange={toggleLocationSharing}
                  trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
                  thumbColor={isSharing ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
            </View>

            {/* Duration Selection */}
            {!isSharing && (
              <View style={{ paddingHorizontal: 24, marginBottom: 30 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 }}>
                  Sharing Duration
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {durations.map((duration) => (
                    <TouchableOpacity
                      key={duration}
                      onPress={() => setSharingDuration(duration)}
                      style={{ 
                        width: '18%',
                        aspectRatio: 1,
                        borderRadius: 12,
                        backgroundColor: sharingDuration === duration ? '#8B5CF6' : '#F1F5F9',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 12
                      }}
                    >
                      <Text style={{ 
                        fontSize: 14, 
                        fontWeight: 'bold', 
                        color: sharingDuration === duration ? 'white' : '#6B7280',
                        textAlign: 'center' 
                      }}>
                        {duration}m
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Emergency Contacts */}
            <View style={{ paddingHorizontal: 24, marginBottom: 30 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 }}>
                Share With
              </Text>
              
              {emergencyContacts.map((contact, index) => (
                <View 
                  key={index}
                  style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    backgroundColor: '#F8FAFC', 
                    padding: 16, 
                    borderRadius: 12,
                    marginBottom: 12
                  }}
                >
                  <View style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 20, 
                    backgroundColor: contact.color, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: 16
                  }}>
                    <Ionicons name="person" size={20} color="white" />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1F2937' }}>
                      {contact.name}
                    </Text>
                  </View>

                  <TouchableOpacity style={{ 
                    backgroundColor: contact.color, 
                    paddingHorizontal: 16, 
                    paddingVertical: 8, 
                    borderRadius: 20 
                  }}>
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                      {contact.action}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Quick Actions */}
            <View style={{ paddingHorizontal: 24, marginBottom: 30 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 }}>
                Quick Actions
              </Text>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ 
                  flex: 1, 
                  backgroundColor: '#FEE2E2', 
                  borderRadius: 12, 
                  padding: 16, 
                  alignItems: 'center',
                  marginRight: 8
                }}>
                  <Ionicons name="warning" size={24} color="#DC2626" style={{ marginBottom: 8 }} />
                  <Text style={{ color: '#DC2626', fontSize: 14, fontWeight: '600' }}>
                    Emergency Alert
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ 
                  flex: 1, 
                  backgroundColor: '#DBEAFE', 
                  borderRadius: 12, 
                  padding: 16, 
                  alignItems: 'center',
                  marginHorizontal: 4
                }}>
                  <Ionicons name="call" size={24} color="#2563EB" style={{ marginBottom: 8 }} />
                  <Text style={{ color: '#2563EB', fontSize: 14, fontWeight: '600' }}>
                    Call Police
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ 
                  flex: 1, 
                  backgroundColor: '#D1FAE5', 
                  borderRadius: 12, 
                  padding: 16, 
                  alignItems: 'center',
                  marginLeft: 8
                }}>
                  <Ionicons name="checkmark-circle" size={24} color="#059669" style={{ marginBottom: 8 }} />
                  <Text style={{ color: '#059669', fontSize: 14, fontWeight: '600' }}>
                    I'm Safe
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
}
