import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  MoreVertical,
  Grid,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

export default function CallScreen() {
  const router = useRouter();
  const { number, type } = useLocalSearchParams();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  useEffect(() => {
    // Simulate call connection
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    // Attempt to make a real call on supported platforms
    if (Platform.OS !== 'web') {
      const phoneNumber = `tel:${number}`;
      Linking.canOpenURL(phoneNumber)
        .then(supported => {
          if (supported) {
            // Just for demo, we don't actually make the call
            // Linking.openURL(phoneNumber);
          }
        })
        .catch(err => console.error('Error with phone call:', err));
    }
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleEndCall = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    router.back();
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };
  
  const toggleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };
  
  const getCallTitle = () => {
    if (type === 'emergency') {
      return 'Police';
    } else if (type === 'contact') {
      return 'Family Emergency';
    }
    return 'Call';
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.callInfo}>
        <Text style={styles.callStatus}>Calling Via SIM1</Text>
        <Text style={styles.callNumber}>{number}</Text>
        <Text style={styles.callName}>{getCallTitle()}</Text>
      </View>
      
      <View style={styles.callControls}>
        <TouchableOpacity style={styles.controlButton} onPress={() => {}}>
          <Grid size={24} color={Colors.white} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
          {isMuted ? (
            <MicOff size={24} color={Colors.white} />
          ) : (
            <Mic size={24} color={Colors.white} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={toggleSpeaker}>
          <Volume2 size={24} color={Colors.white} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={() => {}}>
          <MoreVertical size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.endCallButton}
        onPress={handleEndCall}
      >
        <Text style={styles.endCallText}>End</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  callInfo: {
    alignItems: 'center',
  },
  callStatus: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 8,
  },
  callNumber: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  callName: {
    color: Colors.white,
    fontSize: 18,
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.endCallButton,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  endCallText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});