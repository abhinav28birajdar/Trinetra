import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';
import { Database } from '../types/supabase';

const { width } = Dimensions.get('window');
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export default function ProfileScreen() {
    const { user, profile, fetchProfile, signOut: authSignOut } = useAuthStore();
    const [loading, setLoading] = useState(false);
    
    // Profile form state
    const [fullName, setFullName] = useState(profile?.full_name ?? '');
    const [phone, setPhone] = useState(profile?.phone ?? '');
    const [email, setEmail] = useState(profile?.email ?? '');
    const [emergencyMessage, setEmergencyMessage] = useState(profile?.emergency_message ?? 'I need immediate help! Please contact me or call emergency services.');

    useEffect(() => {
        if (profile) {
            setFullName(profile?.full_name ?? '');
            setPhone(profile?.phone ?? '');
            setEmail(profile?.email ?? '');
            setEmergencyMessage(profile?.emergency_message ?? 'I need immediate help! Please contact me or call emergency services.');
        }
    }, [profile]);

    const updateProfile = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const updates: ProfileUpdate = {
                full_name: fullName,
                phone: phone,
                email: email,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Success', 'Profile updated successfully!');
                if (user?.id) {
                    fetchProfile(user.id);
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
            console.error('Profile update error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await authSignOut();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to sign out');
                        }
                    }
                }
            ]
        );
    };

    const ProfileItem = ({ icon, label, value, onChangeText, placeholder, multiline = false }: {
        icon: keyof typeof Ionicons.glyphMap;
        label: string;
        value: string;
        onChangeText: (text: string) => void;
        placeholder: string;
        multiline?: boolean;
    }) => (
        <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name={icon} size={20} color="#7C3AED" />
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginLeft: 8 }}>{label}</Text>
            </View>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                style={{
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: multiline ? 12 : 16,
                    fontSize: 16,
                    backgroundColor: 'white',
                    textAlignVertical: multiline ? 'top' : 'center'
                }}
                multiline={multiline}
                numberOfLines={multiline ? 3 : 1}
                placeholderTextColor="#9CA3AF"
            />
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <LinearGradient
                colors={['#7C3AED', '#A855F7', '#C084FC']}
                style={{ paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => router.push('/settings')}
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                padding: 10,
                                borderRadius: 10,
                                marginRight: 15
                            }}
                        >
                            <Ionicons name="settings-outline" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>Profile</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleSignOut}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            padding: 10,
                            borderRadius: 10
                        }}
                    >
                        <Ionicons name="log-out-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                
                {/* Profile Avatar & Basic Info */}
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <View style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 15
                    }}>
                        <Text style={{ fontSize: 36, fontWeight: 'bold', color: 'white' }}>
                            {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                        {fullName || 'Your Name'}
                    </Text>
                    <Text style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', marginTop: 4 }}>
                        {email || 'your.email@example.com'}
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView 
                style={{ flex: 1 }} 
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Edit Profile Section */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 5,
                }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 20 }}>
                        Personal Information
                    </Text>

                    <ProfileItem
                        icon="person-outline"
                        label="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Enter your full name"
                    />

                    <ProfileItem
                        icon="call-outline"
                        label="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Enter your phone number"
                    />

                    <ProfileItem
                        icon="mail-outline"
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email address"
                    />

                    <ProfileItem
                        icon="warning-outline"
                        label="Emergency Message"
                        value={emergencyMessage}
                        onChangeText={setEmergencyMessage}
                        placeholder="Default emergency message"
                        multiline={true}
                    />

                    <TouchableOpacity
                        onPress={updateProfile}
                        disabled={loading}
                        style={{
                            backgroundColor: '#7C3AED',
                            padding: 16,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 10
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <>
                                <Ionicons name="save-outline" size={20} color="white" style={{ marginRight: 8 }} />
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Save Changes</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
