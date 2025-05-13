import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore } from '@/store/locationStore';
import Colors from '@/constants/colors';
import Header from '@/components/Header';

export default function LocationScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { currentLocation, startTracking, error } = useLocationStore();
  const [mapUrl, setMapUrl] = useState('');
  
  useEffect(() => {
    startTracking();
  }, []);
  
  useEffect(() => {
    if (currentLocation) {
      // Create a Google Maps static image URL
      const { latitude, longitude } = currentLocation;
      const zoom = 15;
      const size = '400x400';
      const marker = `color:red|${latitude},${longitude}`;
      
      setMapUrl(`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${size}&markers=${marker}`);
    }
  }, [currentLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header showAvatar username={user?.username} showSettingsButton />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Live Location</Text>
        
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.mapContainer}>
            {Platform.OS === 'web' ? (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.2683010445114!2d-79.38922492346177!3d43.64266905260046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34d68bf33a9b%3A0x15edd8c4de1c7581!2sCN%20Tower!5e0!3m2!1sen!2sca!4v1699887818959!5m2!1sen!2sca"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: 20 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <View style={styles.mapPlaceholder}>
                <Text style={styles.mapPlaceholderText}>
                  {currentLocation 
                    ? `Lat: ${currentLocation.latitude.toFixed(6)}, Lng: ${currentLocation.longitude.toFixed(6)}` 
                    : 'Getting location...'}
                </Text>
              </View>
            )}
          </View>
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
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginBottom: 24,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: Colors.text.dark,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.light,
    textAlign: 'center',
  },
});