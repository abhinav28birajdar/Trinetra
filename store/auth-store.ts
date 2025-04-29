import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, AuthState } from "@/types";

interface AuthStore extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, phoneNumber: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (userData: Partial<User>) => void;
  resetError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, this would be an API call
          // Simulating API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock authentication for demo
          if (email === "demo@example.com" && password === "password") {
            const user: User = {
              id: "1",
              name: "Priya Sharma",
              email: "demo@example.com",
              phoneNumber: "+91 9876543210",
              address: "123 Main Street, Mumbai",
              emergencyContacts: [],
              profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
            };
            
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ error: "Invalid email or password", isLoading: false });
          }
        } catch (error) {
          set({ error: "An error occurred during sign in", isLoading: false });
        }
      },
      
      signUp: async (name, email, password, phoneNumber) => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, this would be an API call
          // Simulating API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user creation for demo
          const user: User = {
            id: Date.now().toString(),
            name,
            email,
            phoneNumber,
            emergencyContacts: []
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: "An error occurred during sign up", isLoading: false });
        }
      },
      
      signOut: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
      
      resetError: () => {
        set({ error: null });
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);