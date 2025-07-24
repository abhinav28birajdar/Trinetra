import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/auth';
import { supabase } from '../../lib/supabase';
import AppHeader from '../../components/AppHeader';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Database } from '../../types/supabase';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export default function ProfileScreen() {
    const { user, profile, fetchProfile } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    // Profile form state
    const [fullName, setFullName] = useState(profile?.full_name ?? '');
    const [phone, setPhone] = useState(profile?.phone ?? '');
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');

    useEffect(() => {
        if (profile) {
            setFullName(profile?.full_name ?? '');
            setPhone(profile?.phone ?? '');
            setAvatarUrl(profile?.avatar_url ?? '');
        }
    }, [profile]);

    const updateProfile = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const updates: ProfileUpdate = {
                id: user.id,
                full_name: fullName,
                phone: phone,
                avatar_url: avatarUrl,
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
                fetchProfile(user.id); // Refresh the profile
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        Alert.alert('Feature Not Available', 'Image picker is not available in this version.');
    };

    const uploadAvatar = async (uri: string): Promise<string> => {
        if (!user) throw new Error('No user');
        
        const response = await fetch(uri);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const fileExt = uri.split('.').pop() || 'jpg';
        const fileName = `${user.id}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error } = await supabase.storage
            .from('avatars')
            .upload(filePath, arrayBuffer, {
                contentType: `image/${fileExt}`,
                upsert: true,
            });

        if (error) {
            throw error;
        }

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const signOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await supabase.auth.signOut();
                    },
                },
            ]
        );
    };

    return (
        <View className="flex-1 bg-primary-dark">
            <AppHeader title="Profile" />
            <ScrollView className="flex-1 bg-white rounded-t-3xl">
                <View className="p-6">
                    {/* Avatar Section */}
                    <View className="items-center mb-6">
                        <TouchableOpacity onPress={pickImage} className="relative">
                            <Image
                                source={avatarUrl ? { uri: avatarUrl } : { uri: 'https://via.placeholder.com/100/CCCCCC/FFFFFF?text=U' }}
                                className="w-24 h-24 rounded-full bg-gray-300"
                            />
                            {uploading && (
                                <View className="absolute inset-0 justify-center items-center bg-black/50 rounded-full">
                                    <ActivityIndicator color="white" />
                                </View>
                            )}
                            <View className="absolute bottom-0 right-0 bg-primary rounded-full p-2">
                                <Ionicons name="camera" size={16} color="white" />
                            </View>
                        </TouchableOpacity>
                        <Text className="text-gray-600 text-sm mt-2">Tap to change photo</Text>
                    </View>

                    {/* Email (Read-only) */}
                    <View className="mb-4">
                        <Text className="text-gray-700 font-medium mb-2">Email</Text>
                        <View className="bg-gray-100 rounded-lg p-3">
                            <Text className="text-gray-600">{user?.email}</Text>
                        </View>
                    </View>

                    {/* Full Name */}
                    <View className="mb-4">
                        <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
                        <TextInput
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter your full name"
                            className="bg-gray-100 rounded-lg p-3 text-gray-800"
                        />
                    </View>

                    {/* Phone */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-medium mb-2">Phone</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            className="bg-gray-100 rounded-lg p-3 text-gray-800"
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Update Button */}
                    <TouchableOpacity
                        onPress={updateProfile}
                        disabled={loading}
                        className="bg-primary py-3 rounded-lg items-center mb-4"
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-semibold text-lg">Update Profile</Text>
                        )}
                    </TouchableOpacity>

                    {/* Sign Out Button */}
                    <TouchableOpacity
                        onPress={signOut}
                        className="bg-red-500 py-3 rounded-lg items-center"
                    >
                        <Text className="text-white font-semibold text-lg">Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
