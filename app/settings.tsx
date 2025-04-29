import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Switch,
  TouchableOpacity
} from 'react-native';
import { Stack } from 'expo-router';
import { useSettingsStore } from '@/store/settings-store';
import Colors from '@/constants/colors';
import { 
  Volume2, 
  Phone, 
  Globe, 
  PhoneCall,
  ChevronRight
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettingsStore();
  
  const toggleSetting = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };
  
  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
  ];
  
  const getLanguageName = (code: string) => {
    const language = languageOptions.find(lang => lang.code === code);
    return language ? language.name : 'Unknown';
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen 
        options={{
          title: 'App Settings',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }} 
      />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Volume2 size={20} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>SOS Siren</Text>
            <Text style={styles.settingDescription}>
              Play a loud siren when SOS is activated
            </Text>
          </View>
          <Switch
            value={settings.enableSiren}
            onValueChange={() => toggleSetting('enableSiren')}
            trackColor={{ false: Colors.gray[300], true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Phone size={20} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Auto-call Primary Contact</Text>
            <Text style={styles.settingDescription}>
              Automatically call your primary contact when SOS is activated
            </Text>
          </View>
          <Switch
            value={settings.autoCallPrimaryContact}
            onValueChange={() => toggleSetting('autoCallPrimaryContact')}
            trackColor={{ false: Colors.gray[300], true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Globe size={20} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>App Language</Text>
            <Text style={styles.settingDescription}>
              {getLanguageName(settings.language)}
            </Text>
          </View>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <PhoneCall size={20} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Fake Call</Text>
            <Text style={styles.settingDescription}>
              Enable fake call feature to get out of uncomfortable situations
            </Text>
          </View>
          <Switch
            value={settings.enableFakeCall}
            onValueChange={() => toggleSetting('enableFakeCall')}
            trackColor={{ false: Colors.gray[300], true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.aboutCard}>
          <Text style={styles.appName}>SheSafe Safety App</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            SheSafe is a personal safety app designed to help women feel safer by providing quick access to emergency services and trusted contacts.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[100],
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.subtext,
  },
  aboutCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  appVersion: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 12,
    textAlign: 'center',
  },
  appDescription: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    textAlign: 'center',
  },
});