import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Phone, User, Trash2 } from 'lucide-react-native';
import { useColors } from '@/constants/colors';
import { Contact } from '@/types';

interface ContactItemProps {
  contact: Contact;
  onPress?: () => void;
  onCallPress?: () => void;
  onDeletePress?: () => void;
  isDarkMode?: boolean;
}

export default function ContactItem({ 
  contact, 
  onPress, 
  onCallPress,
  onDeletePress,
  isDarkMode = false,
}: ContactItemProps) {
  const Colors = useColors();
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: isDarkMode ? Colors.background.card : '#F0E6FF' }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer, 
        { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E6E6FA' }
      ]}>
        <User size={24} color={Colors.primary} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: Colors.primary }]}>{contact.name}</Text>
        <Text style={[styles.phone, { color: isDarkMode ? Colors.text.secondary : Colors.text.dark }]}>
          {contact.phone}
        </Text>
        {contact.isEmergencyContact && (
          <View style={[styles.emergencyBadge, { backgroundColor: Colors.primary }]}>
            <Text style={styles.emergencyText}>Emergency</Text>
          </View>
        )}
      </View>
      <View style={styles.actionsContainer}>
        {onCallPress && (
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E6E6FA' }
            ]}
            onPress={onCallPress}
          >
            <Phone size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
        {onDeletePress && (
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              styles.deleteButton,
              { backgroundColor: isDarkMode ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)' }
            ]}
            onPress={onDeletePress}
          >
            <Trash2 size={20} color={Colors.button.danger} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
  },
  phone: {
    fontSize: 14,
    marginTop: 2,
  },
  emergencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
});