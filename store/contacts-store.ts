import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Contact } from "@/types";
// Assuming useAuthStore and updateProfile exist and work as intended
import { useAuthStore } from "./auth-store";

interface ContactsState {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
}

// Define the actions the store can perform
interface ContactsActions {
  // Using Omit<Contact, 'id'> means 'isFavorite' and 'isTrusted' must be provided or defaulted
  addContact: (contactData: Omit<Contact, "id">) => void;
  updateContact: (id: string, updates: Partial<Omit<Contact, 'id'>>) => void; // Prevent updating ID
  deleteContact: (id: string) => void;
  setTrusted: (id: string, isTrusted: boolean) => void; // Specific action for trusted status
  getContactById: (id: string) => Contact | undefined;
  getTrustedContacts: () => Contact[];
  clearError: () => void;
}

// Combine state and actions for the full store type
type ContactsStore = ContactsState & ContactsActions;

const initialState: ContactsState = {
  contacts: [],
  isLoading: false,
  error: null,
};

export const useContactsStore = create<ContactsStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addContact: (contactData) => {
        const newContact: Contact = {
          // Spread provided data, which should include isFavorite and isTrusted
          ...contactData,
          // Generate a unique ID (consider UUIDs for production)
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        };

        set(state => {
          const updatedContacts = [newContact, ...state.contacts]; // Add to beginning
          // --- Sync with Auth Store (Optional) ---
          // Ensure this logic is robust and handles potential race conditions if needed
          // const authStore = useAuthStore.getState();
          // if (authStore.user) {
          //   authStore.updateProfile({ emergencyContacts: updatedContacts });
          // }
          // --- End Sync ---
          return { contacts: updatedContacts, error: null, isLoading: false };
        });
        console.log("Contact added:", newContact);
      },

      updateContact: (id, updates) => {
        set(state => {
          let contactUpdated = false;
          const updatedContacts = state.contacts.map(contact => {
            if (contact.id === id) {
              contactUpdated = true;
              return { ...contact, ...updates };
            }
            return contact;
          });

          if (!contactUpdated) {
             console.warn(`Contact with id ${id} not found for update.`);
             return { error: `Contact with id ${id} not found.` }; // Optionally set error
          }

          // --- Sync with Auth Store (Optional) ---
          // const authStore = useAuthStore.getState();
          // if (authStore.user) {
          //   authStore.updateProfile({ emergencyContacts: updatedContacts });
          // }
           // --- End Sync ---
          console.log("Contact updated:", id, updates);
          return { contacts: updatedContacts, error: null, isLoading: false };
        });
      },

      deleteContact: (id) => {
        set(state => {
          const originalLength = state.contacts.length;
          const updatedContacts = state.contacts.filter(contact => contact.id !== id);

          if (updatedContacts.length === originalLength) {
            console.warn(`Contact with id ${id} not found for deletion.`);
            return { error: `Contact with id ${id} not found.` }; // Optionally set error
          }

          // --- Sync with Auth Store (Optional) ---
          // const authStore = useAuthStore.getState();
          // if (authStore.user) {
          //   authStore.updateProfile({ emergencyContacts: updatedContacts });
          // }
          // --- End Sync ---
          console.log("Contact deleted:", id);
          return { contacts: updatedContacts, error: null, isLoading: false };
        });
      },

      // Renamed from toggleFavorite/toggleTrusted to a more specific 'setTrusted'
      setTrusted: (id, isTrusted) => {
        set(state => ({
          contacts: state.contacts.map(contact =>
            contact.id === id ? { ...contact, isTrusted } : contact
          ),
          error: null // Clear error on successful action
        }));
        console.log(`Set trusted status for ${id} to ${isTrusted}`);
      },

      getContactById: (id) => {
        // get() allows accessing the latest state within an action or selector
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
      name: "contacts-storage", // Key used in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      // onRehydrateStorage: (state) => { // Optional: Perform actions after state is loaded
      //   console.log("Contacts store rehydrated");
      //   return (state, error) => {
      //     if (error) {
      //       console.error("Failed to rehydrate contacts store:", error);
      //     }
      //   };
      // },
    }
  )
);

// Add some mock contacts for development (ensuring all required fields are present)
if (__DEV__) {
  // Run this logic *after* the store is created and potentially rehydrated
  // Use setTimeout to ensure hydration potentially finishes first
  setTimeout(() => {
      const currentContacts = useContactsStore.getState().contacts;

      if (currentContacts.length === 0) {
        console.log("Adding mock contacts...");
        // Mock data now includes isFavorite (defaulting to false)
        const mockContactsData: Omit<Contact, "id">[] = [
          {
            name: "Mom",
            phoneNumber: "+91 9876543210",
            relationship: "Family",
            isTrusted: true,
            isFavorite: true // Explicitly set favorite
          },
          {
            name: "Dad",
            phoneNumber: "+91 9876543211",
            relationship: "Family",
            isTrusted: true,
            isFavorite: false // Explicitly set favorite
          },
          {
            name: "Neha",
            phoneNumber: "+91 9876543212",
            relationship: "Friend",
            isTrusted: false,
            isFavorite: false // Explicitly set favorite
          }
        ];

        mockContactsData.forEach(contact => {
          // Use the addContact action to ensure consistent state updates
          useContactsStore.getState().addContact(contact);
        });
      }
  }, 0); // Execute after current event loop cycle
}