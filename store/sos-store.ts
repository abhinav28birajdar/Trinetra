import { create } from "zustand";
import { SOSState } from "@/types";
import { useContactsStore } from "./contacts-store";
import { useSettingsStore } from "./settings-store";
import * as Location from "expo-location";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

interface SOSStore extends SOSState {
  initiateSOS: () => Promise<void>;
  cancelSOS: () => void;
  updateLocation: () => Promise<void>;
  decrementCountdown: () => void;
  resetCountdown: () => void;
}

export const useSOSStore = create<SOSStore>((set, get) => ({
  isActive: false,
  countdown: 5, // Default countdown in seconds
  location: null,
  activatedAt: null,
  notifiedContacts: [],
  
  initiateSOS: async () => {
    try {
      // Get settings
      const { settings } = useSettingsStore.getState();
      
      // Set countdown from settings
      set({ countdown: settings.sosCountdownDuration });
      
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        console.error("Location permission denied");
        return;
      }
      
      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      
      // Trigger haptic feedback if enabled and on a supported platform
      if (settings.vibrationEnabled && Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      
      // Activate SOS
      set({
        isActive: true,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        activatedAt: new Date(),
      });
      
      // Start location updates
      get().updateLocation();
      
      // Get trusted contacts
      const trustedContacts = useContactsStore.getState().getTrustedContacts();
      
      // In a real app, this would send notifications to trusted contacts
      set({
        notifiedContacts: trustedContacts.map(contact => contact.id)
      });
      
    } catch (error) {
      console.error("Error initiating SOS:", error);
    }
  },
  
  cancelSOS: () => {
    set({
      isActive: false,
      notifiedContacts: []
    });
  },
  
  updateLocation: async () => {
    if (!get().isActive) return;
    
    try {
      const location = await Location.getCurrentPositionAsync({});
      
      set({
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      });
      
      // Schedule next update if SOS is still active
      if (get().isActive) {
        setTimeout(() => {
          get().updateLocation();
        }, 10000); // Update every 10 seconds
      }
    } catch (error) {
      console.error("Error updating location:", error);
    }
  },
  
  decrementCountdown: () => {
    const currentCountdown = get().countdown;
    
    if (currentCountdown > 0) {
      set({ countdown: currentCountdown - 1 });
    }
  },
  
  resetCountdown: () => {
    const { settings } = useSettingsStore.getState();
    set({ countdown: settings.sosCountdownDuration });
  }
}));