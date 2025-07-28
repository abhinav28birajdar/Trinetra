import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Linking,
    Modal,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';

const { width, height } = Dimensions.get('window');

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  color: string;
  is_emergency: boolean;
}

export default function ContactsScreen() {
  const { user } = useAuthStore();
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Father', phone: '+1234567890', relationship: 'Father', color: '#EF4444', is_emergency: true },
    { id: '2', name: 'Mother', phone: '+1234567891', relationship: 'Mother', color: '#10B981', is_emergency: true },
    { id: '3', name: 'Brother', phone: '+1234567892', relationship: 'Brother', color: '#3B82F6', is_emergency: false },
    { id: '4', name: 'Best Friend', phone: '+1234567893', relationship: 'Friend', color: '#8B5CF6', is_emergency: false },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
    is_emergency: false
  });

  const filteredContacts = contacts.filter(contact => 
    contact && 
    contact.name && 
    contact.relationship && 
    (contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     contact.relationship.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCall = async (phoneNumber: string, contactName: string) => {
    if (!phoneNumber) return;
    
    Alert.alert(
      `Call ${contactName}`,
      `Do you want to call ${phoneNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: async () => {
            try {
              // Log the call
              if (user) {
                await supabase.from('call_logs').insert({
                  user_id: user.id,
                  phone_number: phoneNumber,
                  contact_name: contactName,
                  call_type: 'outgoing',
                  started_at: new Date().toISOString(),
                  duration: 0,
                });
              }
              
              // Make the call
              await Linking.openURL(`tel:${phoneNumber}`);
            } catch (error) {
              console.error('Error making call:', error);
              Alert.alert('Error', 'Could not make the call');
            }
          }
        }
      ]
    );
  };

  const deleteContact = (contactId: string) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setContacts(prev => prev.filter(contact => contact.id !== contactId));
          }
        }
      ]
    );
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship || 'Friend',
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      is_emergency: newContact.is_emergency
    };

    setContacts(prev => [...prev, contact]);
    setNewContact({ name: '', phone: '', relationship: '', is_emergency: false });
    setShowAddModal(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const renderContact = useCallback(({ item }: { item: Contact }) => {
    if (!item || !item.id || !item.name) {
      return null;
    }

    const displayName = item.name || 'Unknown Contact';
    const displayPhone = item.phone || 'No phone';
    const displayRelationship = item.relationship || 'No relationship';
    const displayColor = item.color || '#7C3AED';

    return (
      <View style={{
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        {/* Contact Avatar */}
        <View style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: displayColor + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: displayColor
          }}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Contact Info */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1F2937',
            flex: 1
          }}>
            {displayName}
          </Text>
          {item.is_emergency && (
            <View style={{
              backgroundColor: '#FEF2F2',
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 8,
              marginLeft: 8
            }}>
              <Text style={{ fontSize: 10, color: '#EF4444', fontWeight: '600' }}>
                EMERGENCY
              </Text>
            </View>
          )}
        </View>
        <Text style={{
          fontSize: 14,
          color: '#6B7280',
          marginTop: 2
        }}>
          {displayRelationship}
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#374151',
          marginTop: 4
        }}>
          {displayPhone}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => handleCall(displayPhone, displayName)}
          style={{
            backgroundColor: '#10B981',
            padding: 12,
            borderRadius: 12,
            marginRight: 8
          }}
        >
          <Ionicons name="call" size={20} color="white" />
        </TouchableOpacity>
        
        {!item.is_emergency && (
          <TouchableOpacity
            onPress={() => deleteContact(item.id)}
            style={{
              backgroundColor: '#EF4444',
              padding: 12,
              borderRadius: 12
            }}
          >
            <Ionicons name="trash" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
    );
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <LinearGradient
        colors={['#7C3AED', '#A855F7']}
        style={{
          paddingTop: 60,
          paddingHorizontal: 20,
          paddingBottom: 30,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white'
          }}>
            Contacts
          </Text>
          
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginTop: 20,
        }}>
          <Ionicons name="search" size={20} color="white" />
          <TextInput
            placeholder="Search contacts..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              marginLeft: 12,
              color: 'white',
              fontSize: 16,
            }}
          />
        </View>
      </LinearGradient>

      {/* Contacts List */}
      <FlatList
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={(item) => item?.id || Math.random().toString()}
        style={{ flex: 1, marginTop: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Ionicons name="people-outline" size={64} color="#9CA3AF" />
            <Text style={{ fontSize: 18, color: '#6B7280', marginTop: 16 }}>
              No contacts found
            </Text>
          </View>
        }
      />

      {/* Add Contact Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end'
        }}>
          <View style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 24,
            maxHeight: height * 0.8
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937' }}>
                Add New Contact
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Name *
                </Text>
                <TextInput
                  value={newContact.name}
                  onChangeText={(text) => setNewContact(prev => ({ ...prev, name: text }))}
                  placeholder="Enter contact name"
                  style={{
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: 12,
                    padding: 12,
                    fontSize: 16
                  }}
                />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Phone Number *
                </Text>
                <TextInput
                  value={newContact.phone}
                  onChangeText={(text) => setNewContact(prev => ({ ...prev, phone: text }))}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: 12,
                    padding: 12,
                    fontSize: 16
                  }}
                />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Relationship
                </Text>
                <TextInput
                  value={newContact.relationship}
                  onChangeText={(text) => setNewContact(prev => ({ ...prev, relationship: text }))}
                  placeholder="e.g., Friend, Family, Colleague"
                  style={{
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: 12,
                    padding: 12,
                    fontSize: 16
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={() => setNewContact(prev => ({ ...prev, is_emergency: !prev.is_emergency }))}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 24
                }}
              >
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: newContact.is_emergency ? '#EF4444' : '#D1D5DB',
                  backgroundColor: newContact.is_emergency ? '#EF4444' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  {newContact.is_emergency && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text style={{ fontSize: 16, color: '#374151' }}>
                  Emergency Contact
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={addContact}
                style={{
                  backgroundColor: '#7C3AED',
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginBottom: 8
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  Add Contact
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
