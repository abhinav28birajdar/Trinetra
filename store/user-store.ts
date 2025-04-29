import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setUser: (user) => set({ user, isLoggedIn: true }),
      updateUser: (userData) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        })),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Initialize with mock data for development
if (__DEV__) {
  // Check if user is already set to avoid overriding on reload
  const currentUser = useUserStore.getState().user;
  if (!currentUser) {
    useUserStore.getState().setUser({
        id: '1',
        name: 'Anjali Sharma',
        email: 'anjali@example.com',
        phoneNumber: '+91 9876543210',
        address: '123 Main Street, Mumbai',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        emergencyContacts: []
    });
  }
}