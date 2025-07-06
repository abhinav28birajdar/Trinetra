import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, Platform, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useContactsStore } from '@/store/contactsStore';
import { useThemeStore } from '@/store/themeStore';
import { useColors } from '@/constants/colors';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import ContactItem from '@/components/ContactItem';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Plus, User, Phone, X } from 'lucide-react-native';
import { Contact } from '@/types';
import * as Haptics from 'expo-haptics';

export default function ContactsScreen() {
  const router = useRouter();
  const { contacts, fetchContacts, addContact, deleteContact } = useContactsStore();
  const { isDarkMode } = useThemeStore();
  const Colors = useColors();
  
  const [search, setSearch] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New contact form state
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelationship, setNewContactRelationship] = useState('');
  const [isEmergencyContact, setIsEmergencyContact] = useState(false);
  
  useEffect(() => {
    fetchContacts();
  }, []);
  
  useEffect(() => {
    if (search) {
      const filtered = contacts.filter(contact => 
        contact.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [search, contacts]);
  
  const handleCallContact = (contact: Contact) => {
    router.push({
      pathname: '/call',
      params: { number: contact.phone_number, name: contact.name },
    });
  };
  
  const handleDeleteContact = (contact: Contact) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      "Delete Contact",
      `Are you sure you want to delete ${contact.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => deleteContact(contact.id),
          style: "destructive"
        }
      ]
    );
  };
  
  const handleAddContact = async () => {
    if (!newContactName || !newContactPhone) {
      Alert.alert("Error", "Name and phone number are required");
      return;
    }
    
    await addContact({
      name: newContactName,
      phone_number: newContactPhone,
      relationship: newContactRelationship || null,
      is_emergency_contact: isEmergencyContact,
    });
    
    // Reset form and close modal
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRelationship('');
    setIsEmergencyContact(false);
    setShowAddModal(false);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background.primary }]}>
      <View style={[styles.header, { backgroundColor: Colors.primary }]}>
        <Header title="Contact List" showBackButton isDarkMode={isDarkMode} />
      </View>
      
      <View style={styles.content}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="search.."
          isDarkMode={isDarkMode}
        />
        
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContactItem
              contact={item}
              onCallPress={() => handleCallContact(item)}
              onDeletePress={() => handleDeleteContact(item)}
              isDarkMode={isDarkMode}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: Colors.text.dark }]}>
                No contacts found. Add some contacts!
              </Text>
            </View>
          }
        />
        
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: isDarkMode ? Colors.background.secondary : '#F5F5F5' }]}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Add Contact Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: Colors.background.primary }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: Colors.text.dark }]}>Add New Contact</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            
            <Input
              value={newContactName}
              onChangeText={setNewContactName}
              placeholder="Contact Name"
              icon={<User size={20} color={Colors.primary} />}
              isDarkMode={isDarkMode}
            />
            
            <Input
              value={newContactPhone}
              onChangeText={setNewContactPhone}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              icon={<Phone size={20} color={Colors.primary} />}
              isDarkMode={isDarkMode}
            />
            
            <Input
              value={newContactRelationship}
              onChangeText={setNewContactRelationship}
              placeholder="Relationship (Family, Friend, etc.)"
              isDarkMode={isDarkMode}
            />
            
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: Colors.text.dark }]}>Emergency Contact</Text>
              <Switch
                value={isEmergencyContact}
                onValueChange={setIsEmergencyContact}
                trackColor={{ false: '#E0E0E0', true: Colors.primaryLight }}
                thumbColor={isEmergencyContact ? Colors.primary : '#F5F5F5'}
              />
            </View>
            
            <Button
              title="Add Contact"
              onPress={handleAddContact}
              style={styles.addContactButton}
              isDarkMode={isDarkMode}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
  },
  addContactButton: {
    marginTop: 10,
  },
});