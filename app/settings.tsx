import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../store/auth';

const { width, height } = Dimensions.get('window');

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  color?: string;
}

export default function SettingsScreen() {
  const { user, profile, signOut } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(profile?.push_notifications_enabled ?? true);
  const [locationSharing, setLocationSharing] = useState(profile?.location_sharing_enabled ?? true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => signOut() }
      ]
    );
  };

  const settingsData: SettingItem[] = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      subtitle: 'Receive emergency alerts and updates',
      icon: 'notifications-outline',
      type: 'toggle',
      value: pushNotifications,
      onToggle: setPushNotifications
    },
    {
      id: 'emergency-alerts',
      title: 'Emergency Alerts',
      subtitle: 'Receive community emergency notifications',
      icon: 'warning-outline',
      type: 'toggle',
      value: emergencyAlerts,
      onToggle: setEmergencyAlerts
    },
    {
      id: 'location',
      title: 'Location Sharing',
      subtitle: 'Share location with emergency contacts',
      icon: 'location-outline',
      type: 'toggle',
      value: locationSharing,
      onToggle: setLocationSharing
    },
    {
      id: 'profile',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: 'person-outline',
      type: 'navigation',
      onPress: () => router.push('/edit-profile')
    },
    {
      id: 'emergency-contacts',
      title: 'Emergency Contacts',
      subtitle: 'Manage your emergency contacts',
      icon: 'people-outline',
      type: 'navigation',
      onPress: () => router.push('/(tabs)/contacts')
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      icon: 'shield-checkmark-outline',
      type: 'navigation',
      onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon.')
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      subtitle: 'View terms and conditions',
      icon: 'document-text-outline',
      type: 'navigation',
      onPress: () => Alert.alert('Coming Soon', 'Terms and conditions will be available soon.')
    },
    {
      id: 'help',
      title: 'Safety Tips',
      subtitle: 'Learn important safety information',
      icon: 'shield-checkmark-outline',
      type: 'navigation',
      onPress: () => router.push('/safety-tips')
    },
    {
      id: 'support',
      title: 'Help & Support',
      subtitle: 'Get help and support',
      icon: 'help-circle-outline',
      type: 'navigation',
      onPress: () => Alert.alert('Support', 'For support, please email: support@trinatra.com')
    },
    {
      id: 'logout',
      title: 'Sign Out',
      subtitle: 'Sign out of your account',
      icon: 'log-out-outline',
      type: 'action',
      color: '#EF4444',
      onPress: handleSignOut
    }
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      onPress={item.onPress}
      disabled={item.type === 'toggle'}
      style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        marginHorizontal: 24, 
        marginVertical: 6, 
        padding: 16, 
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
      }}
    >
      {/* Icon */}
      <View style={{ 
        width: 45, 
        height: 45, 
        borderRadius: 22.5, 
        backgroundColor: item.id === 'logout' ? '#FEE2E2' : '#F3F4F6', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginRight: 16
      }}>
        <Ionicons 
          name={item.icon as any} 
          size={24} 
          color={item.id === 'logout' ? '#DC2626' : '#8B5CF6'} 
        />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text style={{ 
          fontSize: 16, 
          fontWeight: 'bold', 
          color: item.id === 'logout' ? '#DC2626' : '#1F2937', 
          marginBottom: 4 
        }}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={{ fontSize: 14, color: '#6B7280' }}>
            {item.subtitle}
          </Text>
        )}
      </View>

      {/* Action */}
      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
          thumbColor={item.value ? '#FFFFFF' : '#F3F4F6'}
        />
      )}

      {(item.type === 'navigation' || item.type === 'action') && (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

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
              Settings
            </Text>
            
            <View style={{ width: 40 }} />
          </View>
        </View>

        {/* Main Content */}
        <View style={{ 
          flex: 1, 
          backgroundColor: '#F8FAFC', 
          borderTopLeftRadius: 30, 
          borderTopRightRadius: 30,
          paddingTop: 20
        }}>
          {/* User Profile Card */}
          <View style={{ 
            backgroundColor: 'white', 
            marginHorizontal: 24, 
            marginBottom: 20, 
            borderRadius: 20, 
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ 
                width: 60, 
                height: 60, 
                borderRadius: 30, 
                backgroundColor: '#8B5CF6', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: 16
              }}>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
                  {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 }}>
                  {profile?.full_name || 'User'}
                </Text>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>
                  {user?.email}
                </Text>
              </View>

              <TouchableOpacity style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                backgroundColor: '#F3F4F6', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Ionicons name="pencil" size={20} color="#8B5CF6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Settings List */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {settingsData.map(renderSettingItem)}
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
}
