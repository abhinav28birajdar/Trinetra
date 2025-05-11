import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Location as LocationType } from '@/types';

interface LocationState {
  currentLocation: LocationType | null;
  isTracking: boolean;
  hasPermission: boolean | null;
  error: string | null;
  
  requestPermission: () => Promise<void>;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  shareLocation: (contactId: string) => Promise<void>;
  clearError: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      currentLocation: null,
      isTracking: false,
      hasPermission: null,
      error: null,
      
      requestPermission: async () => {
        try {
          set({ error: null });
          
          if (Platform.OS === 'web') {
            set({ hasPermission: true });
            return;
          }
          
          const { status } = await Location.requestForegroundPermissionsAsync();
          set({ hasPermission: status === 'granted' });
          
          if (status !== 'granted') {
            throw new Error('Permission to access location was denied');
          }
        } catch (error: any) {
          set({ error: error.message, hasPermission: false });
        }
      },
      
      startTracking: async () => {
        try {
          set({ error: null });
          
          if (!get().hasPermission) {
            await get().requestPermission();
          }
          
          if (!get().hasPermission) {
            throw new Error('Location permission not granted');
          }
          
          // Get initial location
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          
          set({
            currentLocation: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              timestamp: location.timestamp,
            },
            isTracking: true,
          });
          
          // Start watching position
          Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 5000,
              distanceInterval: 10,
            },
            (location) => {
              set({
                currentLocation: {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  timestamp: location.timestamp,
                },
              });
            }
          );
        } catch (error: any) {
          set({ error: error.message, isTracking: false });
        }
      },
      
      stopTracking: () => {
        set({ isTracking: false });
      },
      
      shareLocation: async (contactId) => {
        try {
          set({ error: null });
          
          const { data: session } = await supabase.auth.getSession();
          if (!session.session) throw new Error('Not authenticated');
          
          const location = get().currentLocation;
          if (!location) throw new Error('Location not available');
          
          const { error } = await supabase
            .from('location_shares')
            .insert({
              user_id: session.session.user.id,
              contact_id: contactId,
              latitude: location.latitude,
              longitude: location.longitude,
              created_at: new Date().toISOString(),
            });
            
          if (error) throw error;
        } catch (error: any) {
          set({ error: error.message });
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasPermission: state.hasPermission,
        currentLocation: state.currentLocation,
      }),
    }
  )
);