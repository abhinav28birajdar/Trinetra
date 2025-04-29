import { create } from 'zustand';
import { SafetyTip } from '@/types';

interface SafetyTipsState {
  tips: SafetyTip[];
  currentTipIndex: number;
  getRandomTip: () => SafetyTip;
  getNextTip: () => SafetyTip;
}

const safetyTips: SafetyTip[] = [
  {
    id: '1',
    title: 'Stay Aware',
    content: 'Always be aware of your surroundings, especially in unfamiliar areas.',
  },
  {
    id: '2',
    title: 'Share Your Location',
    content: "Let someone know where you're going and when you expect to return.",
  },
  {
    id: '3',
    title: 'Trust Your Instincts',
    content: 'If something feels wrong, trust your gut and remove yourself from the situation.',
  },
  {
    id: '4',
    title: 'Stay Connected',
    content: 'Keep your phone charged and accessible at all times.',
  },
  {
    id: '5',
    title: 'Use Well-Lit Routes',
    content: 'Stick to well-lit, populated areas, especially at night.',
  },
  {
    id: '6',
    title: 'Ride Safety',
    content: 'Always verify your ride-share driver and vehicle before getting in.',
  },
  {
    id: '7',
    title: 'Emergency Contacts',
    content: 'Keep emergency contacts easily accessible on your phone.',
  },
  {
    id: '8',
    title: 'Be Confident',
    content: 'Walk with purpose and confidence to deter potential threats.',
  },
  {
    id: '9',
    title: 'Public Transportation',
    content: 'Sit near the driver or in a populated car when using public transportation.',
  },
  {
    id: '10',
    title: 'Digital Safety',
    content: 'Be cautious about sharing your location on social media in real-time.',
  },
];

export const useSafetyTipsStore = create<SafetyTipsState>((set, get) => ({
  tips: safetyTips,
  currentTipIndex: Math.floor(Math.random() * safetyTips.length),
  
  getRandomTip: () => {
    const randomIndex = Math.floor(Math.random() * safetyTips.length);
    set({ currentTipIndex: randomIndex });
    return safetyTips[randomIndex];
  },
  
  getNextTip: () => {
    const nextIndex = (get().currentTipIndex + 1) % safetyTips.length;
    set({ currentTipIndex: nextIndex });
    return safetyTips[nextIndex];
  },
}));