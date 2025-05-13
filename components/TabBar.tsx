import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, Globe, Users, User } from 'lucide-react-native';
import { useColors } from '@/constants/colors';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

interface TabBarProps extends BottomTabBarProps {
  isDarkMode?: boolean;
}

export default function TabBar({ isDarkMode = false, ...props }: TabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const Colors = useColors();

  const tabs = [
    { name: 'home', icon: Home, label: '', route: '/' },
    { name: 'location', icon: Globe, label: '', route: '/location' },
    { name: 'sos', label: 'SOS', route: '/sos' },
    { name: 'community', icon: Users, label: '', route: '/community' },
    { name: 'profile', icon: User, label: '', route: '/profile' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: Colors.primary }]}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.route;
        
        // Special case for SOS button
        if (tab.name === 'sos') {
          return (
            <TouchableOpacity
              key={tab.name}
              style={[styles.sosButton, { borderColor: Colors.text.light }]}
              onPress={() => router.push(tab.route)}
            >
              <Text style={styles.sosText}>{tab.label}</Text>
            </TouchableOpacity>
          );
        }
        
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.route)}
          >
            {tab.icon && (
              <tab.icon
                size={24}
                color={isActive ? Colors.text.light : '#E0E0E0'}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6A0DAD',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    borderWidth: 4,
  },
  sosText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});