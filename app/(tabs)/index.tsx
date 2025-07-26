import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  RefreshControl,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../store/auth';

const { width, height } = Dimensions.get('window');

interface LocationShare {
  id: string;
  is_active: boolean;
  shared_with: string[];
  duration_minutes: number | null;
  created_at: string;
  expires_at: string | null;
}

interface QuickContact {
  id: string;
  name: string;
  phone: string;
  contact_type: string;
  avatar_color: string;
}

export default function HomeScreen() {
  const { user, profile } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
  const [activeLocationShare, setActiveLocationShare] = useState<LocationShare | null>(null);
  const [quickContacts, setQuickContacts] = useState<QuickContact[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLocationSharing, setIsLocationSharing] = useState(false);

  useEffect(() => {
    checkLocationPermission();
    fetchQuickContacts();
    checkActiveLocationShare();
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
      
      // Update user's last location in database
      if (user) {
        await supabase
          .from('profiles')
          .update({
            last_location: `POINT(${location.coords.longitude} ${location.coords.latitude})`,
            last_seen: new Date().toISOString(),
          })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const fetchQuickContacts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('id, name, phone, contact_type, avatar_color')
        .eq('user_id', user.id)
        .or('is_emergency_service.eq.true,is_primary.eq.true')
        .order('priority', { ascending: true })
        .limit(4);

      if (error) throw error;
      setQuickContacts(data || []);
    } catch (error) {
      console.error('Error fetching quick contacts:', error);
    }
  };

  const checkActiveLocationShare = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('location_shares')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setActiveLocationShare(data[0]);
        setIsLocationSharing(true);
      }
    } catch (error) {
      console.error('Error checking location share:', error);
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
          'Location Permission',
          'Location access is required for safety features. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const handleQuickCall = async (contact: QuickContact) => {
    Alert.alert(
      'Emergency Call',
      `Call ${contact.name} (${contact.phone})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: async () => {
            try {
              await Linking.openURL(`tel:${contact.phone}`);
              
              // Log the call
              await supabase
                .from('call_logs')
                .insert([{
                  user_id: user?.id,
                  contact_id: contact.id,
                  phone_number: contact.phone,
                  contact_name: contact.name,
                  call_type: 'outgoing',
                  is_emergency: contact.contact_type !== 'personal',
                }]);
            } catch (error) {
              console.error('Error making call:', error);
              Alert.alert('Error', 'Unable to make call');
            }
          },
        },
      ]
    );
  };

  const toggleLocationSharing = async () => {
    if (!user || !currentLocation) {
      Alert.alert('Error', 'Location not available');
      return;
    }

    try {
      if (isLocationSharing && activeLocationShare) {
        // Stop location sharing
        const { error } = await supabase
          .from('location_shares')
          .update({ is_active: false })
          .eq('id', activeLocationShare.id);

        if (error) throw error;
        
        setIsLocationSharing(false);
        setActiveLocationShare(null);
        Alert.alert('Success', 'Location sharing stopped');
      } else {
        // Start location sharing
        const { data, error } = await supabase
          .from('location_shares')
          .insert([{
            user_id: user.id,
            session_name: 'Quick Location Share',
            message: 'Sharing my location for safety',
            location: `POINT(${currentLocation.coords.longitude} ${currentLocation.coords.latitude})`,
            shared_with: [], // Will be populated based on emergency contacts
            duration_minutes: 60, // 1 hour default
            is_active: true,
            is_emergency: false,
          }])
          .select()
          .single();

        if (error) throw error;
        
        setIsLocationSharing(true);
        setActiveLocationShare(data);
        Alert.alert('Success', 'Location sharing activated');
      }
    } catch (error) {
      console.error('Error toggling location sharing:', error);
      Alert.alert('Error', 'Failed to toggle location sharing');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    Promise.all([
      getCurrentLocation(),
      fetchQuickContacts(),
      checkActiveLocationShare(),
    ]).finally(() => setRefreshing(false));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getLocationStatus = () => {
    if (locationPermission !== 'granted') return 'Location Disabled';
    if (!currentLocation) return 'Getting Location...';
    return 'Location Active';
  };

  const getLocationStatusColor = () => {
    if (locationPermission !== 'granted') return theme.colors.error;
    if (!currentLocation) return theme.colors.warning;
    return theme.colors.success;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryLight]}
          style={{
            paddingTop: 50,
            paddingBottom: 30,
            paddingHorizontal: theme.spacing.md,
            borderBottomLeftRadius: theme.borderRadius.xl,
            borderBottomRightRadius: theme.borderRadius.xl,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.8)' }}>
                {getGreeting()},
              </Text>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginTop: 4 }}>
                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Theme Toggle */}
              <TouchableOpacity
                onPress={toggleTheme}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: 12,
                  borderRadius: theme.borderRadius.md,
                  marginRight: theme.spacing.sm,
                }}
              >
                <Ionicons 
                  name={isDark ? 'sunny' : 'moon'} 
                  size={20} 
                  color="white" 
                />
              </TouchableOpacity>
              
              {/* Profile */}
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/profile')}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: 12,
                  borderRadius: theme.borderRadius.md,
                }}
              >
                <Ionicons name="person" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Location Status */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.md,
              marginTop: theme.spacing.md,
            }}
          >
            <Ionicons 
              name="location" 
              size={20} 
              color={getLocationStatusColor()} 
            />
            <Text style={{ color: 'white', fontSize: 14, marginLeft: 8, flex: 1 }}>
              {getLocationStatus()}
            </Text>
            {locationPermission !== 'granted' && (
              <TouchableOpacity onPress={requestLocationPermission}>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                  Enable
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={{ padding: theme.spacing.md }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: theme.colors.text, 
            marginBottom: theme.spacing.md 
          }}>
            Quick Actions
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* SOS Button */}
            <TouchableOpacity
              onPress={() => router.push('/sos')}
              style={{
                backgroundColor: theme.colors.emergency,
                flex: 1,
                aspectRatio: 1,
                borderRadius: theme.borderRadius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.sm,
                shadowColor: theme.colors.emergency,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Ionicons name="warning" size={32} color="white" />
              <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', marginTop: 8 }}>
                SOS
              </Text>
            </TouchableOpacity>

            {/* Emergency Call */}
            <TouchableOpacity
              onPress={() => router.push('/emergency-call-new')}
              style={{
                backgroundColor: theme.colors.primary,
                flex: 1,
                aspectRatio: 1,
                borderRadius: theme.borderRadius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: theme.spacing.sm,
                shadowColor: theme.colors.shadowColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: theme.colors.shadowOpacity,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Ionicons name="call" size={32} color="white" />
              <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', marginTop: 8 }}>
                Call
              </Text>
            </TouchableOpacity>

            {/* Location Share */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/live-location')}
              style={{
                backgroundColor: theme.colors.info,
                flex: 1,
                aspectRatio: 1,
                borderRadius: theme.borderRadius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: theme.spacing.sm,
                shadowColor: theme.colors.shadowColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: theme.colors.shadowOpacity,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Ionicons name="location" size={32} color="white" />
              <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', marginTop: 8 }}>
                Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={{ padding: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: theme.colors.text 
            }}>
              Emergency Contacts
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/contacts')}>
              <Text style={{ color: theme.colors.primary, fontSize: 14, fontWeight: 'bold' }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            marginTop: theme.spacing.md 
          }}>
            {quickContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                onPress={() => handleQuickCall(contact)}
                style={{
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing.md,
                  marginRight: theme.spacing.sm,
                  marginBottom: theme.spacing.sm,
                  alignItems: 'center',
                  minWidth: (width - theme.spacing.md * 3) / 2,
                  shadowColor: theme.colors.shadowColor,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: theme.colors.shadowOpacity,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: contact.avatar_color,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                    {contact.name.charAt(0)}
                  </Text>
                </View>
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: 'bold', 
                  color: theme.colors.text,
                  textAlign: 'center',
                }}>
                  {contact.name}
                </Text>
                <Text style={{ 
                  fontSize: 12, 
                  color: theme.colors.textSecondary,
                  textAlign: 'center',
                  marginTop: 2,
                }}>
                  {contact.phone}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location Sharing Card */}
        <View style={{ padding: theme.spacing.md }}>
          <View
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              shadowColor: theme.colors.shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme.colors.shadowOpacity,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
                  Location Sharing
                </Text>
                <Text style={{ fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 }}>
                  {isLocationSharing ? 'Currently sharing location' : 'Share your location with emergency contacts'}
                </Text>
              </View>
              <Switch
                value={isLocationSharing}
                onValueChange={toggleLocationSharing}
                trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
                thumbColor={isLocationSharing ? 'white' : theme.colors.placeholder}
              />
            </View>
            
            {isLocationSharing && activeLocationShare && (
              <View style={{ marginTop: theme.spacing.md, paddingTop: theme.spacing.md, borderTopWidth: 1, borderTopColor: theme.colors.divider }}>
                <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>
                  Active since: {new Date(activeLocationShare.created_at).toLocaleTimeString()}
                </Text>
                {activeLocationShare.duration_minutes && (
                  <Text style={{ fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
                    Duration: {activeLocationShare.duration_minutes} minutes
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Safety Tips */}
        <View style={{ padding: theme.spacing.md }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: theme.colors.text, 
            marginBottom: theme.spacing.md 
          }}>
            Safety Tips
          </Text>
          
          <View
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              shadowColor: theme.colors.shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme.colors.shadowOpacity,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
              <Ionicons name="bulb" size={20} color={theme.colors.warning} />
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginLeft: 8 }}>
                Today's Safety Tip
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20 }}>
              Always share your location with trusted contacts when traveling alone, especially during late hours. Keep your phone charged and easily accessible.
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={{ padding: theme.spacing.md, paddingBottom: 100 }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: theme.colors.text, 
            marginBottom: theme.spacing.md 
          }}>
            Quick Stats
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.md,
                flex: 1,
                marginRight: theme.spacing.sm,
                alignItems: 'center',
                shadowColor: theme.colors.shadowColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: theme.colors.shadowOpacity,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.primary }}>
                {quickContacts.length}
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary, textAlign: 'center' }}>
                Emergency Contacts
              </Text>
            </View>
            
            <View
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.md,
                flex: 1,
                marginLeft: theme.spacing.sm,
                alignItems: 'center',
                shadowColor: theme.colors.shadowColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: theme.colors.shadowOpacity,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.success }}>
                {locationPermission === 'granted' ? 'ON' : 'OFF'}
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary, textAlign: 'center' }}>
                Location Services
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
