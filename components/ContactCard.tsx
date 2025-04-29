import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Phone, Trash2, Star } from 'lucide-react-native';
import { EmergencyContact } from '@/types';
import { colors } from '@/constants/Colors';

interface ContactCardProps {
  contact: EmergencyContact;
  onCall: (phoneNumber: string) => void;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onCall,
  onDelete,
  onSetPrimary
}) => {
  return (
    <View style={[
      styles.container,
      contact.isPrimary && styles.primaryContainer
    ]}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{contact.fullName}</Text>
        <Text style={styles.relationship}>{contact.relationship}</Text>
        <Text style={styles.phone}>{contact.phoneNumber}</Text>
        
        {contact.isPrimary && (
          <View style={styles.primaryBadge}>
            <Star size={12} color={colors.white} />
            <Text style={styles.primaryText}>Primary</Text>
          </View>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onCall(contact.phoneNumber)}
        >
          <Phone size={20} color={colors.primary} />
        </TouchableOpacity>
        
        {!contact.isPrimary && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onSetPrimary(contact.id)}
          >
            <Star size={20} color={colors.warning} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onDelete(contact.id)}
        >
          <Trash2 size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
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
  primaryContainer: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    backgroundColor: colors.cardBackground,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  relationship: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  primaryText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});