import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AlertTriangle, MapPin, Phone, Clock } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { Button } from '@/components/Button';
import { useSOSStore } from '@/store/sos-store';
import { useContactsStore } from '@/store/contacts-store';

export default function SOSScreen() {
  const router = useRouter();
  const { isActive, activatedAt, currentLocation, deactivateSOS } = useSOSStore();
  const { contacts } = useContactsStore();
  const [timeElapsed, setTimeElapsed] = useState('00:00');
  const [countdown, setCountdown] = useState(5);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // If SOS is not active, redirect to home
  useEffect(() => {
    if (!isActive) {
      router.replace('./(tabs)');
    }
  }, [isActive, router]);
  
  // Calculate time elapsed since SOS activation
  useEffect(() => {
    if (activatedAt) {
      const interval = setInterval(() => {
        const startTime = new Date(activatedAt).getTime();
        const now = new Date().getTime();
        const diff = now - startTime;
        
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        setTimeElapsed(
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [activatedAt]);
  
  // Handle cancel with countdown
  const handleCancel = () => {
    setIsCancelling(true);
    
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          deactivateSOS();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Handle cancel abort
  const handleCancelAbort = () => {
    setIsCancelling(false);
    setCountdown(5);
  };
  
  if (!isActive) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.alertHeader}>
          <AlertTriangle size={40} color={colors.danger} />
          <Text style={styles.alertTitle}>SOS Alert Active</Text>
          <View style={styles.timerContainer}>
            <Clock size={16} color={colors.danger} />
            <Text style={styles.timerText}>{timeElapsed}</Text>
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Your trusted contacts have been alerted with your current location.
          </Text>
          
          {currentLocation && (
            <View style={styles.locationContainer}>
              <MapPin size={20} color={colors.primary} />
              <Text style={styles.locationText}>
                {currentLocation.address || 
                  `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`}
              </Text>
            </View>
          )}
          
          <View style={styles.contactsContainer}>
            <Text style={styles.contactsTitle}>Contacts Notified:</Text>
            {contacts.map((contact: { id: React.Key | null | undefined; fullName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; relationship: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; isPrimary: any; }) => (
              <View key={contact.id} style={styles.contactItem}>
                <Text style={styles.contactName}>{contact.fullName}</Text>
                <Text style={styles.contactRelation}>({contact.relationship})</Text>
                {contact.isPrimary && (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryText}>Primary</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          {isCancelling ? (
            <View style={styles.cancellingContainer}>
              <Text style={styles.countdownText}>
                Cancelling in {countdown} seconds...
              </Text>
              <Button 
                title="Keep SOS Active"
                onPress={handleCancelAbort}
                variant="outline"
                style={styles.keepActiveButton}
              />
            </View>
          ) : (
            <Button 
              title="I'm Safe (Cancel SOS)"
              onPress={handleCancel}
              variant="success"
              size="large"
              fullWidth
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  alertHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  alertTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.danger,
    marginTop: 12,
    marginBottom: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
    marginLeft: 8,
  },
  infoContainer: {
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  locationText: {
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 12,
    flex: 1,
  },
  contactsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textDark,
  },
  contactRelation: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  primaryBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  primaryText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '500',
  },
  actionsContainer: {
    marginTop: 24,
  },
  cancellingContainer: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 16,
    color: colors.danger,
    fontWeight: '500',
    marginBottom: 16,
  },
  keepActiveButton: {
    marginTop: 8,
  },
});