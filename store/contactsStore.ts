import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact as ContactType } from '@/types'; // Use aliased ContactType
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore'; // To get user ID

// Interface for contact data passed to add/update functions (without id, userId, createdAt)
interface ContactPayload {
  name: string;
  phone: string;
  relationship?: string | null;
  is_emergency_contact?: boolean;
}

interface ContactsState {
  contacts: ContactType[];
  isLoading: boolean;
  error: string | null;

  fetchContacts: () => Promise<void>;
  addContact: (contactData: ContactPayload) => Promise<void>;
  updateContact: (id: string, contactData: Partial<ContactPayload>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

export const useContactsStore = create<ContactsState>()(
  persist(
    (set, get) => ({
      contacts: [],
      isLoading: false,
      error: null,

      fetchContacts: async () => {
        set({ isLoading: true, error: null });
        const userId = useAuthStore.getState().user?.id;
        if (!userId) {
          set({ isLoading: false, error: "User not authenticated" });
          return;
        }

        try {
          const { data, error } = await supabase
            .from('emergency_contacts')
            .select('*')
            .eq('user_id', userId) // Fetch only contacts for the logged-in user
            .order('created_at', { ascending: false });

          if (error) throw error;

          set({
            contacts: data as ContactType[], // Supabase returns snake_case, matches ContactType
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch contacts',
            isLoading: false,
          });
        }
      },

      addContact: async (contactData) => {
        set({ isLoading: true, error: null });
        const userId = useAuthStore.getState().user?.id;
        if (!userId) {
          set({ isLoading: false, error: "User not authenticated" });
          return;
        }

        try {
          const { data, error } = await supabase
            .from('emergency_contacts')
            .insert({
              user_id: userId,
              ...contactData, // Spread snake_case fields
            })
            .select()
            .single();

          if (error) throw error;
          if (!data) throw new Error("Failed to add contact: No data returned");

          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }

          set((state) => ({
            contacts: [data as ContactType, ...state.contacts],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add contact',
            isLoading: false,
          });
        }
      },

      updateContact: async (id, contactData) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('emergency_contacts')
            .update({
              name: contactData.name,
              phone_number: contactData.phone_number,
              relationship: contactData.relationship,
              is_emergency_contact: contactData.is_emergency_contact,
            })
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;
          if (!data) throw new Error("Failed to update contact: No data returned");


          set((state) => ({
            contacts: state.contacts.map(contact =>
              contact.id === id ? (data as ContactType) : contact
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update contact',
            isLoading: false,
          });
        }
      },

      deleteContact: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('emergency_contacts')
            .delete()
            .eq('id', id);

          if (error) throw error;

          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }

          set((state) => ({
            contacts: state.contacts.filter(contact => contact.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete contact',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'contacts-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);