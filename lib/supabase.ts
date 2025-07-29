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
    console.log('Supabase client initialized successfully');
    
    // Test connection (don't await, let it run in background)
    testSupabaseConnection(supabaseInstance).then(isConnected => {
      if (!isConnected) {
        console.warn('Initial Supabase connection test failed - check network and credentials');
      }
    });
  } else {
    console.error('Missing Supabase URL or key');
    // Create a dummy client that will be replaced when env vars are available
    supabaseInstance = {} as SupabaseClient<Database>;
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  supabaseInstance = {} as SupabaseClient<Database>;
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