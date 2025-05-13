import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

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

// This is a mock implementation since we don't have Supabase yet
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
          // Mock login - in real app, this would call Supabase auth.signIn
          if (email === 'test@example.com' && password === 'password') {
            const mockUser: User = {
              id: '1',
              username: 'User..',
              email: 'test@example.com',
              phone: '+1234567890',
              createdAt: new Date().toISOString(),
            };
            
            set({ 
              user: mockUser,
              token: 'mock-token',
              isAuthenticated: true,
              isLoading: false 
            });
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          });
        }
      },
      
      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Mock registration - in real app, this would call Supabase auth.signUp
          const mockUser: User = {
            id: '1',
            username,
            email,
            createdAt: new Date().toISOString(),
          };
          
          set({ 
            user: mockUser,
            token: 'mock-token',
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false 
          });
        }
      },
      
      logout: () => {
        // In real app, this would call Supabase auth.signOut
        set({ 
          user: null,
          token: null,
          isAuthenticated: false 
        });
      },
      
      updateUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Mock update - in real app, this would call Supabase
          const currentUser = get().user;
          if (!currentUser) throw new Error('No user logged in');
          
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