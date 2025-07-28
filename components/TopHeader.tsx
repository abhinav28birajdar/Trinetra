import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../store/auth';

interface TopHeaderProps {
  showBackButton?: boolean;
  showProfile?: boolean;
  title?: string;
  onBack?: () => void;
}

export default function TopHeader({ showBackButton, showProfile = false, title, onBack }: TopHeaderProps) {
  const { user, profile } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleProfilePress = () => {
    router.push('/settings');
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  if (showBackButton) {
    return (
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
        <View className="w-8" />
      </View>
    );
  }

  if (showProfile) {
    return (
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={handleProfilePress} className="flex-row items-center">
          <Image
            source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/40' }}
            className="w-8 h-8 rounded-full mr-2"
          />
          <Text className="text-lg font-medium text-gray-800">
            {profile?.full_name || user?.email?.split('@')[0] || 'User'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSettingsPress} className="p-2">
          <Ionicons name="settings-outline" size={24} color="#6B46C1" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-center px-4 py-3 bg-white border-b border-gray-200">
      <Text className="text-lg font-semibold text-gray-800">{title}</Text>
    </View>
  );
}
