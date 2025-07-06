import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) throw error;
          if (!data.session) throw new Error('No session returned');

          // Get user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError) throw profileError;

          set({ 
            user: {
              id: data.user.id,
              email: data.user.email || '',
              username: profileData.username,
              phone: profileData.phone,
              createdAt: profileData.created_at
            },
            token: data.session.access_token,
            isAuthenticated: true,
            isLoading: false 
          });
          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          });
          return false;
        }
      },
      
      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password
          });

          if (error) throw error;
          if (!data.user) throw new Error('No user returned');

          // Create profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              username,
              email,
              created_at: new Date().toISOString()
            });

          if (profileError) throw profileError;

          set({ 
            user: {
              id: data.user.id,
              username,
              email,
              createdAt: new Date().toISOString()
            },
            token: data.session?.access_token || null,
            isAuthenticated: data.session ? true : false,
            isLoading: false 
          });
          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false 
          });
          return false;
        }
      },
      
      logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Logout error:', error);
        
        set({ 
          user: null,
          token: null,
          isAuthenticated: false 
        });
      },
      
      updateUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const currentUser = get().user;
          if (!currentUser) throw new Error('No user logged in');
          
          const { error } = await supabase
            .from('profiles')
            .update(userData)
            .eq('id', currentUser.id);

          if (error) throw error;
          
          const updatedUser = {
            ...currentUser,
            ...userData,
          };
          
          set({ 
            user: updatedUser,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Update failed',
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);