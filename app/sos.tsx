import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Animated,
  Easing,
  Alert,
  ScrollView
} from "react-native";
import { router } from "expo-router";
import { Check, Volume2, VolumeX, MapPin, Phone } from "lucide-react-native";
import { Button as PaperButton } from "react-native-paper";
import Colors from "@/constants/colors";
import { useSOSStore } from "@/store/sos-store";
import { useContactsStore } from "@/store/contacts-store";
import { useSettingsStore } from "@/store/settings-store";
import * as Haptics from "expo-haptics";
import { Contact } from "@/types";

export default function SOSScreen() {
  const {
    isActive,
    countdown,
    location,
    activatedAt,
    notifiedContacts,
    sirenActive,
    decrementCountdown,
    deactivateSOS, // Use the correct action name from the store
    toggleSiren
  } = useSOSStore();

  const { contacts } = useContactsStore();
  const { settings } = useSettingsStore();

  const [displayCountdown, setDisplayCountdown] = useState(countdown);

  useEffect(() => {
      setDisplayCountdown(countdown);
  }, [countdown]);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isActive) {
      if (router.canGoBack()) {
          router.back();
      } else {
          router.replace("/");
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive || displayCountdown <= 0) return;

    const timerId = setInterval(() => {
      setDisplayCountdown(prev => (prev > 0 ? prev - 1 : 0));
      decrementCountdown();

      if (Platform.OS !== "web" && settings.vibrationEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }, 1000);

    return () => clearInterval(timerId);

  }, [isActive, displayCountdown, decrementCountdown, settings.vibrationEnabled]);

  useEffect(() => {
    if (!isActive || Platform.OS === 'web') return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [isActive, pulseAnim]);

  const notifiedContactDetails = (contacts || []).filter((contact: Contact) =>
    (notifiedContacts || []).includes(contact.id)
  );

  const formatTime = (timestamp: Date | null) => {
    if (!timestamp) return "N/A";
    try {
      return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const handleToggleSiren = () => {
    toggleSiren();
    if (Platform.OS !== 'web' && settings.vibrationEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleCancel = () => {
    deactivateSOS(); // Call the correct action
  };

  if (!isActive && !router.canGoBack()) {
      return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Animated.View style={[styles.sosIndicatorWrapper, Platform.OS !== 'web' && { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.sosIndicator}>
              <Text style={styles.sosText}>SOS</Text>
            </View>
          </Animated.View>

          <Text style={styles.title}>Emergency Mode Active</Text>
          <Text style={styles.subtitle}>
            Activated at {formatTime(activatedAt)}
          </Text>

          {displayCountdown > 0 && (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>
                Auto-cancel in: <Text style={styles.countdownNumber}>{displayCountdown}s</Text>
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
                Lat: {location.latitude.toFixed(5)}, Lon: {location.longitude.toFixed(5)}
              </Text>
            ) : (
              <Text style={styles.locationText}>Fetching location...</Text>
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
                    <Text style={styles.contactInitial}>{contact.name ? contact.name.charAt(0).toUpperCase() : '?'}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName} numberOfLines={1}>{contact.name}</Text>
                    <Text style={styles.contactRelation} numberOfLines={1}>{contact.relationship}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noContactsText}>No trusted contacts were found to notify.</Text>
          )}
        </View>

        <View style={styles.sirenControl}>
          <Text style={styles.sirenText}>Emergency Siren</Text>
          <TouchableOpacity
            style={styles.sirenToggle}
            onPress={handleToggleSiren}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
      </ScrollView>

      <View style={styles.footer}>
        <PaperButton
          mode="contained"
          onPress={handleCancel}
          style={[styles.safeButton, { backgroundColor: Colors.success }]}
          labelStyle={{ color: Colors.white, fontSize: 16, fontWeight: 'bold' }}
          icon={() => <Check size={24} color={Colors.white} />}
        >
          I'm Safe Now
        </PaperButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
      flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  sosIndicatorWrapper: {
      marginBottom: 16,
  },
  sosIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.danger,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  sosText: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  countdownContainer: {
    backgroundColor: Colors.danger + "1A",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  countdownText: {
    fontSize: 15,
    color: Colors.danger,
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
    marginLeft: 10,
  },
  locationInfo: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  contactsList: {
    gap: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  contactAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  contactRelation: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  noContactsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  sirenControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    padding: 6,
    borderRadius: 8,
  },
  sirenStatus: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  safeButton: {
    height: 56,
    borderRadius: 28,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});