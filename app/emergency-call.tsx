import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { supabase } from '../lib/supabase';
import { useAuth } from '../store/auth';

export default function EmergencyCallScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const contactId = params.contactId as string;
  const contactName = params.contactName as string;
  const contactPhone = params.contactPhone as string;
  
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimerId, setCallTimerId] = useState<NodeJS.Timer | null>(null);

  useEffect(() => {
    // Vibrate phone to indicate emergency mode
    if (Platform.OS === 'android') {
      const pattern = [0, 500, 200, 500];
      Vibration.vibrate(pattern, true);
    } else {
      Vibration.vibrate([0, 500, 200, 500, 200, 500]);
    }

    // Start call immediately
    initiateCall();

    // Cleanup function
    return () => {
      if (callTimerId) {
        clearInterval(callTimerId);
      }
      Vibration.cancel();
    };
  }, []);

  const initiateCall = async () => {
    try {
      // Open phone dialer with the contact's number
      const supported = await Linking.canOpenURL(`tel:${contactPhone}`);
      
      if (supported) {
        await Linking.openURL(`tel:${contactPhone}`);
        setIsCallInProgress(true);
        
        // Log the call
        if (user) {
          await supabase.from('call_logs').insert({
            user_id: user.id,
            contact_id: contactId,
            phone_number: contactPhone,
            contact_name: contactName,
            call_type: 'emergency',
            is_emergency: true,
          });
        }
        
        // Start timer
        const timer = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        setCallTimerId(timer);
      } else {
        Alert.alert('Error', 'Phone calls are not supported on this device');
        router.back();
      }
    } catch (error) {
      console.error('Error initiating call:', error);
      Alert.alert('Error', 'Failed to initiate call');
      router.back();
    }
  };

  const endCall = () => {
    if (callTimerId) {
      clearInterval(callTimerId);
    }
    setIsCallInProgress(false);
    router.navigate('/(tabs)');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={['#DC2626', '#B91C1C', '#991B1B']}
        style={styles.header}
      >
        <View style={styles.emergencyBadge}>
          <Text style={styles.emergencyText}>EMERGENCY</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.contactInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {contactName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.contactName, { color: theme.colors.text }]}>
            {contactName}
          </Text>
          <Text style={[styles.phoneNumber, { color: theme.colors.textSecondary }]}>
            {contactPhone}
          </Text>
          {isCallInProgress && (
            <Text style={styles.callStatus}>
              Call in progress • {formatTime(callDuration)}
            </Text>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={endCall}
          >
            <Ionicons name="call" size={28} color="white" style={{ transform: [{ rotate: '135deg' }] }} />
            <Text style={styles.endCallText}>End Call</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.additionalActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
            onPress={() => router.push('/sos')}
          >
            <Ionicons name="warning" size={24} color="white" />
            <Text style={styles.actionText}>SOS Alert</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#10B981' }]}
            onPress={() => router.push('/(tabs)/live-location')}
          >
            <Ionicons name="location" size={24} color="white" />
            <Text style={styles.actionText}>Share Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  emergencyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  emergencyText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  contactInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  contactName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 16,
    marginBottom: 12,
  },
  callStatus: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 40,
  },
  endCallButton: {
    backgroundColor: '#DC2626',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  endCallText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  additionalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    width: '48%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 8,
  },
});
