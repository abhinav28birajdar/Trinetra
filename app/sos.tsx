import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Animated,
  Easing
} from "react-native";
import { router } from "expo-router";
import { Check, Volume2, VolumeX, MapPin, Phone } from "lucide-react-native";
import { Button } from "@/components/Button";
import Colors from "@/constants/colors";
import { useSOSStore } from "@/store/sos-store";
import { useContactsStore } from "@/store/contacts-store";
import { useSettingsStore } from "@/store/settings-store";
import * as Haptics from "expo-haptics";

export default function SOSScreen() {
  const { 
    isActive, 
    countdown, 
    location, 
    activatedAt, 
    notifiedContacts,
    decrementCountdown,
    cancelSOS 
  } = useSOSStore();
  
  const { contacts } = useContactsStore();
  const { settings } = useSettingsStore();
  
  const [sirenActive, setSirenActive] = useState(settings.sirenEnabled);
  const pulseAnim = new Animated.Value(1);
  
  // Redirect to home if SOS is not active
  useEffect(() => {
    if (!isActive) {
      router.replace("/");
    }
  }, [isActive]);
  
  // Countdown timer
  useEffect(() => {
    if (!isActive || countdown <= 0) return;
    
    const timer = setTimeout(() => {
      decrementCountdown();
      
      // Trigger haptic feedback on each countdown tick
      if (Platform.OS !== "web" && settings.vibrationEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, isActive]);
  
  // Pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.in(Easing.ease),
          useNativeDriver: Platform.OS !== "web",
        }),
      ])
    );
    
    pulse.start();
    
    return () => {
      pulse.stop();
    };
  }, []);
  
  // Get notified contacts
  const notifiedContactDetails = contacts.filter(contact => 
    notifiedContacts.includes(contact.id)
  );
  
  // Format activation time
  const formatTime = (timestamp: Date | null) => {
    if (!timestamp) return "";
    
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  
  const handleToggleSiren = () => {
    setSirenActive(!sirenActive);
  };
  
  const handleCancel = () => {
    cancelSOS();
    router.replace("/");
  };
  
  if (!isActive) {
    return null; // Will redirect to home
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {Platform.OS !== "web" ? (
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <View style={styles.sosIndicator}>
                <Text style={styles.sosText}>SOS</Text>
              </View>
            </Animated.View>
          ) : (
            <View style={styles.sosIndicator}>
              <Text style={styles.sosText}>SOS</Text>
            </View>
          )}
          
          <Text style={styles.title}>Emergency Mode Active</Text>
          
          {activatedAt && (
            <Text style={styles.subtitle}>
              Activated at {formatTime(activatedAt)}
            </Text>
          )}
          
          {countdown > 0 && (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>
                Auto-cancel in: <Text style={styles.countdownNumber}>{countdown}s</Text>
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <MapPin size={20} color={Colors.primary} />
            <Text style={styles.infoTitle}>Your Location</Text>
          </View>
          
          <View style={styles.locationInfo}>
            {location ? (
              <Text style={styles.locationText}>
                Latitude: {location.latitude.toFixed(6)}{"\n"}
                Longitude: {location.longitude.toFixed(6)}
              </Text>
            ) : (
              <Text style={styles.locationText}>Fetching your location...</Text>
            )}
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Phone size={20} color={Colors.primary} />
            <Text style={styles.infoTitle}>Notified Contacts</Text>
          </View>
          
          {notifiedContactDetails.length > 0 ? (
            <View style={styles.contactsList}>
              {notifiedContactDetails.map(contact => (
                <View key={contact.id} style={styles.contactItem}>
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactInitial}>{contact.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactRelation}>{contact.relationship}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noContactsText}>No contacts have been notified yet.</Text>
          )}
        </View>
        
        <View style={styles.sirenControl}>
          <Text style={styles.sirenText}>Emergency Siren</Text>
          <TouchableOpacity 
            style={styles.sirenToggle}
            onPress={handleToggleSiren}
          >
            {sirenActive ? (
              <Volume2 size={24} color={Colors.primary} />
            ) : (
              <VolumeX size={24} color={Colors.gray[500]} />
            )}
            <Text style={[
              styles.sirenStatus,
              { color: sirenActive ? Colors.primary : Colors.gray[500] }
            ]}>
              {sirenActive ? "ON" : "OFF"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button
          title="I'm Safe Now"
          variant="success"
          size="large"
          leftIcon={<Check size={24} color={Colors.white} />}
          onPress={handleCancel}
          style={styles.safeButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  sosIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  sosText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  countdownContainer: {
    backgroundColor: Colors.accent + "20",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  countdownText: {
    fontSize: 16,
    color: Colors.accent,
    fontWeight: "500",
  },
  countdownNumber: {
    fontWeight: "bold",
  },
  infoSection: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
  },
  locationInfo: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  contactsList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.tertiary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactInitial: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  noContactsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  sirenControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sirenText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  sirenToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sirenStatus: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    padding: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  safeButton: {
    height: 56,
  },
});