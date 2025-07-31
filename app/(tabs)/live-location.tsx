import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';

const { width, height } = Dimensions.get('window');

interface Contact {
  id: string;
  name: string;
  phone: string;
  color: string;
  relationship: string;
  is_emergency: boolean;
}

export default function LiveLocationScreen() {
  const { user, profile } = useAuthStore();
  const [isSharing, setIsSharing] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('1h');
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  useEffect(() => {
    getCurrentLocation();
    fetchUserContacts();
  }, []);

  // Fetch user's saved contacts from the database
  const fetchUserContacts = async () => {
    if (!user) return;
    
    try {
      setIsLoadingContacts(true);
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
        
      if (error) {
        console.error('Error fetching contacts:', error);
        Alert.alert('Error', 'Failed to load your contacts');
      } else {
        const formattedContacts = data.map(contact => ({
          id: contact.id,
          name: contact.name,
          phone: contact.phone,
          relationship: contact.relationship || '',
          color: contact.avatar_color || '#' + Math.floor(Math.random()*16777215).toString(16),
          is_emergency: contact.is_primary || contact.is_emergency_service
        }));
        setContacts(formattedContacts);
      }
    } catch (err) {
      console.error('Unexpected error fetching contacts:', err);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const durations = [
    { id: '15m', label: '15 Minutes', value: '15m', description: 'Quick check-in' },
    { id: '30m', label: '30 Minutes', value: '30m', description: 'Short duration' },
    { id: '1h', label: '1 Hour', value: '1h', description: 'Standard sharing' },
    { id: '2h', label: '2 Hours', value: '2h', description: 'Extended time' },
    { id: 'continuous', label: 'Continuous', value: 'continuous', description: 'Until stopped' },
  ];

  const sendLocationMessage = async () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Unable to get current location');
      return;
    }

    if (selectedContacts.length === 0) {
      Alert.alert('Select Contacts', 'Please select at least one contact to share your location with.');
      return;
    }

    try {
      // Save location share to database
      if (user) {
        const { data, error } = await supabase
          .from('location_shares')
          .insert({
            user_id: user.id,
            session_name: 'Manual Share',
            shared_with: selectedContacts,
            duration_minutes: selectedDuration === 'continuous' ? null : parseInt(selectedDuration.replace('m', '')) * 60,
            is_active: true
          })
          .select();

        if (error) {
          console.error('Error saving location share:', error);
          Alert.alert('Error', 'Failed to save location share');
          return;
        }

        // Also save the current location point
        const { error: pointError } = await supabase
          .from('location_points')
          .insert({
            location: `POINT(${currentLocation.coords.longitude} ${currentLocation.coords.latitude})`,
            accuracy: currentLocation.coords.accuracy,
            altitude: currentLocation.coords.altitude,
            speed: currentLocation.coords.speed,
            heading: currentLocation.coords.heading,
            battery_level: 100, // Mock battery level
          });

        if (pointError) {
          console.error('Error saving location point:', pointError);
        }
      }

      const locationMessage = `📍 My current location:
Latitude: ${currentLocation.coords.latitude.toFixed(6)}
Longitude: ${currentLocation.coords.longitude.toFixed(6)}
Address: ${currentAddress || 'Address not available'}

Shared at: ${new Date().toLocaleString()}`;
      
      // In a real app, this would send the message to the selected contacts
      Alert.alert('Success', 'Location shared successfully with selected contacts!');
      setIsSharing(true);
    } catch (error) {
      console.error('Error in sendLocationMessage:', error);
      Alert.alert('Error', 'Failed to share location');
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to share your location.');
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation(location);
      
      // Get address from coordinates
      try {
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        if (address && address.length > 0) {
          const addr = address[0];
          const formattedAddress = [
            addr.name,
            addr.street,
            addr.city,
            addr.region,
            addr.country
          ].filter(Boolean).join(', ');
          setCurrentAddress(formattedAddress || 'Address not available');
        }
      } catch (addressError) {
        console.error('Error getting address:', addressError);
        setCurrentAddress('Address not available');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to get your current location.');
    }
  };

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const stopLocationSharing = async () => {
    if (user) {
      try {
        // Update all active location shares to inactive
        const { error } = await supabase
          .from('location_shares')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (error) {
          console.error('Error stopping location sharing:', error);
          Alert.alert('Error', 'Failed to stop location sharing');
          return;
        }
      } catch (error) {
        console.error('Error in stopLocationSharing:', error);
      }
    }
    
    setIsSharing(false);
    setSelectedContacts([]);
    Alert.alert('Location Sharing Stopped', 'Your location is no longer being shared.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#7C3AED', '#A855F7', '#C084FC']}
          style={{ paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: 10,
                borderRadius: 10
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>
              Location Share
            </Text>
            
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/contacts')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: 10,
                borderRadius: 10
              }}
            >
              <Ionicons name="people" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Current Location Display */}
          {currentLocation && (
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 16,
              padding: 16,
              marginTop: 20
            }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                📍 Current Location
              </Text>
              {currentAddress && (
                <Text style={{ color: 'white', fontSize: 14, marginBottom: 4 }}>
                  {currentAddress}
                </Text>
              )}
              <Text style={{ color: 'white', fontSize: 12, opacity: 0.8 }}>
                Lat: {currentLocation.coords.latitude.toFixed(6)}, Long: {currentLocation.coords.longitude.toFixed(6)}
              </Text>
              
              <TouchableOpacity
                onPress={getCurrentLocation}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 8,
                  padding: 6,
                  alignSelf: 'flex-start',
                  marginTop: 8,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Ionicons name="refresh" size={14} color="white" style={{ marginRight: 4 }} />
                <Text style={{ color: 'white', fontSize: 12 }}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>

        {/* Main Content */}
        <View style={{ paddingHorizontal: 20 }}>
          {/* Status Bar */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
            marginTop: -20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isSharing ? '#DEF7EC' : '#F3F4F6',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                <Ionicons 
                  name={isSharing ? "location" : "location-outline"} 
                  size={20} 
                  color={isSharing ? '#059669' : '#6B7280'} 
                />
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1F2937' }}>
                  Location Sharing
                </Text>
                <Text style={{ fontSize: 12, color: '#6B7280' }}>
                  {isSharing ? 'Your location is being shared' : 'Not currently sharing'}
                </Text>
              </View>
            </View>
            
            <Switch
              value={isSharing}
              onValueChange={(value) => {
                if (value) {
                  sendLocationMessage();
                } else {
                  stopLocationSharing();
                }
              }}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
            />
          </View>

          {/* Duration Selection */}
          <View style={{ marginTop: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 }}>
              Sharing Duration
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {durations.map(duration => (
                <TouchableOpacity
                  key={duration.id}
                  onPress={() => setSelectedDuration(duration.value)}
                  style={{
                    width: (width - 50) / 2,
                    backgroundColor: selectedDuration === duration.value ? '#EFF6FF' : 'white',
                    borderWidth: 1,
                    borderColor: selectedDuration === duration.value ? '#3B82F6' : '#E5E7EB',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: selectedDuration === duration.value ? '#2563EB' : '#1F2937'
                  }}>
                    {duration.label}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: selectedDuration === duration.value ? '#3B82F6' : '#6B7280',
                    marginTop: 2
                  }}>
                    {duration.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Contact Selection */}
          <View style={{ marginTop: 24, marginBottom: 100 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 }}>
              Share With
            </Text>
            
            {isLoadingContacts ? (
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <ActivityIndicator size="large" color="#7C3AED" />
                <Text style={{ marginTop: 10, color: '#6B7280' }}>Loading your contacts...</Text>
              </View>
            ) : contacts.length === 0 ? (
              <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                <Ionicons name="people-outline" size={64} color="#9CA3AF" />
                <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 16, textAlign: 'center' }}>
                  You don't have any contacts yet.{'\n'}Add contacts to share your location with them.
                </Text>
              </View>
            ) : (
              contacts.map(contact => (
                <TouchableOpacity
                  key={contact.id}
                  onPress={() => toggleContactSelection(contact.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: selectedContacts.includes(contact.id) ? '#3B82F6' : '#E5E7EB',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 10,
                  }}
                >
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: contact.color + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12
                  }}>
                    <Text style={{ color: contact.color, fontWeight: 'bold' }}>
                      {contact.name.charAt(0)}
                    </Text>
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1F2937' }}>
                      {contact.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#6B7280' }}>
                      {contact.relationship ? `${contact.relationship} · ` : ''}{contact.phone}
                    </Text>
                  </View>
                  
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: selectedContacts.includes(contact.id) ? '#3B82F6' : '#D1D5DB',
                    backgroundColor: selectedContacts.includes(contact.id) ? '#3B82F6' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {selectedContacts.includes(contact.id) && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
            
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/contacts')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderStyle: 'dashed',
                borderRadius: 12,
                padding: 12,
                marginTop: 8
              }}
            >
              <Ionicons name="add-circle-outline" size={18} color="#6B7280" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 14, color: '#6B7280' }}>Add More Contacts</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Share Location Button (Fixed at bottom) */}
      {!isSharing && (
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }}>
          <TouchableOpacity
            onPress={sendLocationMessage}
            disabled={selectedContacts.length === 0}
            style={{
              backgroundColor: selectedContacts.length > 0 ? '#7C3AED' : '#D1D5DB',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Start Sharing Location
            </Text>
          </TouchableOpacity>

          {/* Quick Share Button */}
          <TouchableOpacity
            onPress={sendLocationMessage}
            disabled={selectedContacts.length === 0}
            style={{
              backgroundColor: selectedContacts.length > 0 ? '#10B981' : '#D1D5DB',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 12
            }}
          >
            <Ionicons 
              name="send" 
              size={18} 
              color="white" 
              style={{ marginRight: 8 }} 
            />
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Send Current Location
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Stop Sharing Button (When sharing is active) */}
      {isSharing && (
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }}>
          <TouchableOpacity
            onPress={stopLocationSharing}
            style={{
              backgroundColor: '#EF4444',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Stop Sharing Location
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
