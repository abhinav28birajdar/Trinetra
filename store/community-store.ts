import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Ensure this import points correctly to your types file
import { CommunityPost } from '@/types';

interface CommunityState {
  posts: CommunityPost[];
  // Input type uses Omit to exclude fields added automatically
  addPost: (post: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'comments'>) => void;
  likePost: (id: string) => void;
  removePost: (id: string) => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      posts: [],
      addPost: (post) =>
        set((state) => ({
          posts: [
            {
              ...post,
              id: Date.now().toString(),
              timestamp: Date.now(),
              likes: 0,
              comments: 0 // You might enhance this later
            },
            ...state.posts
          ]
        })),
      likePost: (id) =>
        set((state) => ({
          posts: state.posts.map(p =>
            p.id === id
              ? { ...p, likes: p.likes + 1 }
              : p
          )
        })),
      removePost: (id) =>
        set((state) => ({
          posts: state.posts.filter(p => p.id !== id)
        })),
    }),
    {
      name: 'community-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Initialize with mock data for development
if (__DEV__) {
  const currentPosts = useCommunityStore.getState().posts;
  if (currentPosts.length === 0) {
    // Mock data needs to match the Omit type for addPost
    const mockPosts: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'comments'>[] = [
      {
        userId: '2',
        userName: 'Priya Mehta',
        userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
        content: 'Just discovered a great safety app called SheSafe! It has an SOS feature that alerts your emergency contacts with your location.',
      },
      {
        userId: '3',
        userName: 'Neha Singh',
        userImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
        content: "Safety tip: When using ride-sharing services, always verify the driver's identity and share your trip details with a trusted contact.",
      },
      {
        userId: '4',
        userName: 'Kavita Patel',
        userImage: 'https://images.unsplash.com/photo-1547212371-eb5e6a4b590c?q=80&w=200&auto=format&fit=crop',
        content: "There's a women's self-defense workshop happening this weekend at the community center. Anyone interested in joining?",
      },
    ];

    mockPosts.forEach(post => {
      useCommunityStore.getState().addPost(post);
    });
  }
}