import { create } from 'zustand';
import { Message } from '@/types';

interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchMessages: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}

// Mock data
const mockMessages: Message[] = [
  {
    id: '1',
    userId: '2',
    username: 'User 1',
    content: 'New update',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '3',
    username: 'User 2',
    content: 'Hii Girls',
    createdAt: new Date().toISOString(),
  },
];

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  
  fetchMessages: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock fetch - in real app, this would call Supabase
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ 
        messages: mockMessages,
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
      // Mock send - in real app, this would call Supabase
      const newMessage: Message = {
        id: Date.now().toString(),
        userId: '1', // Current user
        username: 'User..', // Current user
        content,
        createdAt: new Date().toISOString(),
      };
      
      set({ 
        messages: [...get().messages, newMessage],
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