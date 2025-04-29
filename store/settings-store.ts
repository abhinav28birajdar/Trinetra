import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppSettings } from "@/types";

interface SettingsStore {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  theme: "light",
  notifications: true,
  locationSharing: true,
  autoSOS: false,
  sosCountdownDuration: 5, // seconds
  sirenEnabled: true,
  vibrationEnabled: true,
  language: "en"
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      
      updateSettings: (updates) => {
        set(state => ({
          settings: {
            ...state.settings,
            ...updates
          }
        }));
      },
      
      resetSettings: () => {
        set({ settings: defaultSettings });
      }
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);