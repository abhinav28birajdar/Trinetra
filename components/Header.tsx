import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Settings } from 'lucide-react-native';
import { useColors } from '@/constants/colors';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSettingsButton?: boolean;
  showAvatar?: boolean;
  username?: string;
  isDarkMode?: boolean;
}

export default function Header({
  title,
  showBackButton = false,
  showSettingsButton = false,
  showAvatar = false,
  username,
  isDarkMode = false,
}: HeaderProps) {
  const router = useRouter();
  const Colors = useColors();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text.light} />
          </TouchableOpacity>
        )}
        {showAvatar && (
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' }}
              style={styles.avatar}
            />
            <Text style={[styles.username, { color: Colors.text.light }]}>{username || "User...."}</Text>
          </View>
        )}
        {title && !showAvatar && (
          <Text style={[styles.title, { color: isDarkMode ? Colors.text.light : Colors.primary }]}>{title}</Text>
        )}
      </View>
      
      {showSettingsButton && (
        <TouchableOpacity 
          onPress={() => router.push('/settings')}
          style={[styles.settingsButton, { backgroundColor: isDarkMode ? Colors.background.secondary : '#F5F5F5' }]}
        >
          <Settings size={24} color={Colors.text.dark} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
  },
});