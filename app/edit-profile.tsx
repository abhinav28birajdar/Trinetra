import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';
import { Database } from '../types/supabase';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export default function EditProfileScreen() {
    const { user, profile, fetchProfile } = useAuthStore();
    const [loading, setLoading] = useState(false);
    
    // Profile form state
    const [fullName, setFullName] = useState(profile?.full_name ?? '');
    const [phone, setPhone] = useState(profile?.phone ?? '');
    const [email, setEmail] = useState(profile?.email ?? '');
    const [emergencyMessage, setEmergencyMessage] = useState(profile?.emergency_message ?? 'I need immediate help! Please contact me or call emergency services.');
    const [bloodGroup, setBloodGroup] = useState(profile?.blood_group ?? '');
    const [medicalConditions, setMedicalConditions] = useState(profile?.medical_conditions ?? '');
    const [address, setAddress] = useState(profile?.address ?? '');
    const [city, setCity] = useState(profile?.city ?? '');
    const [emergencyContact1, setEmergencyContact1] = useState(profile?.emergency_contact_1 ?? '');
    const [emergencyContact2, setEmergencyContact2] = useState(profile?.emergency_contact_2 ?? '');

    useEffect(() => {
        if (profile) {
            setFullName(profile?.full_name ?? '');
            setPhone(profile?.phone ?? '');
            setEmail(profile?.email ?? '');
            setEmergencyMessage(profile?.emergency_message ?? 'I need immediate help! Please contact me or call emergency services.');
            setBloodGroup(profile?.blood_group ?? '');
            setMedicalConditions(profile?.medical_conditions ?? '');
            setAddress(profile?.address ?? '');
            setCity(profile?.city ?? '');
            setEmergencyContact1(profile?.emergency_contact_1 ?? '');
            setEmergencyContact2(profile?.emergency_contact_2 ?? '');
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
                Alert.alert('Success', 'Profile updated successfully!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            if (user?.id) {
                                fetchProfile(user.id);
                            }
                            router.back();
                        }
                    }
                ]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
            console.error('Profile update error:', error);
        } finally {
            setLoading(false);
        }
    };

    const ProfileItem = ({ icon, label, value, onChangeText, placeholder, multiline = false, keyboardType = 'default' }: {
        icon: keyof typeof Ionicons.glyphMap;
        label: string;
        value: string;
        onChangeText: (text: string) => void;
        placeholder: string;
        multiline?: boolean;
        keyboardType?: 'default' | 'email-address' | 'phone-pad';
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
                keyboardType={keyboardType}
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
                            onPress={() => router.back()}
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                padding: 10,
                                borderRadius: 10,
                                marginRight: 15
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>Edit Profile</Text>
                    </View>
                </View>
                
                {/* Profile Avatar & Basic Info */}
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <View style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 10
                    }}>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>
                            {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
                        Edit your profile information
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView 
                style={{ flex: 1 }} 
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Basic Information */}
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
                        Basic Information
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
                        keyboardType="phone-pad"
                    />

                    <ProfileItem
                        icon="mail-outline"
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email address"
                        keyboardType="email-address"
                    />

                    <ProfileItem
                        icon="location-outline"
                        label="Address"
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Enter your address"
                    />

                    <ProfileItem
                        icon="business-outline"
                        label="City"
                        value={city}
                        onChangeText={setCity}
                        placeholder="Enter your city"
                    />
                </View>

                {/* Medical Information */}
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
                        Medical Information
                    </Text>

                    <ProfileItem
                        icon="water-outline"
                        label="Blood Group"
                        value={bloodGroup}
                        onChangeText={setBloodGroup}
                        placeholder="e.g., A+, B-, O+, AB-"
                    />

                    <ProfileItem
                        icon="medical-outline"
                        label="Medical Conditions"
                        value={medicalConditions}
                        onChangeText={setMedicalConditions}
                        placeholder="Any medical conditions or allergies"
                        multiline={true}
                    />
                </View>

                {/* Emergency Information */}
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
                        Emergency Information
                    </Text>

                    <ProfileItem
                        icon="warning-outline"
                        label="Emergency Message"
                        value={emergencyMessage}
                        onChangeText={setEmergencyMessage}
                        placeholder="Default emergency message"
                        multiline={true}
                    />

                    <ProfileItem
                        icon="person-add-outline"
                        label="Emergency Contact 1"
                        value={emergencyContact1}
                        onChangeText={setEmergencyContact1}
                        placeholder="Primary emergency contact number"
                        keyboardType="phone-pad"
                    />

                    <ProfileItem
                        icon="person-add-outline"
                        label="Emergency Contact 2"
                        value={emergencyContact2}
                        onChangeText={setEmergencyContact2}
                        placeholder="Secondary emergency contact number"
                        keyboardType="phone-pad"
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
