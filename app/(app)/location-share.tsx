import { create } from 'zustand';
import * as Location from 'expo-location';

// Define types
type LocationState = {
  currentLocation: Location.LocationObject | null;
  hasPermission: boolean | null;
  isTracking: boolean;
  isLoading: boolean; // Added isLoading property
  error: string | null;
};

type LocationActions = {
  requestPermission: () => Promise<void>;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  updateLocation: (location: Location.LocationObject) => void;
  setError: (error: string) => void;
};

// Create the store
export const useLocationStore = create<LocationState & LocationActions>((set) => {
  let locationSubscription: Location.LocationSubscription | null = null;

  return {
    // State
    currentLocation: null,
    hasPermission: null,
    isTracking: false,
    isLoading: false, // Initialize isLoading
    error: null,

    // Actions
    requestPermission: async () => {
      try {
        set({ isLoading: true }); // Set loading state
        const { status } = await Location.requestForegroundPermissionsAsync();
        set({ 
          hasPermission: status === 'granted',
          isLoading: false // Reset loading state
        });
      } catch (error) {
        set({ 
          error: 'Failed to request location permission',
          isLoading: false // Reset loading state
        });
      }
    },

    startTracking: async () => {
      try {
        set({ isLoading: true }); // Set loading state
        
        // Configure location accuracy
        await Location.setForegroundLocationAsync({
          accuracy: Location.Accuracy.High,
        });

        // Get initial location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        set({ currentLocation: location });

        // Start watching position
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 5,
          },
          (updatedLocation) => {
            set({ currentLocation: updatedLocation });
          }
        );

        set({ 
          isTracking: true,
          isLoading: false // Reset loading state
        });
      } catch (error) {
        set({ 
          error: 'Failed to start location tracking',
          isLoading: false // Reset loading state
        });
      }
    },

    stopTracking: () => {
      if (locationSubscription) {
        locationSubscription.remove();
        locationSubscription = null;
      }
      set({ isTracking: false });
    },

    updateLocation: (location) => {
      set({ currentLocation: location });
    },

    setError: (error) => {
      set({ error });
    },
  };
});