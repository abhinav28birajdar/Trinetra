import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
  SafeAreaView
} from "react-native";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import { useContactsStore } from "@/store/contacts-store";
import { ContactCard } from "@/components/ContactCard";
import { Button } from "@/components/Button";
import Colors from "@/constants/colors";
import { Contact } from "@/types";

export default function ContactsScreen() {
  const { contacts, deleteContact, setTrusted } = useContactsStore();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  const trustedContacts = contacts.filter(contact => contact.isTrusted);
  const otherContacts = contacts.filter(contact => !contact.isTrusted);
  
  const handleCallContact = async (phoneNumber: string) => {
    if (Platform.OS === "web") {
      alert(`In a real app, this would call ${phoneNumber}`);
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
  
  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    router.push({
      pathname: "/contacts/add",
      params: { id: contact.id }
    });
  };
  
  const handleDeleteContact = (id: string) => {
    if (Platform.OS === "web") {
      if (confirm("Are you sure you want to delete this contact?")) {
        deleteContact(id);
      }
    } else {
      Alert.alert(
        "Delete Contact",
        "Are you sure you want to delete this contact?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => deleteContact(id) }
        ]
      );
    }
  };
  
  const handleToggleTrusted = (id: string, isTrusted: boolean) => {
    setTrusted(id, isTrusted);
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Contacts Added</Text>
      <Text style={styles.emptyDescription}>
        Add emergency contacts to quickly reach them during emergencies.
      </Text>
      <Button
        title="Add Your First Contact"
        leftIcon={<Plus size={20} color={Colors.white} />}
        onPress={() => router.push("/contacts/add")}
        style={styles.addFirstButton}
      />
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {contacts.length > 0 ? (
        <FlatList
          data={[]}
          renderItem={null}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <Text style={styles.headerText}>
                  Add trusted contacts who can help you in emergencies.
                </Text>
              </View>
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trusted Contacts</Text>
                
                {trustedContacts.length > 0 ? (
                  trustedContacts.map(contact => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onCall={handleCallContact}
                      onEdit={handleEditContact}
                      onDelete={handleDeleteContact}
                      onToggleTrusted={handleToggleTrusted}
                    />
                  ))
                ) : (
                  <View style={styles.emptySection}>
                    <Text style={styles.emptyText}>
                      No trusted contacts yet. Mark contacts as trusted for quick access during emergencies.
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Other Contacts</Text>
                
                {otherContacts.length > 0 ? (
                  otherContacts.map(contact => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onCall={handleCallContact}
                      onEdit={handleEditContact}
                      onDelete={handleDeleteContact}
                      onToggleTrusted={handleToggleTrusted}
                    />
                  ))
                ) : (
                  <View style={styles.emptySection}>
                    <Text style={styles.emptyText}>
                      {contacts.length > 0 
                        ? "All your contacts are marked as trusted."
                        : "No contacts added yet."}
                    </Text>
                  </View>
                )}
              </View>
            </>
          }
          ListFooterComponent={<View style={{ height: 80 }} />}
        />
      ) : (
        renderEmptyState()
      )}
      
      <View style={styles.addButtonContainer}>
        <Button
          title="Add New Contact"
          leftIcon={<Plus size={20} color={Colors.white} />}
          onPress={() => router.push("/contacts/add")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    backgroundColor: Colors.tertiary,
    padding: 16,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  emptySection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  addFirstButton: {
    width: "100%",
  }
});