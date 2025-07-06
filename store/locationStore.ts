import { create } from 'zustand';
import { LocationData } from '@/types';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

interface LocationState {
  currentLocation: LocationData | null;
  isTracking: boolean;
  error: string | null;
  
  // Actions
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  getCurrentLocation: () => Promise<LocationData | null>;
  
  saveLocation: (location: LocationData) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  currentLocation: null,
  isTracking: false,
  error: null,
  
  startTracking: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        set({ error: 'Permission to access location was denied' });
        return;
      }
      
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
            get().saveLocation(locationData); // Auto-save when tracking
          }
        );
      } else {
        navigator.geolocation.watchPosition(
          (position) => {
            const locationData: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: new Date().toISOString(),
            };
            set({ currentLocation: locationData });
            get().saveLocation(locationData); // Auto-save when tracking
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
    set({ isTracking: false });
  },
  
  getCurrentLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        set({ error: 'Permission to access location was denied' });
        return null;
      }
      
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
  
  
  
  saveLocation: async (location) => {
    try {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;
      if (!userId) return;
      
      const { error } = await supabase
        .from('locations')
        .insert({
          user_id: userId,
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: location.timestamp
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  }
}));