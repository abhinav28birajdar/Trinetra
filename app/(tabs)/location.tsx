import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore } from '@/store/locationStore';
import { useColors } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import Header from '@/components/Header';
// Conditional import for react-native-maps
let MapView: any = View; // Default to View for web if react-native-maps is not used or for SSR
let Marker: any = View;
if (Platform.OS === 'android' || Platform.OS === 'ios') {
  try {
    const RNM = require('react-native-maps');
    MapView = RNM.default;
    Marker = RNM.Marker;
  } catch (e) {
    console.warn("react-native-maps not found. Map will not be rendered on native.");
  }
}

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function LocationScreen() {
  const router = useRouter();
  const Colors = useColors();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const { currentLocation, startTracking, stopTracking, error: locationError, isTracking } = useLocationStore();
  
  const mapRef = useRef<any>(null); // For react-native-maps instance

  useEffect(() => {
    startTracking();
    return () => {
      // Optionally stop tracking when screen is unmounted,
      // or manage tracking state globally if it should persist across screens.
      // stopTracking(); 
    };
  }, []);

  useEffect(() => {
    if (currentLocation && mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }, 1000); // Animate over 1 second
    }
  }, [currentLocation]);

  const getWebMapUrl = () => {
    if (currentLocation) {
      return `https://maps.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}&hl=es;z=14&&output=embed`;
    }
    // Fallback to a default location if current location is not available
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.2683010445114!2d-79.38922492346177!3d43.64266905260046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34d68bf33a9b%3A0x15edd8c4de1c7581!2sCN%20Tower!5e0!3m2!1sen!2sca!4v1699887818959!5m2!1sen!2sca";
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.primary }]}>
      <View style={[styles.headerWrapper, { backgroundColor: Colors.primary }]}>
        <Header showAvatar showSettingsButton isDarkMode={isDarkMode} />
      </View>
      
      <View style={[styles.content, { backgroundColor: Colors.background.primary }]}>
        <Text style={[styles.title, { color: Colors.primary }]}>Live Location</Text>
        
        {locationError ? (
          <View style={styles.messageContainer}>
            <Text style={[styles.messageText, { color: Colors.status.error }]}>{locationError}</Text>
            <Text style={[styles.messageText, { color: Colors.text.secondary, marginTop: 10 }]}>
              Please ensure location services are enabled for this app in your device settings.
            </Text>
          </View>
        ) : !currentLocation && isTracking ? (
          <View style={styles.messageContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={[styles.messageText, { color: Colors.text.dark, marginTop: 10 }]}>
              Acquiring location...
            </Text>
          </View>
        ) : Platform.OS === 'web' ? (
          <View style={styles.mapContainer}>
            <iframe
              src={getWebMapUrl()}
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: 12 }} // Match native border radius
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </View>
        ) : MapView && Marker && currentLocation ? ( // Check if MapView and Marker are available (native)
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
              showsUserLocation={true} // Shows the default blue dot for user location
              // customMapStyle={isDarkMode ? mapDarkStyle : mapLightStyle} // Optional: custom map styles
            >
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="Your Location"
                description={`Lat: ${currentLocation.latitude.toFixed(4)}, Lng: ${currentLocation.longitude.toFixed(4)}`}
                pinColor={Colors.primary} // Use theme color for marker
              />
            </MapView>
          </View>
        ) : (
            <View style={styles.messageContainer}>
              <Text style={[styles.messageText, { color: Colors.text.dark }]}>
                Map is unavailable or location not found.
              </Text>
            </View>
        )}
      </View>
    </View>
  );
}

// Optional: Define dark/light map styles for native maps
// const mapDarkStyle = [ /* ... JSON for dark map style ... */ ];
// const mapLightStyle = [ /* ... JSON for light map style ... */ ];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    paddingTop: Platform.OS === 'ios' ? 40 : 30,
    paddingBottom: 10,
    // backgroundColor set by hook
  },
  content: {
    flex: 1,
    paddingHorizontal: 0, // Map can be edge-to-edge
    paddingBottom: Platform.OS === 'web' ? 0 : 20, // No padding for web iframe container
    borderTopLeftRadius: 20, // Consistent styling
    borderTopRightRadius: 20,
    overflow: 'hidden', // Clip map to rounded corners
  },
  title: {
    fontSize: 22, // Adjusted size
    fontWeight: 'bold',
    marginVertical: 16, // Add vertical margin
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    borderRadius: Platform.OS === 'web' ? 0 : 12, // Rounded corners for native map view
    overflow: 'hidden', // Important for borderRadius on native MapView
    marginHorizontal: Platform.OS === 'web' ? 0 : 16, // Add horizontal margin for native map
    marginBottom: Platform.OS === 'web' ? 0 : 16, // Add bottom margin for native map
    // backgroundColor: '#E0E0E0', // Fallback for map loading
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
  },
});