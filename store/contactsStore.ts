import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '@/types';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

interface ContactsState {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateContact: (id: string, contactData: Partial<Contact>) => Promise<void>;
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
        try {
          const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          
          set({ 
            contacts: data.map(contact => ({
              id: contact.id,
              userId: contact.user_id,
              name: contact.name,
              phone: contact.phone,
              relationship: contact.relationship,
              isEmergencyContact: contact.is_emergency_contact,
              createdAt: contact.created_at
            })),
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch contacts',
            isLoading: false 
          });
        }
      },
      
      addContact: async (contactData) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('contacts')
            .insert({
              user_id: (await supabase.auth.getSession()).data.session?.user.id,
              name: contactData.name,
              phone: contactData.phone,
              relationship: contactData.relationship,
              is_emergency_contact: contactData.isEmergencyContact
            })
            .select()
            .single();

          if (error) throw error;
          
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          
          set({ 
            contacts: [{
              id: data.id,
              userId: data.user_id,
              name: data.name,
              phone: data.phone,
              relationship: data.relationship,
              isEmergencyContact: data.is_emergency_contact,
              createdAt: data.created_at
            }, ...get().contacts],
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add contact',
            isLoading: false 
          });
        }
      },
      
      updateContact: async (id, contactData) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('contacts')
            .update({
              name: contactData.name,
              phone: contactData.phone,
              relationship: contactData.relationship,
              is_emergency_contact: contactData.isEmergencyContact
            })
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;
          
          const updatedContacts = get().contacts.map(contact => 
            contact.id === id ? { 
              ...contact,
              name: data.name,
              phone: data.phone,
              relationship: data.relationship,
              isEmergencyContact: data.is_emergency_contact
            } : contact
          );
          
          set({ 
            contacts: updatedContacts,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update contact',
            isLoading: false 
          });
        }
      },
      
      deleteContact: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('contacts')
            .delete()
            .eq('id', id);

          if (error) throw error;
          
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          
          set({ 
            contacts: get().contacts.filter(contact => contact.id !== id),
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete contact',
            isLoading: false 
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