import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';
import { useLocationStore } from './locationStore';
import { useContactsStore } from './contactsStore';
import * as Haptics from 'expo-haptics';
import { Platform, Linking } from 'react-native';

interface SosState {
  isSosActive: boolean;
  isLoading: boolean;
  error: string | null;

  triggerSos: () => Promise<void>;
  resetSos: () => void;
}

export const useSosStore = create<SosState>((set, get) => ({
  isSosActive: false,
  isLoading: false,
  error: null,

  triggerSos: async () => {
    set({ isLoading: true, error: null });
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      set({ isLoading: false, error: "User not authenticated" });
      return;
    }

    try {
      const currentLocation = useLocationStore.getState().currentLocation;
      
      const { error: sosError } = await supabase
        .from('sos_events')
        .insert({
          user_id: userId,
          latitude: currentLocation?.latitude || null,
          longitude: currentLocation?.longitude || null,
        });

      if (sosError) throw sosError;

      // Notify emergency contacts and initiate calls
      const emergencyContacts = useContactsStore.getState().contacts.filter(contact => contact.is_emergency_contact);
      if (emergencyContacts.length > 0) {
        console.log("Notifying emergency contacts and initiating calls:", emergencyContacts.map(c => c.name));
        for (const contact of emergencyContacts) {
          if (contact.phone_number) {
            const url = `tel:${contact.phone_number}`;
            const supported = await Linking.canOpenURL(url);
            if (supported) {
              await Linking.openURL(url);
            } else {
              console.warn(`Cannot open dialer for ${contact.phone_number}`);
            }
          }
        }
      }

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      set({ isSosActive: true, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to trigger SOS',
        isLoading: false,
      });
    }
  },

  resetSos: () => {
    set({ isSosActive: false, error: null });
  },
}));