import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  Alert
} from 'react-native';
import { Plus, Edit } from 'lucide-react-native';
import { useContactsStore } from '@/store/contacts-store';
import { ContactCard } from '@/components/ContactCard';
import { Button as PaperButton } from 'react-native-paper';
import Colors from '@/constants/colors';
import { router, Href } from 'expo-router';
import { Contact } from '@/types';

export default function ContactsScreen() {
  const { contacts, deleteContact, setTrusted } = useContactsStore();

  const safeContacts = contacts || [];
  const trustedContacts = safeContacts.filter((contact: Contact) => contact.isTrusted);
  const otherContacts = safeContacts.filter((contact: Contact) => !contact.isTrusted);

  const handleCallContact = async (phoneNumber: string) => {
    if (!phoneNumber) {
        Alert.alert("Cannot Call", "Phone number is not available.");
        return;
    }
    if (Platform.OS === 'web') {
      alert(`On a real device, this would call ${phoneNumber}`);
      return;
    }
    const url = `tel:${phoneNumber.replace(/\s+/g, '')}`;
    try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
            await Linking.openURL(url);
        } else {
            Alert.alert("Cannot Call", `Unable to open the dialler for ${phoneNumber}.`);
        }
    } catch (error) {
        console.error("Failed to open phone dialler:", error);
        Alert.alert("Error", "An error occurred while trying to make the call.");
    }
  };

  const handleDeleteContact = (id: string) => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete this contact?')) {
        deleteContact(id);
      }
      return;
    }
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to permanently delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteContact(id)
        }
      ],
      { cancelable: true }
    );
  };

   const handleEditContact = (contact: Contact) => {
       console.log("Editing contact:", contact.id);
       try {
           const contactString = JSON.stringify(contact);
           // Construct URL string with encoded query parameter
           const destinationUrl = `/edit-contact?contact=${encodeURIComponent(contactString)}`;
           // Push the string URL, still using type assertion as a fallback
           router.push(destinationUrl as Href);
       } catch (e) {
           console.error("Failed to stringify/encode contact:", e);
           Alert.alert("Error", "Could not prepare contact data for editing.");
       }
   };

   const handleToggleTrusted = (id: string, isTrusted: boolean) => {
       console.log(`Setting trusted for ${id} to ${isTrusted}`);
       setTrusted(id, isTrusted);
   };

   const navigateTo = (path: Href) => {
       router.push(path);
   }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trusted Contacts</Text>
          {trustedContacts.length > 0 ? (
            <View style={styles.contactsList}>
              {trustedContacts.map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onCall={handleCallContact}
                  onDelete={handleDeleteContact}
                  onEdit={handleEditContact}
                  onToggleTrusted={handleToggleTrusted}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Tap the star on a contact to mark them as trusted. Trusted contacts may receive SOS alerts.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Contacts</Text>
          {otherContacts.length > 0 ? (
            <View style={styles.contactsList}>
              {otherContacts.map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onCall={handleCallContact}
                  onDelete={handleDeleteContact}
                  onEdit={handleEditContact}
                  onToggleTrusted={handleToggleTrusted}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {safeContacts.length > 0
                  ? 'All your contacts are marked as trusted.'
                  : 'You haven’t added any emergency contacts yet.'}
              </Text>
               {safeContacts.length === 0 && (
                 <TouchableOpacity onPress={() => navigateTo('/add-contact')} style={styles.emptyStateButton}>
                   <Text style={styles.emptyStateButtonText}>Add Your First Contact</Text>
                 </TouchableOpacity>
               )}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.addButtonContainer}>
         <PaperButton
            mode="contained"
            onPress={() => navigateTo('/add-contact')}
            style={styles.addButton}
            labelStyle={{ color: Colors.white }}
            icon={() => <Plus size={20} color={Colors.white} />}
         >
            Add New Contact
         </PaperButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[100],
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  contactsList: {
    gap: 12,
  },
  emptyState: {
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  emptyStateText: {
    color: Colors.subtext,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  emptyStateButton: {
    marginTop: 16,
    backgroundColor: Colors.primary + '1A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  emptyStateButtonText: {
     color: Colors.primary,
     fontWeight: '600',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 32 : 16,
    left: 16,
    right: 16,
  },
  addButton: {
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      backgroundColor: Colors.primary,
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 8,
  },
});