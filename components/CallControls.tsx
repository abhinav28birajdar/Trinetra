import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Mic, MicOff, Volume2, MoreVertical } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface CallControlsProps {
  isMuted: boolean;
  toggleMute: () => void;
  onEndCall: () => void;
}

export default function CallControls({ 
  isMuted, 
  toggleMute, 
  onEndCall 
}: CallControlsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.controlButton}>
          <View style={styles.dialpadIcon}>
            <Text style={styles.dialpadDots}>•••</Text>
            <Text style={styles.dialpadDots}>•••</Text>
            <Text style={styles.dialpadDots}>•••</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
          {isMuted ? (
            <MicOff size={24} color={Colors.text.light} />
          ) : (
            <Mic size={24} color={Colors.text.light} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <Volume2 size={24} color={Colors.text.light} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <MoreVertical size={24} color={Colors.text.light} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.endCallButton} onPress={onEndCall}>
        <Text style={styles.endCallText}>End</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialpadIcon: {
    alignItems: 'center',
  },
  dialpadDots: {
    color: Colors.text.light,
    fontSize: 10,
    lineHeight: 10,
  },
  endCallButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.button.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallText: {
    color: Colors.text.light,
    fontSize: 18,
    fontWeight: 'bold',
  },
});