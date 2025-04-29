import React, { useState } from 'react';
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
import { Plus } from 'lucide-react-native';
import { useContactsStore } from '@/store/contacts-store';
import { ContactCard } from '@/components/ContactCard';
import { Button } from '@/components/Button';
import Colors from '@/constants/colors';
import { router } from 'expo-router';

export default function ContactsScreen() {
  const { contacts, removeContact, toggleFavorite } = useContactsStore();
  
  const favoriteContacts = contacts.filter(contact => contact.isFavorite);
  const otherContacts = contacts.filter(contact => !contact.isFavorite);
  
  const handleCallContact = async (phoneNumber: string) => {
    if (Platform.OS === 'web') {
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
  
  const handleDeleteContact = (id: string) => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete this contact?')) {
        removeContact(id);
      }
    } else {
      Alert.alert(
        'Delete Contact',
        'Are you sure you want to delete this contact?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => removeContact(id) }
        ]
      );
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Contacts</Text>
          
          {favoriteContacts.length > 0 ? (
            <View style={styles.contactsList}>
              {favoriteContacts.map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onCall={handleCallContact}
                  onDelete={handleDeleteContact}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No favorite contacts yet. Mark contacts as favorites for quick access.
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Contacts</Text>
          
          {otherContacts.length > 0 ? (
            <View style={styles.contactsList}>
              {otherContacts.map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onCall={handleCallContact}
                  onDelete={handleDeleteContact}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {contacts.length > 0 
                  ? 'All your contacts are marked as favorites.'
                  : 'No contacts added yet. Add your emergency contacts.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.addButtonContainer}>
        <Button
          title="Add New Contact"
          leftIcon={<Plus size={20} color={Colors.white} />}
          onPress={() => router.push('/add-contact')}
        />
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
    paddingBottom: 80, // Space for the add button
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  contactsList: {
    gap: 12,
  },
  emptyState: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    color: Colors.subtext,
    textAlign: 'center',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
});