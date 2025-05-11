import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Note: In a real app, you would store these in environment variables
// For this demo, we're hardcoding them
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

// Create a custom storage implementation for AsyncStorage
const AsyncStorageAdapter = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
};

// Create Supabase client with options that work for both web and native
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS !== 'web' ? AsyncStorageAdapter : localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
  // Disable realtime subscription which causes Node.js dependency issues
  realtime: {
    params: {
      eventsPerSecond: 0, // Disable realtime
    },
  },
});

// Mock implementation for realtime subscriptions
// This avoids the Node.js dependency issues
if (Platform.OS !== 'web') {
  // @ts-ignore - Override the channel method to return a mock implementation
  supabase.channel = (name: string) => {
    return {
      on: () => {
        console.warn('Realtime subscriptions are disabled in this environment');
        return {
          subscribe: (callback: () => void) => {
            if (callback) callback();
            return {
              unsubscribe: () => {},
            };
          },
        };
      },
    };
  };
}