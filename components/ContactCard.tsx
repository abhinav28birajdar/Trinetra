import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Phone, Star, Trash2, Edit } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Contact } from "@/types";

interface ContactCardProps {
  contact: Contact;
  onCall: (phoneNumber: string) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onToggleTrusted: (id: string, isTrusted: boolean) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onCall,
  onEdit,
  onDelete,
  onToggleTrusted
}) => {
  return (
    <View style={[
      styles.container,
      contact.isTrusted && styles.trustedContainer
    ]}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{contact.name.charAt(0)}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.details}>{contact.relationship} • {contact.phoneNumber}</Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onCall(contact.phoneNumber)}
        >
          <Phone size={20} color={Colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onToggleTrusted(contact.id, !contact.isTrusted)}
        >
          <Star 
            size={20} 
            color={contact.isTrusted ? Colors.warning : Colors.gray[400]} 
            fill={contact.isTrusted ? Colors.warning : "transparent"} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onEdit(contact)}
        >
          <Edit size={20} color={Colors.secondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onDelete(contact.id)}
        >
          <Trash2 size={20} color={Colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trustedContainer: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.tertiary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  }
});