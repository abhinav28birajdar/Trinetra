import { create } from 'zustand';
import { Message } from '@/types';
import { supabase } from '@/lib/supabase';

interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchMessages: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  
  fetchMessages: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      set({ 
        messages: data.map(message => ({
          id: message.id,
          userId: message.user_id,
          username: message.username,
          content: message.content,
          createdAt: message.created_at
        })),
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch messages',
        isLoading: false 
      });
    }
  },
  
  sendMessage: async (content) => {
    set({ isLoading: true, error: null });
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) throw new Error('Not authenticated');
      
      const user = session.data.session.user;
      const profile = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (profile.error) throw profile.error;
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          username: profile.data.username,
          content
        })
        .select()
        .single();

      if (error) throw error;
      
      set({ 
        messages: [{
          id: data.id,
          userId: data.user_id,
          username: data.username,
          content: data.content,
          createdAt: data.created_at
        }, ...get().messages],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to send message',
        isLoading: false 
      });
    }
  },
}));