// src/store/auth-store.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '@/lib/mongodb';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // Initialize the store - check for existing session
  init: async () => {
    set({ isLoading: true });
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Failed to restore auth state:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Sign in with email and password
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // For demo mode - allow any email with password "password"
      if (password === "password") {
        const demoUser = {
          _id: "demo-user-id",
          fullName: "Demo User",
          email: email,
          phoneNumber: "1234567890",
          isDemo: true
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(demoUser));
        set({ user: demoUser, isAuthenticated: true, isLoading: false });
        return demoUser;
      }
      
      // Real authentication against MongoDB
      const user = await userService.findUserByCredentials(email, password);
      
      // Save user to AsyncStorage for persistence
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      // Update store state
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to sign in. Please check your credentials.',
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Sign up new user
  signUp: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      // Create user in MongoDB
      const result = await userService.createUser(userData);
      
      // For this example, we'll auto-login after signup
      const user = {
        _id: result.insertedId,
        ...userData,
        password: undefined // Don't store password in state
      };
      
      // Save user to AsyncStorage for persistence
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      // Update store state
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to create account. Please try again.',
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Sign out
  signOut: async () => {
    set({ isLoading: true });
    try {
      await AsyncStorage.removeItem('user');
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ isLoading: false });
    }
  },
  
  // Update user profile
  updateProfile: async (updateData) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = get();
      if (!user) throw new Error('Not authenticated');
      
      // Skip MongoDB update for demo users
      if (user.isDemo) {
        const updatedUser = { ...user, ...updateData };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser, isLoading: false });
        return updatedUser;
      }
      
      // Update user in MongoDB
      await userService.updateUser(user._id, updateData);
      
      // Update local state
      const updatedUser = { ...user, ...updateData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
      return updatedUser;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to update profile. Please try again.',
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Clear any error messages
  clearError: () => set({ error: null })
}));

// Initialize auth state when the app loads
useAuthStore.getState().init();