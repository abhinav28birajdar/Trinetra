import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../store/auth';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuth();
  const { theme, isDark, toggleTheme, setTheme, themeMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    emergency_contact_1: profile?.emergency_contact_1 || '',
    emergency_contact_2: profile?.emergency_contact_2 || '',
    address: profile?.address || '',
    city: profile?.city || '',
    blood_group: profile?.blood_group || '',
    medical_conditions: profile?.medical_conditions || '',
    emergency_message: profile?.emergency_message || 'I need immediate help! Please contact me or call emergency services.',
  });

  // Settings states
  const [settings, setSettings] = useState({
    location_sharing_enabled: profile?.location_sharing_enabled ?? true,
    push_notifications_enabled: profile?.push_notifications_enabled ?? true,
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully');
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Here you would upload the image to Supabase storage
        // For now, we'll just show an alert
        Alert.alert('Feature Coming Soon', 'Avatar upload will be available in the next update');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const ProfileEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryLight]}
          style={{
            paddingTop: 50,
            paddingBottom: 20,
            paddingHorizontal: theme.spacing.md,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
              Edit Profile
            </Text>
            
            <TouchableOpacity onPress={handleUpdateProfile} disabled={loading}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={{ flex: 1, padding: theme.spacing.md }}>
          {/* Personal Information */}
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.md }}>
            Personal Information
          </Text>

          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              Full Name
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                fontSize: 16,
                color: theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              placeholder="Enter your full name"
              placeholderTextColor={theme.colors.placeholder}
              value={formData.full_name}
              onChangeText={(text) => setFormData({ ...formData, full_name: text })}
            />
          </View>

          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              Phone Number
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                fontSize: 16,
                color: theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              placeholder="Enter your phone number"
              placeholderTextColor={theme.colors.placeholder}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              Blood Group
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {bloodGroups.map((group) => (
                <TouchableOpacity
                  key={group}
                  onPress={() => setFormData({ ...formData, blood_group: group })}
                  style={{
                    backgroundColor: formData.blood_group === group ? theme.colors.primary : theme.colors.card,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: theme.borderRadius.md,
                    margin: 4,
                    borderWidth: 1,
                    borderColor: formData.blood_group === group ? theme.colors.primary : theme.colors.border,
                  }}
                >
                  <Text
                    style={{
                      color: formData.blood_group === group ? 'white' : theme.colors.text,
                      fontSize: 14,
                      fontWeight: formData.blood_group === group ? 'bold' : 'normal',
                    }}
                  >
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              Address
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                fontSize: 16,
                color: theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              placeholder="Enter your address"
              placeholderTextColor={theme.colors.placeholder}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
            />
          </View>

          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              City
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                fontSize: 16,
                color: theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              placeholder="Enter your city"
              placeholderTextColor={theme.colors.placeholder}
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
            />
          </View>

          {/* Emergency Information */}
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.md, marginTop: theme.spacing.lg }}>
            Emergency Information
          </Text>

          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              Emergency Contact 1
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                fontSize: 16,
                color: theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              placeholder="Emergency contact phone number"
              placeholderTextColor={theme.colors.placeholder}
              value={formData.emergency_contact_1}
              onChangeText={(text) => setFormData({ ...formData, emergency_contact_1: text })}
              keyboardType="phone-pad"
            />
          </View>

          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              Emergency Contact 2
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                fontSize: 16,
                color: theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              placeholder="Secondary emergency contact"
              placeholderTextColor={theme.colors.placeholder}
              value={formData.emergency_contact_2}
              onChangeText={(text) => setFormData({ ...formData, emergency_contact_2: text })}
              keyboardType="phone-pad"
            />
          </View>

          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              Medical Conditions
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                fontSize: 16,
                color: theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
                height: 80,
                textAlignVertical: 'top',
              }}
              placeholder="Any medical conditions or allergies..."
              placeholderTextColor={theme.colors.placeholder}
              value={formData.medical_conditions}
              onChangeText={(text) => setFormData({ ...formData, medical_conditions: text })}
              multiline
            />
          </View>

          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              Emergency Message
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                fontSize: 16,
                color: theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
                height: 80,
                textAlignVertical: 'top',
              }}
              placeholder="Message to send during emergency..."
              placeholderTextColor={theme.colors.placeholder}
              value={formData.emergency_message}
              onChangeText={(text) => setFormData({ ...formData, emergency_message: text })}
              multiline
            />
          </View>

          {/* Privacy Settings */}
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.md, marginTop: theme.spacing.lg }}>
            Privacy Settings
          </Text>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.md,
          }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text }}>
                Location Sharing
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                Allow app to share your location
              </Text>
            </View>
            <Switch
              value={settings.location_sharing_enabled}
              onValueChange={(value) => setSettings({ ...settings, location_sharing_enabled: value })}
              trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
              thumbColor={settings.location_sharing_enabled ? 'white' : theme.colors.placeholder}
            />
          </View>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.xxl,
          }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text }}>
                Push Notifications
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                Receive emergency and safety alerts
              </Text>
            </View>
            <Switch
              value={settings.push_notifications_enabled}
              onValueChange={(value) => setSettings({ ...settings, push_notifications_enabled: value })}
              trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
              thumbColor={settings.push_notifications_enabled ? 'white' : theme.colors.placeholder}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const ThemeModal = () => (
    <Modal
      visible={showThemeModal}
      animationType="slide"
      transparent
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          width: width - 40,
          maxHeight: height * 0.6,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
              Choose Theme
            </Text>
            <TouchableOpacity onPress={() => setShowThemeModal(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {[
            { mode: 'light', title: 'Light Mode', icon: 'sunny', description: 'Clean and bright interface' },
            { mode: 'dark', title: 'Dark Mode', icon: 'moon', description: 'Easy on the eyes' },
            { mode: 'system', title: 'System Default', icon: 'phone-portrait', description: 'Follow device settings' },
          ].map((option) => (
            <TouchableOpacity
              key={option.mode}
              onPress={() => {
                setTheme(option.mode as 'light' | 'dark' | 'system');
                setShowThemeModal(false);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                backgroundColor: themeMode === option.mode ? theme.colors.primary : 'transparent',
                marginBottom: theme.spacing.sm,
              }}
            >
              <Ionicons 
                name={option.icon as any} 
                size={24} 
                color={themeMode === option.mode ? 'white' : theme.colors.text} 
              />
              <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: themeMode === option.mode ? 'white' : theme.colors.text,
                }}>
                  {option.title}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: themeMode === option.mode ? 'rgba(255, 255, 255, 0.8)' : theme.colors.textSecondary,
                }}>
                  {option.description}
                </Text>
              </View>
              {themeMode === option.mode && (
                <Ionicons name="checkmark" size={20} color="white" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryLight]}
          style={{
            paddingTop: 50,
            paddingBottom: 30,
            paddingHorizontal: theme.spacing.md,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
              Profile
            </Text>
            <TouchableOpacity
              onPress={() => setShowEditModal(true)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: 10,
                borderRadius: theme.borderRadius.md,
              }}
            >
              <Ionicons name="pencil" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Profile Avatar */}
          <View style={{ alignItems: 'center', marginTop: theme.spacing.lg }}>
            <TouchableOpacity onPress={handlePickImage}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing.md,
                }}
              >
                {profile?.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                  />
                ) : (
                  <Text style={{ fontSize: 36, fontWeight: 'bold', color: 'white' }}>
                    {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
              {profile?.full_name || 'Add Your Name'}
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 }}>
              {user?.email}
            </Text>
          </View>
        </LinearGradient>

        {/* Profile Information */}
        <View style={{ padding: theme.spacing.md }}>
          {/* Quick Stats */}
          <View style={{ flexDirection: 'row', marginBottom: theme.spacing.lg }}>
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
              <Ionicons name="shield-checkmark" size={24} color={theme.colors.success} />
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginTop: 8 }}>
                Safe
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                Current Status
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
              <Ionicons name="people" size={24} color={theme.colors.primary} />
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginTop: 8 }}>
                4
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                Emergency Contacts
              </Text>
            </View>
          </View>

          {/* Settings */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.md }}>
            Settings
          </Text>

          {/* Theme Setting */}
          <TouchableOpacity
            onPress={() => setShowThemeModal(true)}
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.sm,
              shadowColor: theme.colors.shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme.colors.shadowOpacity,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color={theme.colors.primary} />
            <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text }}>
                Theme
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                {themeMode === 'system' ? 'System Default' : isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>

          {/* Emergency Contacts */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/contacts')}
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.sm,
              shadowColor: theme.colors.shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme.colors.shadowOpacity,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="people" size={24} color={theme.colors.primary} />
            <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text }}>
                Emergency Contacts
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                Manage your emergency contacts
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>

          {/* Location Settings */}
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.sm,
              shadowColor: theme.colors.shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme.colors.shadowOpacity,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="location" size={24} color={theme.colors.primary} />
            <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text }}>
                Location Services
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                {settings.location_sharing_enabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <Switch
              value={settings.location_sharing_enabled}
              onValueChange={(value) => setSettings({ ...settings, location_sharing_enabled: value })}
              trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
              thumbColor={settings.location_sharing_enabled ? 'white' : theme.colors.placeholder}
            />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.lg,
              shadowColor: theme.colors.shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme.colors.shadowOpacity,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="notifications" size={24} color={theme.colors.primary} />
            <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text }}>
                Notifications
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                {settings.push_notifications_enabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <Switch
              value={settings.push_notifications_enabled}
              onValueChange={(value) => setSettings({ ...settings, push_notifications_enabled: value })}
              trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
              thumbColor={settings.push_notifications_enabled ? 'white' : theme.colors.placeholder}
            />
          </TouchableOpacity>

          {/* About Section */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.md }}>
            About
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.sm,
              shadowColor: theme.colors.shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme.colors.shadowOpacity,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="help-circle" size={24} color={theme.colors.primary} />
            <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text }}>
                Help & Support
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                Get help and support
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.lg,
              shadowColor: theme.colors.shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme.colors.shadowOpacity,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
            <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text }}>
                About Trinatra
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                Version 1.0.0 - Women's Safety App
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>

          {/* Sign Out */}
          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              backgroundColor: theme.colors.error,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 100,
              shadowColor: theme.colors.error,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="log-out" size={24} color="white" />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', marginLeft: theme.spacing.sm }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <ProfileEditModal />
      <ThemeModal />
    </View>
  );
}
