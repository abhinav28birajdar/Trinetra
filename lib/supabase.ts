// Import polyfills first
import './polyfills';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase'; // Use generated types

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// More detailed logging for debugging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (first 10 chars):', supabaseAnonKey?.substring(0, 10));

// Check for network connectivity
NetInfo.fetch().then(state => {
  console.log('Network connectivity state:', state);
  console.log('Is connected?', state.isConnected);
  console.log('Connection type:', state.type);
  console.log('Is internet reachable?', state.isInternetReachable);
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing. Check .env file.");
  // You might want to throw an error in production builds
  // throw new Error("Supabase URL or Anon Key is missing in environment variables.");
}

// Ensure url and key are defined before creating client
let supabaseInstance: SupabaseClient<Database>;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'X-App-Version': '1.0.0',
        },
      },
    });
    console.log('Supabase client initialized successfully');
  } else {
    console.error('Missing Supabase URL or key');
    // Create a dummy client that will be replaced when env vars are available
    supabaseInstance = {} as SupabaseClient<Database>;
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  supabaseInstance = {} as SupabaseClient<Database>;
}

export const supabase = supabaseInstance;