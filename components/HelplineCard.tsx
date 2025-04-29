import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Phone } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { Helpline } from '@/types';

interface HelplineCardProps {
  helpline: Helpline;
}

export const HelplineCard: React.FC<HelplineCardProps> = ({ helpline }) => {
  const handleCall = async () => {
    const phoneNumber = helpline.number.replace(/\s/g, '');
    const phoneUrl = Platform.OS === 'android' 
      ? `tel:${phoneNumber}` 
      : `telprompt:${phoneNumber}`;
    
    try {
      if (Platform.OS !== 'web') {
        await Linking.openURL(phoneUrl);
      } else {
        console.log('Phone calls are not supported in web');
        // In a real app, we would show a toast or alert here
      }
    } catch (error) {
      console.error('Failed to make call', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.service}>{helpline.service}</Text>
        <Text style={styles.number}>{helpline.number}</Text>
        <Text style={styles.description}>{helpline.description}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.callButton}
        onPress={handleCall}
      >
        <Phone size={20} color={colors.white} />
        <Text style={styles.callText}>Call</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
  },
  service: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  number: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 16,
  },
  callText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: 8,
  },
});