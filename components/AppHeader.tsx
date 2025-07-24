import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../store/auth'; // Adjust path

// Default avatar placeholder
const defaultAvatar = { uri: 'https://via.placeholder.com/40/CCCCCC/FFFFFF?text=U' };

interface AppHeaderProps {
    title?: string;
    showSettings?: boolean; // Option to show settings icon
    showBackButton?: boolean; // Option for back navigation
}

export default function AppHeader({ title, showSettings = true, showBackButton = false }: AppHeaderProps) {
    const { profile } = useAuthStore();
    const router = useRouter();

    return (
        <View className="flex-row items-center justify-between px-4 pt-12 pb-4 bg-primary-dark">
            <View className="flex-row items-center">
                {showBackButton && (
                     <TouchableOpacity onPress={() => router.back()} className="mr-3">
                        <Ionicons name="arrow-back" size={28} color="white" />
                     </TouchableOpacity>
                 )}
                 {/* Avatar and Name */}
                <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} className="flex-row items-center">
                    <Image
                         source={profile?.avatar_url ? { uri: profile.avatar_url } : defaultAvatar}
                        className="w-8 h-8 rounded-full mr-2 bg-gray-300"
                    />
                    <Text className="text-white text-sm font-semibold">
                       {profile?.full_name ? `${profile.full_name.substring(0, 10)}${profile.full_name.length > 10 ? '..' : ''}` : 'User..'}
                    </Text>
                </TouchableOpacity>
            </View>

             {/* Optional Title - Could be centered or replace Avatar/Name */}
             {title && (
                <Text className="text-white text-xl font-bold absolute left-0 right-0 text-center" style={{ top: 48 }}>
                   {/* Title centered - adjust layout if using with avatar */}
                   {/* {title} */}
                </Text>
             )}

             {/* Settings Icon */}
             {showSettings && (
                 <TouchableOpacity onPress={() => router.push('/settings')}>
                     <Ionicons name="settings-outline" size={28} color="white" />
                 </TouchableOpacity>
             )}
             {/* Add a placeholder if settings is hidden but space is needed */}
             {!showSettings && <View className="w-7 h-7" />}
        </View>
    );
}