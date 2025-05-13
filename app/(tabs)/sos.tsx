import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore } from '@/store/locationStore';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import SOSButton from '@/components/SOSButton';
import * as Haptics from 'expo-haptics';

export default function SOSScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { getCurrentLocation } = useLocationStore();
  const [isActivated, setIsActivated] = useState(false);
  
  const handleSOSPress = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    setIsActivated(true);
    
    // Get current location
    await getCurrentLocation();
    
    // Show alert on web, navigate to location share on mobile
    if (Platform.OS === 'web') {
      Alert.alert(
        'SOS Activated',
        'Emergency contacts would be notified with your location in a real app.',
        [{ text: 'OK', onPress: () => setIsActivated(false) }]
      );
    } else {
      router.push('/location-share');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header showAvatar username={user?.username} showSettingsButton />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>SOS</Text>
        
        <View style={styles.buttonContainer}>
          <SOSButton onPress={handleSOSPress} />
        </View>
        
        {isActivated && (
          <Text style={styles.activatedText}>
            SOS activated! Sending your location to emergency contacts...
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginBottom: 48,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activatedText: {
    fontSize: 16,
    color: Colors.text.light,
    textAlign: 'center',
    marginBottom: 24,
  },
});