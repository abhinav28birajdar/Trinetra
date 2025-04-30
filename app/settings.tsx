import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppSettings {
  language: string;
  enableNotifications: boolean;
  enableSounds: boolean;
  darkMode: boolean;
  
  // Add missing properties from settings.tsx
  enableSiren: boolean;
  autoCallPrimaryContact: boolean;
  enableFakeCall: boolean;
}

interface SettingsStore {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  enableNotifications: true,
  enableSounds: true,
  darkMode: false,
  
  // Add default values for the missing properties
  enableSiren: true,
  autoCallPrimaryContact: true,
  enableFakeCall: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (newSettings) => 
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);