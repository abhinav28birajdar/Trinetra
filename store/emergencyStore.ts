import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmergencyService } from '@/types';

interface EmergencyState {
  emergencyServices: EmergencyService[];
  isSOSActive: boolean;
  
  addEmergencyService: (service: EmergencyService) => void;
  removeEmergencyService: (id: string) => void;
  activateSOS: () => void;
  deactivateSOS: () => void;
}

export const useEmergencyStore = create<EmergencyState>()(
  persist(
    (set, get) => ({
      emergencyServices: [
        {
          id: '1',
          name: 'Police',
          number: '100',
          type: 'police',
        },
        {
          id: '2',
          name: 'Ambulance',
          number: '181',
          type: 'ambulance',
        },
      ],
      isSOSActive: false,
      
      addEmergencyService: (service) => {
        set(state => ({
          emergencyServices: [...state.emergencyServices, service]
        }));
      },
      
      removeEmergencyService: (id) => {
        set(state => ({
          emergencyServices: state.emergencyServices.filter(service => service.id !== id)
        }));
      },
      
      activateSOS: () => {
        set({ isSOSActive: true });
      },
      
      deactivateSOS: () => {
        set({ isSOSActive: false });
      },
    }),
    {
      name: 'emergency-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);