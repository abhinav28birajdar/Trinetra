import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Colors from '@/constants/colors';

interface EmergencyButtonProps {
  title: string;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const buttonWidth = width * 0.9;

export default function EmergencyButton({ title, onPress }: EmergencyButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: buttonWidth,
    height: 60,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: Colors.text.light,
    fontSize: 18,
    fontWeight: 'bold',
  },
});