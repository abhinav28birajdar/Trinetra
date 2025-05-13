import { create } from 'zustand';
import { LocationData } from '@/types';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

interface LocationState {
  currentLocation: LocationData | null;
  isTracking: boolean;
  error: string | null;
  
  // Actions
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  getCurrentLocation: () => Promise<LocationData | null>;
  shareLocation: (contactIds: string[]) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  currentLocation: null,
  isTracking: false,
  error: null,
  
  startTracking: async () => {
    try {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        set({ error: 'Permission to access location was denied' });
        return;
      }
      
      // Start watching position
      if (Platform.OS !== 'web') {
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (location) => {
            const locationData: LocationData = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              timestamp: new Date().toISOString(),
            };
            set({ currentLocation: locationData });
          }
        );
      } else {
        // Web fallback
        navigator.geolocation.watchPosition(
          (position) => {
            const locationData: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: new Date().toISOString(),
            };
            set({ currentLocation: locationData });
          },
          (error) => {
            set({ error: error.message });
          },
          { enableHighAccuracy: true }
        );
      }
      
      set({ isTracking: true, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to start tracking',
        isTracking: false 
      });
    }
  },
  
  stopTracking: () => {
    // In a real app, you would unsubscribe from location updates
    set({ isTracking: false });
  },
  
  getCurrentLocation: async () => {
    try {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        set({ error: 'Permission to access location was denied' });
        return null;
      }
      
      // Get current position
      const location = await Location.getCurrentPositionAsync({});
      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date().toISOString(),
      };
      
      set({ currentLocation: locationData, error: null });
      return locationData;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get location',
      });
      return null;
    }
  },
  
  shareLocation: async (contactIds) => {
    try {
      const location = await get().getCurrentLocation();
      if (!location) {
        throw new Error('Could not get current location');
      }
      
      // In a real app, this would send the location to the specified contacts
      // through Supabase or another service
      console.log(`Sharing location with contacts: ${contactIds.join(', ')}`);
      
      set({ error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to share location',
      });
    }
  },
}));