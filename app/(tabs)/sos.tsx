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
import { Button } from '@/components/Button';
import Colors from '@/constants/colors';
import { router } from 'expo-router';

export default function SOSScreen() {
  const { isActive, sirenActive, toggleSiren, deactivateSOS, location, activationTime, contactsNotified } = useSOSStore();
  const { contacts } = useContactsStore();
  const [countdown, setCountdown] = useState(30);
  
  // Redirect to home if SOS is not active
  useEffect(() => {
    if (!isActive) {
      router.replace('/');
    }
  }, [isActive]);
  
  // Countdown timer
  useEffect(() => {
    if (!isActive || countdown <= 0) return;
    
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, isActive]);
  
  // Get notified contacts
  const notifiedContacts = contacts.filter(contact => 
    contactsNotified.includes(contact.id)
  );
  
  // Format activation time
  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!isActive) {
    return null; // Will redirect to home
  }
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>🚨 SOS Activated</Text>
          <Text style={styles.subtitle}>Help is on the way</Text>
          
          {activationTime && (
            <Text style={styles.activationTime}>
              Activated at {formatTime(activationTime)}
            </Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Shared With:</Text>
          
          {notifiedContacts.length > 0 ? (
            <View style={styles.contactsList}>
              {notifiedContacts.map(contact => (
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
            <Text style={styles.noContacts}>No contacts have been notified yet.</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sirenControl}>
            <Text style={styles.sectionTitle}>Emergency Siren:</Text>
            <TouchableOpacity 
              style={styles.sirenToggle}
              onPress={toggleSiren}
            >
              {sirenActive ? (
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
        </View>
        
        <View style={styles.section}>
          <Text style={styles.countdownLabel}>
            Auto-cancel in: <Text style={styles.countdown}>{countdown}s</Text>
          </Text>
          <Text style={styles.countdownInfo}>
            SOS will remain active until you cancel it or the timer expires.
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="I'm Safe Now"
          variant="success"
          size="large"
          leftIcon={<Check size={24} color={Colors.white} />}
          onPress={deactivateSOS}
          style={styles.safeButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Space for the footer
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
  },
  activationTime: {
    fontSize: 14,
    color: Colors.subtext,
  },
  section: {
    marginBottom: 24,
    backgroundColor: Colors.gray[100],
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  contactsList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInitial: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  contactRelation: {
    fontSize: 14,
    color: Colors.subtext,
  },
  noContacts: {
    color: Colors.subtext,
    textAlign: 'center',
    padding: 12,
  },
  sirenControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sirenToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sirenStatus: {
    fontSize: 16,
    fontWeight: 'bold',
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
  },
  countdownInfo: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  safeButton: {
    height: 56,
  },
});