// store/safety-tips-store.ts
import { create } from 'zustand';
import { SafetyTip, SafetyTipCategory } from '@/types'; // Import the specific type too

interface SafetyTipsState {
  tips: SafetyTip[];
  currentTipIndex: number;
  getRandomTip: () => SafetyTip;
  getNextTip: () => SafetyTip;
}

// Ensure these categories match the SafetyTipCategory type in types/index.ts
const safetyTips: SafetyTip[] = [
  {
    id: '1',
    title: 'Stay Aware',
    content: 'Always be aware of your surroundings, especially in unfamiliar areas.',
    category: 'awareness', // Use lowercase matching the type
  },
  {
    id: '2',
    title: 'Share Your Location',
    content: "Let someone know where you're going and when you expect to return.",
    category: 'planning',
  },
  {
    id: '3',
    title: 'Trust Your Instincts',
    content: 'If something feels wrong, trust your gut and remove yourself from the situation.',
    category: 'awareness',
  },
  {
    id: '4',
    title: 'Stay Connected',
    content: 'Keep your phone charged and accessible at all times.',
    category: 'preparedness',
  },
  {
    id: '5',
    title: 'Use Well-Lit Routes',
    content: 'Stick to well-lit, populated areas, especially at night.',
    category: 'travel',
  },
  {
    id: '6',
    title: 'Ride Safety',
    content: 'Always verify your ride-share driver and vehicle before getting in.',
    category: 'travel',
  },
  {
    id: '7',
    title: 'Emergency Contacts',
    content: 'Keep emergency contacts easily accessible on your phone.',
    category: 'preparedness',
  },
  {
    id: '8',
    title: 'Be Confident',
    content: 'Walk with purpose and confidence to deter potential threats.',
    category: 'awareness',
  },
  {
    id: '9',
    title: 'Public Transportation',
    content: 'Sit near the driver or in a populated car when using public transportation.',
    category: 'public', // Changed from 'travel' to 'public' based on error union
  },
  {
    id: '10',
    title: 'Digital Safety',
    content: 'Be cautious about sharing your location on social media in real-time.',
    category: 'digital',
  },
];

export const useSafetyTipsStore = create<SafetyTipsState>((set, get) => ({
  tips: safetyTips,
  currentTipIndex: Math.floor(Math.random() * safetyTips.length),

  getRandomTip: () => {
    const randomIndex = Math.floor(Math.random() * get().tips.length);
    set({ currentTipIndex: randomIndex });
    return get().tips[randomIndex];
  },

  getNextTip: () => {
    const nextIndex = (get().currentTipIndex + 1) % get().tips.length;
    set({ currentTipIndex: nextIndex });
    return get().tips[nextIndex];
  },
}));