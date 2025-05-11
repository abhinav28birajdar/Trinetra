import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Switch,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Settings as SettingsIcon,
  Moon,
  Bell,
  Lock,
  FileText,
  HelpCircle,
  LogOut,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();
  
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <ArrowLeft size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <SettingsIcon size={24} color={Colors.white} />
          <Text style={styles.headerTitle}>Setting</Text>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Moon size={24} color={Colors.primary} />
            <Text style={styles.settingText}>Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: Colors.gray, true: Colors.primaryLight }}
            thumbColor={darkMode ? Colors.primary : Colors.white}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Bell size={24} color={Colors.primary} />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: Colors.gray, true: Colors.primaryLight }}
            thumbColor={notifications ? Colors.primary : Colors.white}
          />
        </View>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Lock size={24} color={Colors.primary} />
            <Text style={styles.settingText}>Privacy & Security</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <FileText size={24} color={Colors.primary} />
            <Text style={styles.settingText}>Terms & Conditions</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <HelpCircle size={24} color={Colors.primary} />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleLogout}
        >
          <View style={styles.settingLeft}>
            <LogOut size={24} color={Colors.primary} />
            <Text style={styles.settingText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
});