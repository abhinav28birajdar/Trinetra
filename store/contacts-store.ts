import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Contact } from "@/types";
import { useAuthStore } from "./auth-store";

interface ContactsState {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
}

interface ContactsStore extends ContactsState {
  addContact: (contact: Omit<Contact, "id">) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  setTrusted: (id: string, isTrusted: boolean) => void;
  getContactById: (id: string) => Contact | undefined;
  getTrustedContacts: () => Contact[];
  clearError: () => void;
}

export const useContactsStore = create<ContactsStore>()(
  persist(
    (set, get) => ({
      contacts: [],
      isLoading: false,
      error: null,

      addContact: (contactData) => {
        const newContact: Contact = {
          ...contactData,
          id: Date.now().toString(),
        };
        
        set(state => ({
          contacts: [...state.contacts, newContact],
          error: null
        }));
        
        // Update user's emergency contacts in auth store
        const authStore = useAuthStore.getState();
        if (authStore.user) {
          authStore.updateProfile({
            emergencyContacts: [...get().contacts]
          });
        }
      },
      
      updateContact: (id, updates) => {
        set(state => ({
          contacts: state.contacts.map(contact => 
            contact.id === id ? { ...contact, ...updates } : contact
          ),
          error: null
        }));
        
        // Update user's emergency contacts in auth store
        const authStore = useAuthStore.getState();
        if (authStore.user) {
          authStore.updateProfile({
            emergencyContacts: get().contacts
          });
        }
      },
      
      deleteContact: (id) => {
        set(state => ({
          contacts: state.contacts.filter(contact => contact.id !== id),
          error: null
        }));
        
        // Update user's emergency contacts in auth store
        const authStore = useAuthStore.getState();
        if (authStore.user) {
          authStore.updateProfile({
            emergencyContacts: get().contacts.filter(contact => contact.id !== id)
          });
        }
      },
      
      setTrusted: (id, isTrusted) => {
        set(state => ({
          contacts: state.contacts.map(contact => 
            contact.id === id ? { ...contact, isTrusted } : contact
          ),
          error: null
        }));
      },
      
      getContactById: (id) => {
        return get().contacts.find(contact => contact.id === id);
      },
      
      getTrustedContacts: () => {
        return get().contacts.filter(contact => contact.isTrusted);
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: "contacts-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Add some mock contacts for development
if (__DEV__) {
  // Only add mock data if no contacts exist
  const currentContacts = useContactsStore.getState().contacts;
  
  if (currentContacts.length === 0) {
    const mockContacts = [
      {
        name: "Mom",
        phoneNumber: "+91 9876543210",
        relationship: "Family",
        isTrusted: true
      },
      {
        name: "Dad",
        phoneNumber: "+91 9876543211",
        relationship: "Family",
        isTrusted: true
      },
      {
        name: "Neha",
        phoneNumber: "+91 9876543212",
        relationship: "Friend",
        isTrusted: false
      }
    ];
    
    mockContacts.forEach(contact => {
      useContactsStore.getState().addContact(contact);
    });
  }
}