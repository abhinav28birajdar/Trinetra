import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '@/types';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

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

// Mock data
const mockContacts: Contact[] = [
  {
    id: '1',
    userId: '1',
    name: 'Father',
    phone: '+1234567890',
    relationship: 'Family',
    isEmergencyContact: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '1',
    name: 'Mother',
    phone: '+0987654321',
    relationship: 'Family',
    isEmergencyContact: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: '1',
    name: 'Sister',
    phone: '+1122334455',
    relationship: 'Family',
    isEmergencyContact: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    userId: '1',
    name: 'Uncle',
    phone: '+5566778899',
    relationship: 'Family',
    isEmergencyContact: false,
    createdAt: new Date().toISOString(),
  },
];

export const useContactsStore = create<ContactsState>()(
  persist(
    (set, get) => ({
      contacts: [],
      isLoading: false,
      error: null,
      
      fetchContacts: async () => {
        set({ isLoading: true, error: null });
        try {
          // Mock fetch - in real app, this would call Supabase
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({ 
            contacts: mockContacts,
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
          // Mock add - in real app, this would call Supabase
          const newContact: Contact = {
            id: Date.now().toString(),
            userId: '1', // Mock user ID
            createdAt: new Date().toISOString(),
            ...contactData,
          };
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          
          set({ 
            contacts: [...get().contacts, newContact],
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
          // Mock update - in real app, this would call Supabase
          const updatedContacts = get().contacts.map(contact => 
            contact.id === id ? { ...contact, ...contactData } : contact
          );
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
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
          // Mock delete - in real app, this would call Supabase
          const filteredContacts = get().contacts.filter(contact => contact.id !== id);
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          
          set({ 
            contacts: filteredContacts,
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