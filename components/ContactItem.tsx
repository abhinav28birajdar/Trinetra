import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
} from 'react-native';
import { Phone, User } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Contact } from '@/types';

interface ContactItemProps {
  contact: Contact;
  onPress?: () => void;
  onCall?: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  onPress,
  onCall,
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        contact.isEmergency ? styles.emergencyContact : {},
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <User size={24} color={Colors.primary} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.relationship}>{contact.relationship}</Text>
      </View>
      {onCall && (
        <TouchableOpacity 
          style={styles.callButton}
          onPress={onCall}
        >
          <Phone size={24} color={Colors.primary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    marginBottom: 12,
  },
  emergencyContact: {
    backgroundColor: Colors.primaryLight,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  relationship: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactItem;