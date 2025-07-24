// Import polyfills first
import './polyfills';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase'; // Use generated types

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing. Check .env file.");
  // You might want to throw an error in production builds
  // throw new Error("Supabase URL or Anon Key is missing in environment variables.");
}

// Ensure url and key are defined before creating client
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: AsyncStorage, // Use AsyncStorage for session persistence in React Native
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false, // Important for React Native
        },
      })
    : {} as SupabaseClient<Database>; // Provide a dummy client if keys are missing to avoid crash during development hot-reloads

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase client could not be initialized due to missing env vars.");
}