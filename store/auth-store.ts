import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  signOut: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

// Mock user for demo purposes
const mockUser: User = {
  id: '1',
  fullName: 'Anjali Sharma',
  email: 'anjali@example.com',
  phoneNumber: '+91 9876543210',
  homeAddress: '123 Safety Street, Secure City',
  profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For demo, accept any email with password "password"
          if (password !== "password") {
            throw new Error("Invalid credentials. Please try again.");
          }
          
          // Use mock user for demo
          set({ 
            user: mockUser,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false
          });
        }
      },
      
      signUp: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create new user with random ID
          const newUser: User = {
            id: Math.random().toString(36).substring(2, 9),
            fullName: userData.fullName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            homeAddress: '',
            profilePicture: ''
          };
          
          set({ 
            user: newUser,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false
          });
        }
      },
      
      signOut: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentUser = get().user;
          if (!currentUser) {
            throw new Error("User not found");
          }
          
          const updatedUser = { ...currentUser, ...userData };
          set({ 
            user: updatedUser,
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
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);