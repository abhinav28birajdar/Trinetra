import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useLocationStore } from '@/store/locationStore';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';

// Only import MapView on native platforms
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch (error) {
    console.error('Failed to load react-native-maps:', error);
  }
}

export default function LocationScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    currentLocation, 
    hasPermission, 
    isTracking,
    error,
    requestPermission,
    startTracking,
    stopTracking,
  } = useLocationStore();
  
  const [mapReady, setMapReady] = useState(false);
  
  useEffect(() => {
    const checkPermission = async () => {
      if (hasPermission === null) {
        await requestPermission();
      }
      
      if (hasPermission && !isTracking) {
        startTracking();
      }
    };
    
    checkPermission();
    
    return () => {
      if (isTracking) {
        stopTracking();
      }
    };
  }, [hasPermission]);
  
  const handleShareLocation = () => {
    router.push('/location-share');
  };
  
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
            style={styles.avatar}
          />
          <Text style={styles.headerTitle}>Live Location</Text>
        </View>
        
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Location permission is required to use this feature.
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!currentLocation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
            style={styles.avatar}
          />
          <Text style={styles.headerTitle}>Live Location</Text>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
          style={styles.avatar}
        />
        <Text style={styles.headerTitle}>Live Location</Text>
      </View>
      
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <View style={styles.webMapContainer}>
            <Image
              source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${currentLocation.latitude},${currentLocation.longitude}&zoom=14&size=600x400&markers=color:red%7C${currentLocation.latitude},${currentLocation.longitude}&key=YOUR_API_KEY` }}
              style={styles.staticMap}
              resizeMode="cover"
            />
            <Text style={styles.webLocationText}>
              Your location: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </Text>
          </View>
        ) : MapView ? (
          <MapView
            style={styles.map}
            provider="google"
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            region={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onMapReady={() => setMapReady(true)}
          >
            {mapReady && Marker && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="Your Location"
              />
            )}
          </MapView>
        ) : (
          // Fallback if MapView couldn't be loaded
          <View style={styles.webMapContainer}>
            <Text style={styles.webLocationText}>
              Your location: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </Text>
            <Text style={styles.errorText}>
              Map could not be loaded. Please check your installation.
            </Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.shareButton}
        onPress={handleShareLocation}
      >
        <Text style={styles.shareButtonText}>Share Location</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  mapContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  staticMap: {
    width: '100%',
    height: '100%',
  },
  webMapContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webLocationText: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
    fontSize: 14,
  },
  errorText: {
    color: Colors.error,
    marginTop: 10,
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.text,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.text,
  },
  shareButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shareButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});