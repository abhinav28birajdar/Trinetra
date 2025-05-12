import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: {
    id: string;
    email: string;
    username: string;
    phone?: string;
    age?: string;
    bloodGroup?: string;
    avatarUrl?: string;
    createdAt: string;
  } | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
  
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  setSession: (session: any) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: false,
      error: null,
      
      signUp: async (email, password, username) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username } }
          });
          
          if (error) throw error;
          
          if (data.user) {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                username,
                email,
                created_at: new Date().toISOString(),
              });
              
            if (profileError) throw profileError;
            
            set({
              user: {
                id: data.user.id,
                email: data.user.email!,
                username,
                createdAt: new Date().toISOString(),
              },
              session: data.session,
            });
          }
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },
      
      signIn: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) throw error;
          
          if (data.user) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
              
            if (profileError) throw profileError;
            
            set({
              user: {
                id: data.user.id,
                email: data.user.email!,
                username: profileData.username,
                phone: profileData.phone,
                age: profileData.age,
                bloodGroup: profileData.blood_group,
                avatarUrl: profileData.avatar_url,
                createdAt: profileData.created_at,
              },
              session: data.session,
            });
          }
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },
      
      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, session: null });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const user = get().user;
          if (!user) throw new Error('User not authenticated');
          
          const { error } = await supabase
            .from('profiles')
            .update({
              username: data.username,
              phone: data.phone,
              age: data.age,
              blood_group: data.bloodGroup,
              avatar_url: data.avatarUrl,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
            
          if (error) throw error;
          
          set({ user: { ...user, ...data } });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },
      
      setSession: (session) => {
        set({ session });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);