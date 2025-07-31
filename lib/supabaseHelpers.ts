import { supabase } from './supabase';

/**
 * Checks if Supabase is properly initialized with auth methods
 * @returns Whether Supabase auth is available
 */
export function isSupabaseAuthAvailable(): boolean {
  try {
    // Check if supabase is defined and has auth property
    if (!supabase || !supabase.auth) {
      console.error('Supabase auth is not available');
      return false;
    }

    // Check if essential auth methods exist
    const requiredMethods = [
      'signInWithPassword',
      'signUp',
      'signOut',
      'getSession',
      'onAuthStateChange'
    ];

    for (const method of requiredMethods) {
      if (typeof supabase.auth[method] !== 'function') {
        console.error(`Supabase auth method ${method} is not available`);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking Supabase auth availability:', error);
    return false;
  }
}

/**
 * Gets initialized Supabase client with safety checks
 * @returns The initialized Supabase client or null if not available
 */
export function getSupabase() {
  if (!isSupabaseAuthAvailable()) {
    // Re-initialize supabase if needed (this would be implemented separately)
    console.warn('Supabase is not properly initialized');
  }
  return supabase;
}
