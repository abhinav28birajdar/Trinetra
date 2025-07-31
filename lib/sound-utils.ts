import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Alert, Platform, Vibration } from 'react-native';

// Sound references for managing sounds
let emergencySoundRef: Audio.Sound | null = null;
let soundLoaded = false;

// Initialize Audio
export const initAudio = async () => {
  try {
    // Set audio mode for better playback
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
    return true;
  } catch (error) {
    console.error("Failed to initialize audio:", error);
    return false;
  }
};

// Stop any playing sound
export const stopSound = async (): Promise<void> => {
  try {
    // Stop vibration pattern if active
    Vibration.cancel();
    
    // Stop sound if playing
    if (emergencySoundRef) {
      await emergencySoundRef.stopAsync();
      await emergencySoundRef.unloadAsync();
      emergencySoundRef = null;
      soundLoaded = false;
    }
  } catch (error) {
    console.error("Error stopping sound:", error);
  }
};

// Play emergency alert sound with multiple fallback strategies
export const playEmergencyAlert = async (): Promise<boolean> => {
  try {
    // If sound is already playing, stop it
    await stopSound();
    
    console.log("Attempting to play emergency sound");
    
    try {
      // Initialize Audio first
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
      
      // Force unload any previous instance first to avoid conflicts
      if (emergencySoundRef) {
        try {
          await emergencySoundRef.stopAsync();
          await emergencySoundRef.unloadAsync();
        } catch (e) {
          console.log('Error unloading previous sound:', e);
        }
        emergencySoundRef = null;
      }
      
      console.log('Trying multiple approaches to load sound...');
      
      const soundObject = new Audio.Sound();
      let loaded = false;
      
      // Approach 1: Try loading from sounds directory using require
      try {
        console.log('Approach 1: Loading from sounds directory using require');
        await soundObject.loadAsync(require('../assets/sounds/emergency_alert.mp3'));
        loaded = true;
        console.log('Sound loaded successfully from sounds directory');
      } catch (error1) {
        console.log('Approach 1 failed:', error1);
        
        // Approach 2: Try loading from images directory using require
        try {
          console.log('Approach 2: Loading from images directory using require');
          await soundObject.unloadAsync(); // Make sure to unload first
          await soundObject.loadAsync(require('../assets/images/emergency_alert.mp3'));
          loaded = true;
          console.log('Sound loaded successfully from images directory');
        } catch (error2) {
          console.log('Approach 2 failed:', error2);
          
          // Approach 3: Try using asset module resolver
          try {
            console.log('Approach 3: Using asset module resolver');
            await soundObject.unloadAsync(); // Make sure to unload first
            await soundObject.loadAsync({ uri: Asset.fromModule(require('../assets/sounds/emergency_alert.mp3')).uri });
            loaded = true;
            console.log('Sound loaded successfully with asset module resolver');
          } catch (error3) {
            console.log('Approach 3 failed:', error3);
            
            // Approach 4: Try using a local file URI
            try {
              console.log('Approach 4: Using local file URI');
              
              // Use FileSystem to get the local URI
              const soundsDir = FileSystem.documentDirectory + 'sounds/';
              const soundPath = soundsDir + 'emergency_alert.mp3';
              
              // Check if directory exists, create if not
              const dirInfo = await FileSystem.getInfoAsync(soundsDir);
              if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(soundsDir, { intermediates: true });
              }
              
              // Check if file exists, if not, copy from assets
              const fileInfo = await FileSystem.getInfoAsync(soundPath);
              if (!fileInfo.exists) {
                // Copying from asset to local file system
                await FileSystem.downloadAsync(
                  Asset.fromModule(require('../assets/sounds/emergency_alert.mp3')).uri,
                  soundPath
                );
              }
              
              await soundObject.unloadAsync(); // Make sure to unload first
              await soundObject.loadAsync({ uri: soundPath });
              loaded = true;
              console.log('Sound loaded successfully with local file URI');
            } catch (error4) {
              console.log('Approach 4 failed:', error4);
              
              // Final approach: Try with hardcoded asset URI 
              try {
                console.log('Final approach: Using hardcoded asset URI');
                
                // Hardcoded URIs per platform
                const assetUri = Platform.OS === 'android' 
                  ? 'asset:/asset/sounds/emergency_alert.mp3'
                  : 'asset:///sounds/emergency_alert.mp3';
                  
                await soundObject.unloadAsync(); // Make sure to unload first
                await soundObject.loadAsync({ uri: assetUri });
                loaded = true;
                console.log('Sound loaded successfully with hardcoded URI');
              } catch (finalError) {
                console.log('All approaches failed:', finalError);
                throw new Error('Could not load sound file using any method');
              }
            }
          }
        }
      }
      
      if (!loaded) {
        throw new Error('Could not load sound file');
      }
      
      // Set the volume to maximum
      await soundObject.setVolumeAsync(1.0);
      
      // Set to loop
      await soundObject.setIsLoopingAsync(true);
      
      // Play the sound
      await soundObject.playAsync();
      
      console.log('Sound created and playing successfully');
      emergencySoundRef = soundObject;
      soundLoaded = true;
      
      // Also use vibration for enhanced feedback
      Vibration.vibrate([500, 300, 500, 300, 500], true); // true for repeating pattern
      
      return true;
      
    } catch (soundError) {
      console.error("Sound playback failed:", soundError);
      
      // Fallback to vibration if sound fails
      Vibration.vibrate([500, 300, 500, 300, 500]);
      
      // Display alert for the emergency
      Alert.alert("Emergency Alert", "SOS Emergency Mode Activated");
      
      return true;
    }
  } catch (error) {
    console.error("Emergency alert failed:", error);
    
    // Just show alert as fallback
    Alert.alert("Emergency Alert", "SOS Emergency Mode Activated");
    return true; // Still return true as we showed the alert
  }
};
