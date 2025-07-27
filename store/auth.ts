import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/database';
// import { Database } from '../types/supabase';

// type Profile = Database['public']['Tables']['profiles']['Row']; // Use generated type

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean; // Add this flag
  setSession: (session: Session | null) => void;
  fetchProfile: (userId: string) => Promise<void>;
  clearAuth: () => void;
  initializeAuth: () => void; // Removed Promise return for simplicity here
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: Error }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: Error }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true, // Start as loading initially
  isInitialized: false, // Add the missing property

  setSession: (session) => {
    set({ session, user: session?.user ?? null });
    if (session?.user) {
      get().fetchProfile(session.user.id);
    } else {
      set({ profile: null }); // Clear profile on logout
    }
  },

  fetchProfile: async (userId) => {
     if (!userId || !supabase?.from) { // Check if supabase client is available
        set({ profile: null });
        return;
     };
     try {
        console.log(`Fetching profile for user: ${userId}`);
        const { data, error, status } = await supabase
         .from('profiles')
         .select(`
           id, email, full_name, avatar_url, phone, created_at, updated_at,
           emergency_contact_1, emergency_contact_2, address, city, blood_group,
           medical_conditions, emergency_message, location_sharing_enabled,
           push_notifications_enabled
         `) // Updated field names with additional profile fields
         .eq('id', userId)
         .single();

        if (error && status !== 406) { // 406 = No rows found
         console.error('Error fetching profile:', error.message, 'Status:', status);
         set({ profile: null }); // Set profile to null on error
        //  throw error; // Don't throw, just log and clear profile
        } else if (data) {
         console.log('Profile data fetched:', data);
         set({ profile: data as Profile }); // Cast to Profile type
        } else {
         console.log('No profile data found for user.');
         set({ profile: null }); // Ensure profile is null if no data found
        }
     } catch (error) {
        console.error("Catch block Error in fetchProfile:", error);
        set({ profile: null });
     }
  },

  clearAuth: () => {
    set({ session: null, user: null, profile: null, isLoading: false });
  },

  initializeAuth: () => { // Changed to sync function setting up async tasks
    // Prevent multiple initializations
    if (get().isInitialized) {
      console.log("Auth already initialized, skipping...");
      return;
    }
    
    set({ isLoading: true, isInitialized: true });
    if (!supabase?.auth) {
        console.warn("Supabase auth not available for initialization.");
        set({ isLoading: false });
        return; // Exit if supabase isn't configured
    }

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
            console.error("Error getting initial session:", error.message);
        }
        if (session) {
            console.log("Initial session found:", session.user.id);
            set({ session, user: session.user });
            get().fetchProfile(session.user.id).finally(() => set({ isLoading: false }));
        } else {
            console.log("No initial session found.");
            set({ session: null, user: null, profile: null, isLoading: false });
        }
    }).catch(err => {
        console.error("Error in getSession promise:", err);
        set({ isLoading: false });
    });


    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed event:", _event);
        // Set loading true while potentially fetching profile
        set({ session, user: session?.user ?? null, isLoading: true });
        if (session?.user) {
            console.log("User session active, fetching profile:", session.user.id);
            get().fetchProfile(session.user.id).finally(() => set({ isLoading: false }));
        } else {
            console.log("User session cleared.");
            set({ profile: null, isLoading: false }); // Clear profile, set loading false
        }
      }
    );

    // Note: Returning the unsubscribe function from the store creator
    // might not be the standard way. Cleanup is usually handled in a component effect.
    // For simplicity here, we're not returning it. If needed, manage subscription lifecycle
    // in the root component.
  },

  signOut: async () => {
      if (!supabase?.auth) return;
      const { error } = await supabase.auth.signOut();
      if (error) {
          console.error("Error signing out:", error.message);
      } else {
          set({ session: null, user: null, profile: null, isLoading: false }); // Explicitly clear state
          console.log("User signed out.");
      }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        return { error };
      }
      
      console.log("User signed in:", data.user?.id);
      return {};
    } catch (error) {
      console.error("Sign in catch error:", error);
      return { error: error as Error };
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email: string, password: string, fullName?: string) => {
    try {
      set({ isLoading: true });
      console.log('Attempting to sign up with Supabase...');
      console.log('Email:', email);
      console.log('Supabase client available:', !!supabase);
      console.log('Supabase auth available:', !!supabase?.auth);
      
      // Test basic connectivity first with a simpler URL
      try {
        console.log('Testing basic internet connectivity...');
        const testResponse = await fetch('https://httpbin.org/get', {
          method: 'GET',
        });
        console.log('Internet connectivity test status:', testResponse.status);
        
        console.log('Testing Supabase endpoint...');
        const supabaseResponse = await fetch('https://aaqcyzxvqwgsioyfcdr.supabase.co/rest/v1/', {
          method: 'HEAD',
          headers: {
            'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
          },
        });
        console.log('Supabase connectivity test status:', supabaseResponse.status);
      } catch (connectivityError) {
        console.error('Connectivity test failed:', connectivityError);
        console.error('This suggests a network/firewall issue');
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      
      if (error) {
        console.error("Sign up error:", error.message);
        console.error("Full error object:", error);
        return { error };
      }
      
      console.log("User signed up:", data.user?.id);
      return {};
    } catch (error) {
      console.error("Sign up catch error:", error);
      console.error("Error type:", typeof error);
      console.error("Error toString:", error?.toString());
      return { error: error as Error };
    } finally {
      set({ isLoading: false });
    }
  }
}));

// Initial call to setup listener when store is created
// Note: This might run too early in some setups. Moving to RootLayout useEffect is safer.
// useAuthStore.getState().initializeAuth();

// Export useAuth hook for easier usage
export const useAuth = () => {
  const { session, user, profile, isLoading, signIn, signUp, signOut } = useAuthStore();
  return {
    session,
    user,
    profile,
    isLoading,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signOut,
  };
};