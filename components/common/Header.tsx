import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../types/navigation'; // Adjust as needed

// Define a type for the navigation prop if it's specific
type HeaderNavigationProp = StackNavigationProp<HomeStackParamList, 'HomeScreen'>; // Example for Home


const defaultAvatar = require('../../assets/images/default_avatar.png'); // Add a default avatar

const AppHeader = ({ title, showSettings = true }: { title?: string, showSettings?: boolean }) => {
  const { profile } = useAuth();
  const navigation = useNavigation<HeaderNavigationProp>(); // Use specific type

  return (
    <View className="bg-primary pt-10 pb-4 px-4 flex-row items-center justify-between rounded-b-2xl shadow-lg">
      <View className="flex-row items-center">
        <Image
          source={profile?.avatar_url ? { uri: profile.avatar_url } : defaultAvatar}
          className="w-10 h-10 rounded-full mr-3 border-2 border-white"
        />
        <View>
            <Text className="text-white text-lg font-semibold">
            {profile?.username || 'User..'}
            </Text>
            {title && <Text className="text-gray-300 text-xs">{title}</Text>}
        </View>
      </View>
      {showSettings && (
        <TouchableOpacity onPress={() => navigation.navigate('Settings' as any /* Cast if type mismatch */)}>
          <Ionicons name="settings-outline" size={28} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AppHeader;