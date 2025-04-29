import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking, Platform } from 'react-native';
import Colors from '@/constants/colors';

interface EmergencyServiceButtonProps {
  title: string;
  phoneNumber: string;
  color: string;
  icon: React.ReactNode;
}

export const EmergencyServiceButton: React.FC<EmergencyServiceButtonProps> = ({
  title,
  phoneNumber,
  color,
  icon,
}) => {
  const handlePress = async () => {
    // On web, we can't directly make calls
    if (Platform.OS === 'web') {
      alert(`In a real emergency, call ${phoneNumber}`);
      return;
    }
    
    const url = `tel:${phoneNumber}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      alert(`Unable to call ${phoneNumber}`);
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: color }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {icon}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});