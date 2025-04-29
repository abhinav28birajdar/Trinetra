import { create } from 'zustand';
import { Platform } from 'react-native';
import { useContactsStore } from './contacts-store';
import { useSettingsStore } from './settings-store';

interface SOSState {
  isActive: boolean;
  activatedAt: string | null;
  currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  activateSOS: () => Promise<void>;
  deactivateSOS: () => Promise<void>;
  updateLocation: (location: { latitude: number; longitude: number; address?: string }) => void;
}

export const useSOSStore = create<SOSState>()((set, get) => ({
  isActive: false,
  activatedAt: null,
  currentLocation: null,
  isLoading: false,
  error: null,
  
  activateSOS: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Get contacts and settings
      const contacts = useContactsStore.getState().contacts;
      const { settings } = useSettingsStore.getState();
      
      // Simulate getting current location
      const mockLocation = {
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'Connaught Place, New Delhi, India'
      };
      
      // Simulate sending alerts to contacts
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log actions that would happen in a real app
      console.log('SOS Activated!');
      console.log('Location:', mockLocation);
      console.log('Alerting contacts:', contacts);
      
      if (settings.enableSiren && Platform.OS !== 'web') {
        console.log('Siren activated!');
        // In a real app, we would play a loud siren sound here
      }
      
      if (settings.autoCallPrimary) {
        const primaryContact = contacts.find(c => c.isPrimary);
        if (primaryContact) {
          console.log('Auto-calling primary contact:', primaryContact.fullName);
          // In a real app, we would initiate a call here
        }
      }
      
      set({ 
        isActive: true,
        activatedAt: new Date().toISOString(),
        currentLocation: mockLocation,
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to activate SOS",
        isLoading: false
      });
    }
  },
  
  deactivateSOS: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call to notify contacts that user is safe
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('SOS Deactivated - User is safe');
      
      set({ 
        isActive: false,
        activatedAt: null,
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to deactivate SOS",
        isLoading: false
      });
    }
  },
  
  updateLocation: (location) => {
    set({ currentLocation: location });
  }
}));