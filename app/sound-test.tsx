import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { playEmergencyAlert, stopSound } from '../lib/sound-utils';

export default function SoundTest() {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlaySound = async () => {
    try {
      if (isPlaying) {
        await stopSound();
        setIsPlaying(false);
        return;
      }

      console.log('Attempting to play sound...');
      const success = await playEmergencyAlert();
      console.log('Sound play result:', success);
      setIsPlaying(success);
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsPlaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sound Test</Text>
      <Text style={styles.status}>Status: {isPlaying ? 'Playing' : 'Stopped'}</Text>
      <Button 
        title={isPlaying ? "Stop Sound" : "Play Emergency Sound"} 
        onPress={handlePlaySound} 
        color={isPlaying ? "#ff3b30" : "#007aff"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
  },
});
