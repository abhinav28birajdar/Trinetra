import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { Contact } from '@/types';

interface ContactsState {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  
  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useContactsStore = create<ContactsState>()(
  persist(
    (set, get) => ({
      contacts: [],
      isLoading: false,
      error: null,
      
      fetchContacts: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { data: session } = await supabase.auth.getSession();
          if (!session.session) throw new Error('Not authenticated');
          
          const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          set({ 
            contacts: data.map(item => ({
              id: item.id,
              userId: item.user_id,
              name: item.name,
              phone: item.phone,
              relationship: item.relationship,
              isEmergency: item.is_emergency,
              createdAt: item.created_at,
            })) 
          });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },
      
      addContact: async (contact) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data: session } = await supabase.auth.getSession();
          if (!session.session) throw new Error('Not authenticated');
          
          const { data, error } = await supabase
            .from('contacts')
            .insert({
              user_id: session.session.user.id,
              name: contact.name,
              phone: contact.phone,
              relationship: contact.relationship,
              is_emergency: contact.isEmergency,
              created_at: new Date().toISOString(),
            })
            .select()
            .single();
            
          if (error) throw error;
          
          const newContact: Contact = {
            id: data.id,
            userId: data.user_id,
            name: data.name,
            phone: data.phone,
            relationship: data.relationship,
            isEmergency: data.is_emergency,
            createdAt: data.created_at,
          };
          
          set({ contacts: [newContact, ...get().contacts] });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateContact: async (id, contact) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data: session } = await supabase.auth.getSession();
          if (!session.session) throw new Error('Not authenticated');
          
          const { error } = await supabase
            .from('contacts')
            .update({
              name: contact.name,
              phone: contact.phone,
              relationship: contact.relationship,
              is_emergency: contact.isEmergency,
            })
            .eq('id', id)
            .eq('user_id', session.session.user.id);
            
          if (error) throw error;
          
          set({
            contacts: get().contacts.map(c => 
              c.id === id ? { ...c, ...contact } : c
            ),
          });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },
      
      deleteContact: async (id) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data: session } = await supabase.auth.getSession();
          if (!session.session) throw new Error('Not authenticated');
          
          const { error } = await supabase
            .from('contacts')
            .delete()
            .eq('id', id)
            .eq('user_id', session.session.user.id);
            
          if (error) throw error;
          
          set({
            contacts: get().contacts.filter(c => c.id !== id),
          });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'contacts-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);