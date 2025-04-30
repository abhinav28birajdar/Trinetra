import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  relationship: string;
  isFavorite: boolean; // Add this missing property
}

interface ContactsStore {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, contact: Partial<Omit<Contact, 'id'>>) => void;
  deleteContact: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

export const useContactsStore = create<ContactsStore>()(
  persist(
    (set) => ({
      contacts: [],
      
      addContact: (contact) => 
        set((state) => ({
          contacts: [
            ...state.contacts, 
            { 
              ...contact, 
              id: Math.random().toString(36).substring(2, 9),
            }
          ],
        })),
        
      updateContact: (id, contact) => 
        set((state) => ({
          contacts: state.contacts.map((c) => 
            c.id === id ? { ...c, ...contact } : c
          ),
        })),
        
      deleteContact: (id) => 
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        })),
        
      toggleFavorite: (id) => 
        set((state) => ({
          contacts: state.contacts.map((c) => 
            c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
          ),
        })),
    }),
    {
      name: 'contacts-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);