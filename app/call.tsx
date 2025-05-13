import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import CallControls from '@/components/CallControls';

export default function CallScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ number: string; name: string }>();
  const user = useAuthStore((state) => state.user);
  
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  useEffect(() => {
    // Simulate call duration timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleEndCall = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header showAvatar username={user?.username} showSettingsButton />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.callingText}>Calling Via SIM1</Text>
        
        {params.number === '100' ? (
          <Text style={styles.numberText}>{params.number}</Text>
        ) : (
          <Text style={styles.nameText}>{params.name} Emergency</Text>
        )}
        
        <Text style={styles.nameText}>{params.name}</Text>
        
        <Text style={styles.durationText}>{formatTime(callDuration)}</Text>
        
        <View style={styles.controlsContainer}>
          <CallControls
            isMuted={isMuted}
            toggleMute={toggleMute}
            onEndCall={handleEndCall}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  callingText: {
    fontSize: 16,
    color: Colors.text.light,
    marginBottom: 8,
  },
  numberText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginBottom: 8,
  },
  nameText: {
    fontSize: 24,
    color: Colors.text.light,
    marginBottom: 24,
  },
  durationText: {
    fontSize: 18,
    color: Colors.text.light,
    marginBottom: 48,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
});