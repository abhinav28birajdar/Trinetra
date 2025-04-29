import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmergencyContact } from '@/types';

interface ContactsState {
  contacts: EmergencyContact[];
  isLoading: boolean;
  error: string | null;
  addContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  updateContact: (id: string, contact: Partial<EmergencyContact>) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
  setPrimaryContact: (id: string) => Promise<void>;
  clearError: () => void;
}

// Mock contacts for demo
const mockContacts: EmergencyContact[] = [
  {
    id: '1',
    fullName: 'Anjali Sharma',
    phoneNumber: '+91 9876543210',
    relationship: 'Sister',
    isPrimary: true
  },
  {
    id: '2',
    fullName: 'Ravi Birajdar',
    phoneNumber: '+91 9876543211',
    relationship: 'Brother',
    isPrimary: false
  },
  {
    id: '3',
    fullName: 'Meena Devi',
    phoneNumber: '+91 9876543212',
    relationship: 'Mother',
    isPrimary: false
  }
];

export const useContactsStore = create<ContactsState>()(
  persist(
    (set, get) => ({
      contacts: mockContacts,
      isLoading: false,
      error: null,
      
      addContact: async (contactData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newContact: EmergencyContact = {
            id: Math.random().toString(36).substring(2, 9),
            ...contactData
          };
          
          // If this is the first contact or marked as primary, ensure it's the only primary
          if (newContact.isPrimary) {
            const updatedContacts = get().contacts.map(c => ({
              ...c,
              isPrimary: false
            }));
            
            set({ 
              contacts: [...updatedContacts, newContact],
              isLoading: false
            });
          } else {
            set({ 
              contacts: [...get().contacts, newContact],
              isLoading: false
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false
          });
        }
      },
      
      updateContact: async (id, contactData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const currentContacts = get().contacts;
          const contactIndex = currentContacts.findIndex(c => c.id === id);
          
          if (contactIndex === -1) {
            throw new Error("Contact not found");
          }
          
          // Handle primary contact logic
          if (contactData.isPrimary) {
            const updatedContacts = currentContacts.map(c => ({
              ...c,
              isPrimary: c.id === id
            }));
            
            set({ 
              contacts: updatedContacts,
              isLoading: false
            });
          } else {
            const updatedContacts = [...currentContacts];
            updatedContacts[contactIndex] = {
              ...updatedContacts[contactIndex],
              ...contactData
            };
            
            set({ 
              contacts: updatedContacts,
              isLoading: false
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false
          });
        }
      },
      
      removeContact: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const filteredContacts = get().contacts.filter(c => c.id !== id);
          
          // If we removed the primary contact and have other contacts, set the first one as primary
          const removedPrimary = !filteredContacts.some(c => c.isPrimary) && filteredContacts.length > 0;
          
          if (removedPrimary) {
            filteredContacts[0].isPrimary = true;
          }
          
          set({ 
            contacts: filteredContacts,
            isLoading: false
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false
          });
        }
      },
      
      setPrimaryContact: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedContacts = get().contacts.map(contact => ({
            ...contact,
            isPrimary: contact.id === id
          }));
          
          set({ 
            contacts: updatedContacts,
            isLoading: false
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false
          });
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'contacts-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);