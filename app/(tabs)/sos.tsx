import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from 'react-native';
import { Check, Volume2, VolumeX } from 'lucide-react-native';
import { useSOSStore } from '@/store/sos-store';
import { useContactsStore } from '@/store/contacts-store';
// import { Button } from '@/components/Button'; // Your custom button
import { Button as PaperButton } from 'react-native-paper'; // Using Paper button as example
import Colors from '@/constants/colors';
import { router, Href } from 'expo-router';
import { Contact } from '@/types'; // Import Contact type

export default function SOSScreen() {
  // Destructure state and actions using the CORRECT names from the updated store
  const {
    isActive,
    sirenActive,    // Now exists in store state
    toggleSiren,    // Now exists in store actions
    deactivateSOS,  // Now exists in store actions (renamed from cancelSOS)
    location,
    activatedAt,    // Correct state name
    notifiedContacts // Correct state name (array of IDs)
  } = useSOSStore();

  // Get full contact details from the contacts store
  const { contacts } = useContactsStore();

  // Local state for the visual countdown display in this component
  const { countdown: storeCountdown, decrementCountdown } = useSOSStore();
  const [displayCountdown, setDisplayCountdown] = useState(storeCountdown);

  // Effect to update local countdown based on store changes (e.g., reset)
  useEffect(() => {
    setDisplayCountdown(storeCountdown);
  }, [storeCountdown]);

  // Redirect to home if SOS is not active
  useEffect(() => {
    if (!isActive) {
      if (router.canGoBack()) {
         router.back();
      } else {
         router.replace('/'); // Or appropriate landing screen
      }
    }
  }, [isActive]);

  // Countdown timer effect for the UI
  useEffect(() => {
    if (!isActive || displayCountdown <= 0) return;

    const timerId = setInterval(() => {
      // Update local display countdown
      setDisplayCountdown(prev => (prev > 0 ? prev - 1 : 0));
      // Optionally decrement store countdown too if it's meant to reflect UI
      // decrementCountdown(); // Uncomment if store countdown should also tick down
    }, 1000);

    // Optional: Auto-deactivate when UI timer reaches 0
    // This logic might be better handled within the store based on its countdown
    // if (displayCountdown === 0) {
    //    console.log("Countdown reached zero, deactivating SOS from component.");
    //    deactivateSOS();
    // }

    return () => clearInterval(timerId); // Clear interval on unmount or dependency change

  }, [displayCountdown, isActive]); // Rerun if countdown or active status changes


  // Get notified contacts' full details
  const notifiedContactDetails = (contacts || []).filter((contact: Contact) =>
    (notifiedContacts || []).includes(contact.id) // Use correct state name
  );

  // Format activation time (Accepts Date | null)
  const formatTime = (date: Date | null): string => {
    if (!date) return 'N/A';
    try {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        console.error("Error formatting date:", e);
        return 'Invalid Date';
    }
  };

  // Prevent rendering if not active (redirect should handle this, but good practice)
  if (!isActive) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>🚨 SOS Activated</Text>
          <Text style={styles.subtitle}>Sharing location & notifying contacts</Text>
          <Text style={styles.activationTime}>
            Activated at {formatTime(activatedAt)} {/* Use correct state name */}
          </Text>
        </View>

        {/* Notified Contacts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notified Contacts:</Text>
          {notifiedContactDetails.length > 0 ? (
            <View style={styles.contactsList}>
              {notifiedContactDetails.map(contact => (
                <View key={contact.id} style={styles.contactItem}>
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactInitial}>{contact.name ? contact.name.charAt(0).toUpperCase() : '?'}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName} numberOfLines={1}>{contact.name || 'Unknown'}</Text>
                    <Text style={styles.contactRelation} numberOfLines={1}>{contact.relationship || 'N/A'}</Text>
                  </View>
                  {/* Maybe add a status icon (e.g., checkmark if acknowledged)? */}
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noContacts}>No trusted contacts were found to notify.</Text>
          )}
        </View>

        {/* Siren Control Section */}
        <View style={styles.section}>
          <View style={styles.sirenControl}>
            <Text style={styles.sectionTitle}>Emergency Siren:</Text>
            <TouchableOpacity
              style={styles.sirenToggle}
              onPress={toggleSiren} // Use action from store
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {sirenActive ? ( // Use state from store
                <Volume2 size={24} color={Colors.secondary} />
              ) : (
                <VolumeX size={24} color={Colors.gray[500]} />
              )}
              <Text style={[
                styles.sirenStatus,
                { color: sirenActive ? Colors.secondary : Colors.gray[500] }
              ]}>
                {sirenActive ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>
           {/* Optional: Add info text about siren */}
           <Text style={styles.sirenInfo}>
                {sirenActive
                  ? "Siren is active. Mute if needed."
                  : "Siren is off. Tap icon to activate."}
           </Text>
        </View>

        {/* Countdown Section - Shows local display countdown */}
        <View style={styles.section}>
          <Text style={styles.countdownLabel}>
            Time since activation: {/* Or show countdown if relevant */}
            <Text style={styles.countdown}>{/* {displayCountdown}s */} TBD</Text>
          </Text>
          <Text style={styles.countdownInfo}>
            SOS remains active until manually cancelled. Location is updated periodically.
          </Text>
        </View>

         {/* Location Info (Optional) */}
         <View style={styles.section}>
             <Text style={styles.sectionTitle}>Current Location:</Text>
             {location ? (
                 <Text style={styles.locationText}>
                     Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
                 </Text>
             ) : (
                 <Text style={styles.locationText}>Fetching location...</Text>
             )}
         </View>

      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
         <PaperButton
           mode="contained"
           onPress={deactivateSOS} // Use action from store
           style={[styles.safeButton, { backgroundColor: Colors.success }]}
           labelStyle={{ color: Colors.white }}
           icon={() => <Check size={24} color={Colors.white} />}
         >
           I'm Safe Now (Cancel SOS)
         </PaperButton>
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background, // Use background color
      },
      contentContainer: {
        padding: 16,
        paddingBottom: 120, // More space for the footer
      },
      header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: Platform.OS === 'ios' ? 0 : 16,
      },
      title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.danger, // Use danger color for SOS title
        marginBottom: 8,
        textAlign: 'center',
      },
      subtitle: {
        fontSize: 16, // Slightly smaller subtitle
        color: Colors.textSecondary,
        marginBottom: 8,
        textAlign: 'center',
      },
      activationTime: {
        fontSize: 14,
        color: Colors.subtext,
        textAlign: 'center',
      },
      section: {
        marginBottom: 20, // Slightly less margin between sections
        backgroundColor: Colors.white, // Use white for section background
        borderRadius: 12,
        padding: 16,
        // Add subtle shadow
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
      },
      contactsList: {
        gap: 10, // Slightly less gap
      },
      contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray[50], // Lighter background for item
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
      },
      contactAvatar: {
        width: 36, // Smaller avatar
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.secondary, // Use secondary color
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      },
      contactInitial: {
        color: Colors.white,
        fontSize: 16, // Smaller initial
        fontWeight: 'bold',
      },
      contactInfo: {
        flex: 1,
      },
      contactName: {
        fontSize: 15, // Slightly smaller name
        fontWeight: '600',
        color: Colors.text,
      },
      contactRelation: {
        fontSize: 13, // Smaller relationship text
        color: Colors.subtext,
      },
      noContacts: {
        color: Colors.subtext,
        textAlign: 'center',
        paddingVertical: 16, // More padding
        fontSize: 14,
      },
      sirenControl: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8, // Add margin below control row
      },
      sirenToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        borderRadius: 8,
      },
      sirenStatus: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      sirenInfo: { // Style for the info text below siren control
          fontSize: 13,
          color: Colors.subtext,
          marginTop: 4,
      },
      countdownLabel: {
        fontSize: 16,
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 8,
      },
      countdown: {
        fontWeight: 'bold',
        color: Colors.secondary,
        fontSize: 18,
      },
      countdownInfo: {
        fontSize: 14,
        color: Colors.subtext,
        textAlign: 'center',
        lineHeight: 20, // Improve readability
      },
      locationText: {
          fontSize: 14,
          color: Colors.textSecondary,
          textAlign: 'center',
      },
      footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.gray[200],
      },
      safeButton: {
        height: 56,
        justifyContent: 'center',
        borderRadius: 28, // Make button rounded
         // Add shadow to button
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
      },
});