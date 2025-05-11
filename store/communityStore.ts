import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Message } from '@/types';
import { Platform } from 'react-native';

interface CommunityState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  fetchMessages: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  subscribeToMessages: () => () => void;
  clearError: () => void;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  
  fetchMessages: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('messages')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      
      set({ 
        messages: data.map(item => ({
          id: item.id,
          userId: item.user_id,
          username: item.profiles?.username || 'Unknown',
          content: item.content,
          createdAt: item.created_at,
        }))
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  sendMessage: async (content) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error('Not authenticated');
      
      const timestamp = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          user_id: session.session.user.id,
          content,
          created_at: timestamp,
        });
        
      if (error) throw error;
      
      // Fetch the user's username
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.session.user.id)
        .single();
      
      if (userError) throw userError;
      
      const newMessage: Message = {
        id: Date.now().toString(), // Use timestamp as temporary ID
        userId: session.session.user.id,
        username: userData?.username || 'Me',
        content: content,
        createdAt: timestamp,
      };
      
      set({ messages: [newMessage, ...get().messages] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  subscribeToMessages: () => {
    // Only attempt to subscribe on web platform
    if (Platform.OS === 'web') {
      try {
        const subscription = supabase
          .channel('public:messages')
          .on('postgres_changes', 
            { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'messages' 
            }, 
            async (payload) => {
              // Fetch the username for the new message
              const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', payload.new.user_id)
                .single();
                
              if (error) {
                console.error('Error fetching username:', error);
                return;
              }
              
              const newMessage: Message = {
                id: payload.new.id,
                userId: payload.new.user_id,
                username: data?.username || 'Unknown',
                content: payload.new.content,
                createdAt: payload.new.created_at,
              };
              
              set(state => ({
                messages: [newMessage, ...state.messages]
              }));
            }
          )
          .subscribe();
          
        return () => {
          supabase.removeChannel(subscription);
        };
      } catch (error) {
        console.error('Error setting up subscription:', error);
        return () => {};
      }
    }
    
    // Return empty cleanup function for non-web platforms
    return () => {};
  },
  
  clearError: () => {
    set({ error: null });
  },
}));