// Import polyfills first
import './polyfills';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase'; // Use generated types

// Hard-code values for development as backup if env variables fail to load
const FALLBACK_URL = 'https://skbzpigyjiwrzjkvemmu.supabase.co';
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrYnpwaWd5aml3cnpqa3ZlbW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODc2NTksImV4cCI6MjA2OTM2MzY1OX0.ybKZgS-A5Khnhj9Wg58VXilQDKMn85DCpARUFTPGbuM';

// Use fallbacks if env vars aren't available
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

// More detailed logging for debugging
console.log('Initializing Supabase client with URL:', supabaseUrl);
console.log('Supabase Anon Key (first 5 chars):', supabaseAnonKey?.substring(0, 5));
console.log('Realtime enabled:', !!supabaseUrl && !!supabaseAnonKey);

// Initialize connection status
let isOnline = true;
let lastConnectionCheck = 0;

// Setup network state listener
NetInfo.addEventListener(state => {
  isOnline = !!state.isConnected && !!state.isInternetReachable;
  console.log('Network state changed:', { 
    isConnected: state.isConnected,
    isInternetReachable: state.isInternetReachable,
    type: state.type
  });
});

// Check network before initial setup
NetInfo.fetch().then(state => {
  isOnline = !!state.isConnected && !!state.isInternetReachable;
  console.log('Initial network state:', {
    isConnected: state.isConnected,
    isInternetReachable: state.isInternetReachable,
    type: state.type
  });
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing. Check .env file.");
  // You might want to throw an error in production builds
  // throw new Error("Supabase URL or Anon Key is missing in environment variables.");
}

// Helper function to verify connection with Supabase
async function testSupabaseConnection(client: SupabaseClient<Database>): Promise<boolean> {
  try {
    // Simple ping request to check connection
    const { data, error } = await client.from('profiles').select('id').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    console.log('Supabase connection test succeeded');
    return true;
  } catch (error) {
    console.error('Supabase connection test exception:', error);
    return false;
  }
}

// Ensure url and key are defined before creating client
let supabaseInstance: SupabaseClient<Database>;

try {
  // Double check that we have values to work with
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or key, even after fallbacks');
  }
  
  console.log('Creating Supabase client with URL:', supabaseUrl);
  console.log('Anon Key length:', supabaseAnonKey.length);
  
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
    // Add some retry logic for network failures
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
  
  console.log('Supabase client initialized successfully with auth:', !!supabaseInstance.auth);
  
  // Test connection (don't await, let it run in background)
  testSupabaseConnection(supabaseInstance).then(isConnected => {
    if (!isConnected) {
      console.warn('Initial Supabase connection test failed - check network and credentials');
    }
  });
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Create an empty client with auth object to prevent null reference errors
  supabaseInstance = {
    auth: {
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase client not properly initialized') }),
      signUp: async () => ({ data: null, error: new Error('Supabase client not properly initialized') }),
      signOut: async () => ({ error: new Error('Supabase client not properly initialized') }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null, status: 200 }) }) }),
      insert: async () => ({ data: null, error: null }),
    }),
  } as unknown as SupabaseClient<Database>;
}

// Helper function to check connection before operations
export async function ensureSupabaseConnection(): Promise<boolean> {
  // Only check connection every 30 seconds at most to avoid too many checks
  const now = Date.now();
  if (now - lastConnectionCheck < 30000 && isOnline) {
    return true;
  }
  
  lastConnectionCheck = now;
  const netInfo = await NetInfo.fetch();
  isOnline = !!netInfo.isConnected && !!netInfo.isInternetReachable;
  
  if (!isOnline) {
    console.warn('Device appears to be offline');
    return false;
  }
  
  return await testSupabaseConnection(supabaseInstance);
}

export const supabase = supabaseInstance;