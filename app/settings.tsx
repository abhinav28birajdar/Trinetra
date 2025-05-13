import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useColors } from '@/constants/colors';
import Header from '@/components/Header';
import { Moon, Bell, Lock, FileText, HelpCircle, LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const Colors = useColors();
  
  const [notifications, setNotifications] = React.useState(true);
  
  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background.primary }]}>
      <View style={[styles.header, { backgroundColor: Colors.primary }]}>
        <Header title="Setting" showBackButton isDarkMode={isDarkMode} />
      </View>
      
      <View style={styles.content}>
        <View style={[styles.settingItem, { borderBottomColor: Colors.border }]}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? Colors.background.card : '#F0E6FF' }]}>
              <Moon size={24} color={Colors.primary} />
            </View>
            <Text style={[styles.settingText, { color: Colors.primary }]}>Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#E0E0E0', true: Colors.primaryLight }}
            thumbColor={isDarkMode ? Colors.primary : '#F5F5F5'}
          />
        </View>
        
        <View style={[styles.settingItem, { borderBottomColor: Colors.border }]}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? Colors.background.card : '#F0E6FF' }]}>
              <Bell size={24} color={Colors.primary} />
            </View>
            <Text style={[styles.settingText, { color: Colors.primary }]}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#E0E0E0', true: Colors.primaryLight }}
            thumbColor={notifications ? Colors.primary : '#F5F5F5'}
          />
        </View>
        
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: Colors.border }]}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? Colors.background.card : '#F0E6FF' }]}>
              <Lock size={24} color={Colors.primary} />
            </View>
            <Text style={[styles.settingText, { color: Colors.primary }]}>Privacy & Security</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: Colors.border }]}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? Colors.background.card : '#F0E6FF' }]}>
              <FileText size={24} color={Colors.primary} />
            </View>
            <Text style={[styles.settingText, { color: Colors.primary }]}>Terms & Conditions</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: Colors.border }]}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? Colors.background.card : '#F0E6FF' }]}>
              <HelpCircle size={24} color={Colors.primary} />
            </View>
            <Text style={[styles.settingText, { color: Colors.primary }]}>Help & Support</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: Colors.border }]}
          onPress={handleLogout}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? Colors.background.card : '#F0E6FF' }]}>
              <LogOut size={24} color={Colors.primary} />
            </View>
            <Text style={[styles.settingText, { color: Colors.primary }]}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    fontSize: 18,
    fontWeight: '500',
  },
});