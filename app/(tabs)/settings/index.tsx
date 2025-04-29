import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import {
  Bell,
  Moon,
  Globe,
  Volume2,
  Vibrate,
  Clock,
  ChevronRight
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useSettingsStore } from "@/store/settings-store";

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettingsStore();
  
  const handleToggleSetting = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
  };
  
  const languageOptions = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" }
  ];
  
  const getLanguageName = (code: string) => {
    const language = languageOptions.find(lang => lang.code === code);
    return language ? language.name : "Unknown";
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          <View style={styles.settingItem}>
            <View style={[styles.settingIcon, { backgroundColor: Colors.primary + "20" }]}>
              <Bell size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive alerts and updates
              </Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => handleToggleSetting("notifications", value)}
              trackColor={{ false: Colors.gray[300], true: Colors.primary + "80" }}
              thumbColor={settings.notifications ? Colors.primary : Colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={[styles.settingIcon, { backgroundColor: Colors.secondary + "20" }]}>
              <Moon size={20} color={Colors.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Theme</Text>
              <Text style={styles.settingDescription}>
                {settings.theme === "light" ? "Light" : settings.theme === "dark" ? "Dark" : "System Default"}
              </Text>
            </View>
            <TouchableOpacity style={styles.settingAction}>
              <ChevronRight size={20} color={Colors.gray[400]} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingItem}>
            <View style={[styles.settingIcon, { backgroundColor: Colors.info + "20" }]}>
              <Globe size={20} color={Colors.info} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Language</Text>
              <Text style={styles.settingDescription}>
                {getLanguageName(settings.language)}
              </Text>
            </View>
            <TouchableOpacity style={styles.settingAction}>
              <ChevronRight size={20} color={Colors.gray[400]} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={[styles.settingIcon, { backgroundColor: Colors.success + "20" }]}>
              <MapPin size={20} color={Colors.success} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Location Sharing</Text>
              <Text style={styles.settingDescription}>
                Share location during emergencies
              </Text>
            </View>
            <Switch
              value={settings.locationSharing}
              onValueChange={(value) => handleToggleSetting("locationSharing", value)}
              trackColor={{ false: Colors.gray[300], true: Colors.primary + "80" }}
              thumbColor={settings.locationSharing ? Colors.primary : Colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={[styles.settingIcon, { backgroundColor: Colors.danger + "20" }]}>
              <Volume2 size={20} color={Colors.danger} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Emergency Siren</Text>
              <Text style={styles.settingDescription}>
                Play siren during SOS
              </Text>
            </View>
            <Switch
              value={settings.sirenEnabled}
              onValueChange={(value) => handleToggleSetting("sirenEnabled", value)}
              trackColor={{ false: Colors.gray[300], true: Colors.primary + "80" }}
              thumbColor={settings.sirenEnabled ? Colors.primary : Colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={[styles.settingIcon, { backgroundColor: Colors.warning + "20" }]}>
              <Vibrate size={20} color={Colors.warning} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Vibration</Text>
              <Text style={styles.settingDescription}>
                Vibrate during emergencies
              </Text>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) => handleToggleSetting("vibrationEnabled", value)}
              trackColor={{ false: Colors.gray[300], true: Colors.primary + "80" }}
              thumbColor={settings.vibrationEnabled ? Colors.primary : Colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={[styles.settingIcon, { backgroundColor: Colors.info + "20" }]}>
              <Clock size={20} color={Colors.info} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>SOS Countdown</Text>
              <Text style={styles.settingDescription}>
                {settings.sosCountdownDuration} seconds
              </Text>
            </View>
            <TouchableOpacity style={styles.settingAction}>
              <ChevronRight size={20} color={Colors.gray[400]} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingItem}>
            <View style={[styles.settingIcon, { backgroundColor: Colors.secondary + "20" }]}>
              <AlertTriangle size={20} color={Colors.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Auto SOS</Text>
              <Text style={styles.settingDescription}>
                Automatically activate SOS in certain situations
              </Text>
            </View>
            <Switch
              value={settings.autoSOS}
              onValueChange={(value) => handleToggleSetting("autoSOS", value)}
              trackColor={{ false: Colors.gray[300], true: Colors.primary + "80" }}
              thumbColor={settings.autoSOS ? Colors.primary : Colors.white}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutCard}>
            <Text style={styles.appName}>SheSafe</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              SheSafe is a personal safety app designed to help women feel safer by providing quick access to emergency services and trusted contacts.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { AlertTriangle, MapPin } from "lucide-react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  settingAction: {
    padding: 4,
  },
  aboutCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 20,
  }
});