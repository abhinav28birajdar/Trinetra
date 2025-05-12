import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../api/supabase';

type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  full_name: string | null; // Assuming you might want this
  // Add other profile fields
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  register: (email: string, pass: string, username: string) => Promise<any>;
  logout: () => Promise<any>;
  fetchProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfileData(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfileData(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchProfileData = async (userId: string) => {
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url, full_name`) // Add other fields
        .eq('id', userId)
        .single();

      if (error && status !== 406) throw error;
      if (data) setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const login = async (email: string, pass: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    // Session update will trigger profile fetch via onAuthStateChange
    setLoading(false);
  };

  const register = async (email: string, pass: string, username: string) => {
    setLoading(true);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          username: username, // This can be used to prefill profile
        }
      }
    });
    if (authError) { setLoading(false); throw authError; }
    if (authData.user) {
      // Create profile entry
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: authData.user.id, username, email }); // You might want to ensure email uniqueness in profiles too
      if (profileError) {
        // Potentially roll back user creation or handle error
        console.error("Profile creation error:", profileError);
        // For simplicity, we'll let the auth user exist even if profile fails here
      }
    }
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, login, register, logout, fetchProfile: () => fetchProfileData(user!.id) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};