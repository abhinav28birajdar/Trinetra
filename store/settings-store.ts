import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '@/types';

interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
}

const defaultSettings: AppSettings = {
  enableSiren: true,
  autoCallPrimary: true,
  language: 'en',
  enableFakeCall: true,
  darkMode: false
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isLoading: false,
      
      updateSettings: async (newSettings) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const updatedSettings = {
            ...get().settings,
            ...newSettings
          };
          
          set({ 
            settings: updatedSettings,
            isLoading: false
          });
        } catch (error) {
          console.error('Failed to update settings:', error);
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);