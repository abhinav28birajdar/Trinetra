import { create } from "zustand";
import { SOSState } from "@/types";
import { useContactsStore } from "./contacts-store";
import { useSettingsStore } from "./settings-store"; // Assuming this exists
import * as Location from "expo-location";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
// Import persist/AsyncStorage if you intend to persist SOS state (might not be desirable)

// Define the actions specific to the SOS store
interface SOSActions {
  initiateSOS: () => Promise<void>; // Start the SOS process
  deactivateSOS: () => void; // Cancel/end the SOS process (changed from cancelSOS)
  toggleSiren: () => void; // Action to toggle the siren sound
  updateLocation: () => Promise<void>; // Update location periodically
  decrementCountdown: () => void; // Decrement the visual countdown
  resetCountdown: () => void; // Reset countdown based on settings
  // Add other specific actions if needed
}

// Combine SOSState and SOSActions for the full store type
type SOSStore = SOSState & SOSActions;

// Define the initial state structure, ensuring all properties from SOSState are present
const initialState: SOSState = {
  isActive: false,
  countdown: 5, // Default or load from settings later
  location: null,
  activatedAt: null,
  notifiedContacts: [],
  sirenActive: false, // *** Added missing initial state ***
};

export const useSOSStore = create<SOSStore>((set, get) => ({
  ...initialState, // Spread the initial state

  initiateSOS: async () => {
    console.log("Attempting to initiate SOS...");
    try {
      const { settings } = useSettingsStore.getState(); // Get current settings
      const initialCountdown = settings.sosCountdownDuration > 0 ? settings.sosCountdownDuration : 1; // Ensure countdown > 0

      set({ countdown: initialCountdown }); // Set countdown immediately

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission denied for SOS.");
        // Optionally set an error state in the store
        // set({ error: "Location permission required." });
        return;
      }
      console.log("Location permission granted.");

      // Set loading/activating state?
      // set({ isLoading: true });

      const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High, // Request high accuracy
      });
      console.log("Location obtained:", location.coords);

      // Trigger haptics if enabled
      if (settings.vibrationEnabled && Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        console.log("Haptic feedback triggered.");
      }

      // Activate SOS state
      set({
        isActive: true,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        activatedAt: new Date(),
        sirenActive: settings.sirenEnabled, // Set siren based on settings
        // isLoading: false,
      });
      console.log("SOS state activated.");

      // Start location updates (don't wait for it)
      get().updateLocation();

      // Get trusted contacts and notify (simulated)
      const trustedContacts = useContactsStore.getState().getTrustedContacts();
      const trustedContactIds = trustedContacts.map(contact => contact.id);
      set({ notifiedContacts: trustedContactIds });
      console.log("Notifying trusted contacts (simulation):", trustedContactIds);

      // TODO: Implement actual notification logic here (API call, SMS, etc.)
      // TODO: Implement actual siren sound logic here if sirenActive is true


    } catch (error) {
      console.error("Error initiating SOS:", error);
      // set({ error: "Failed to initiate SOS.", isActive: false, isLoading: false });
      set({ isActive: false }); // Ensure SOS is not active on error
    }
  },

  // Renamed from cancelSOS to deactivateSOS for consistency with component
  deactivateSOS: () => {
    console.log("Deactivating SOS.");
    // TODO: Stop siren sound if it was playing
    set({ ...initialState }); // Reset to the defined initial state
    // Optionally send "I'm safe" message to contacts
  },

  // *** Added toggleSiren action ***
  toggleSiren: () => {
    const currentState = get().sirenActive;
    const newState = !currentState;
    console.log(`Toggling siren to ${newState ? 'ON' : 'OFF'}`);
    // TODO: Add logic here to PLAY or STOP the siren sound based on 'newState'
    set({ sirenActive: newState });
  },

  updateLocation: async () => {
    if (!get().isActive) return; // Only update if SOS is active

    try {
      // Consider using watchPositionAsync for continuous updates if needed,
      // but getCurrentPositionAsync is fine for periodic updates.
      const location = await Location.getCurrentPositionAsync({
           accuracy: Location.Accuracy.High,
      });
      console.log("Updating location:", location.coords);

      set({
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });

      // TODO: Send updated location to backend/contacts if necessary

      // Schedule next update (only if still active)
      // Clear any previous timeouts? Not strictly necessary with this structure
      // but good practice if update interval could change.
      setTimeout(() => {
         if (get().isActive) { // Check again before scheduling next update
             get().updateLocation();
         }
      }, 30000); // Update every 30 seconds (adjust interval as needed)

    } catch (error) {
      console.error("Error updating location during SOS:", error);
      // Decide how to handle location update errors (retry? notify user?)
    }
  },

  decrementCountdown: () => {
    set(state => {
        if (state.countdown > 0) {
            return { countdown: state.countdown - 1 };
        }
        return {}; // No change if countdown is already 0
    });
  },

  resetCountdown: () => {
    // Reset countdown based on current settings
    const { settings } = useSettingsStore.getState();
    const initialCountdown = settings.sosCountdownDuration > 0 ? settings.sosCountdownDuration : 1;
    set({ countdown: initialCountdown });
  }
}));