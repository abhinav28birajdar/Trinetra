import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import React, { useCallback, useEffect, useState } from 'react';
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
  View
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
  email?: string; // Optional email field
}

export default function ContactsScreen() {
  const { user, profile } = useAuthStore();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
    is_emergency: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [includeLocation, setIncludeLocation] = useState(true);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

  // Fetch contacts from database
  const fetchContacts = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
        
      if (error) {
        console.error('Error fetching contacts:', error);
        Alert.alert('Error', 'Failed to load contacts');
      } else {
        const formattedContacts = data.map(contact => ({
          id: contact.id,
          name: contact.name,
          phone: contact.phone,
          relationship: contact.relationship,
          color: contact.avatar_color || '#' + Math.floor(Math.random()*16777215).toString(16),
          is_emergency: contact.is_primary || contact.is_emergency_service
        }));
        setContacts(formattedContacts);
      }
    } catch (err) {
      console.error('Unexpected error fetching contacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    
    // Request permission and get location
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    })();
  }, [user]);

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
              
              // Make the call directly within the app if possible
              // Note: This still uses the phone app, but attempts to return to the app after
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
  
  const handleMessage = async (contact: Contact) => {
    setCurrentContact(contact);
    setMessageText('');
    setShowMessageModal(true);
  };
  
  const sendMessage = async () => {
    if (!currentContact) return;
    
    try {
      let finalMessage = messageText || 'Emergency alert from Trinatra app';
      
      // Add location if requested
      if (includeLocation && userLocation) {
        const { latitude, longitude } = userLocation.coords;
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        finalMessage += `\n\nMy current location: ${googleMapsUrl}`;
      }
      
      // Check if SMS is available
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'SMS is not available on this device');
        return;
      }
      
      // Log the message in Supabase
      if (user) {
        try {
          await supabase.from('message_logs').insert({
            user_id: user.id,
            contact_id: currentContact.id,
            contact_name: currentContact.name,
            phone_number: currentContact.phone,
            message_content: finalMessage,
            sent_at: new Date().toISOString(),
            includes_location: includeLocation,
          }).select();
          
          // Create a notification for the recipient if they have a user account
          const { data: recipientData } = await supabase
            .from('emergency_contacts')
            .select('contact_user_id')
            .eq('id', currentContact.id)
            .single();
            
          if (recipientData?.contact_user_id) {
            await supabase.from('notifications').insert({
              user_id: recipientData.contact_user_id,
              title: 'New message from ' + (profile?.full_name || user.email?.split('@')[0] || 'a contact'),
              message: finalMessage.substring(0, 100) + (finalMessage.length > 100 ? '...' : ''),
              type: includeLocation ? 'location' : 'message',
              sender_name: profile?.full_name || user.email?.split('@')[0],
              related_data: includeLocation && userLocation ? {
                coordinates: {
                  latitude: userLocation.coords.latitude,
                  longitude: userLocation.coords.longitude
                }
              } : null
            });
          }
        } catch (error) {
          console.error('Error logging message:', error);
          // Continue anyway, as the message send is more important than logging
        }
      }
      
      // Send the SMS
      const { result } = await SMS.sendSMSAsync(
        [currentContact.phone],
        finalMessage
      );
      
      if (result === 'sent' || result === 'unknown') {
        Alert.alert('Success', 'Message sent successfully');
        setShowMessageModal(false);
      } else {
        Alert.alert('Error', 'Message could not be sent');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Could not send the message');
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to delete contacts');
      return;
    }
    
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete from Supabase
              const { error } = await supabase
                .from('emergency_contacts')
                .delete()
                .eq('id', contactId)
                .eq('user_id', user.id);
                
              if (error) {
                console.error('Error deleting contact:', error);
                Alert.alert('Error', 'Failed to delete contact from database');
                return;
              }
              
              // Update local state
              setContacts(prev => prev.filter(contact => contact.id !== contactId));
              Alert.alert('Success', 'Contact deleted successfully');
            } catch (err) {
              console.error('Unexpected error deleting contact:', err);
              Alert.alert('Error', 'An unexpected error occurred');
            }
          }
        }
      ]
    );
  };

  const addContact = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add contacts');
      return;
    }
    
    if (!newContact.name || !newContact.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const contactColor = '#' + Math.floor(Math.random()*16777215).toString(16);
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert({
          user_id: user.id,
          name: newContact.name,
          phone: newContact.phone,
          relationship: newContact.relationship || 'Friend',
          avatar_color: contactColor,
          is_primary: newContact.is_emergency,
          contact_type: 'personal'
        })
        .select();

      if (error) {
        console.error('Error adding contact:', error);
        Alert.alert('Error', 'Failed to add contact to database');
        return;
      }

      const newContactData: Contact = {
        id: data[0].id,
        name: newContact.name,
        phone: newContact.phone,
        relationship: newContact.relationship || 'Friend',
        color: contactColor,
        is_emergency: newContact.is_emergency
      };

      setContacts(prev => [...prev, newContactData]);
      setNewContact({ name: '', phone: '', relationship: '', is_emergency: false });
      setShowAddModal(false);
      
      Alert.alert('Success', 'Contact added successfully');
    } catch (err) {
      console.error('Unexpected error adding contact:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchContacts()
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
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
        marginBottom: 15,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        {/* Header with gradient */}
        <LinearGradient
          colors={[displayColor, '#7C3AED']}
          start={[0, 0]}
          end={[1, 0]}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'white'
              }}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            
            <View>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'white'
              }}>
                {displayName}
              </Text>
              <Text style={{
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                {displayRelationship}
              </Text>
            </View>
          </View>
          
          {item.is_emergency && (
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12
            }}>
              <Text style={{ fontSize: 12, color: 'white', fontWeight: '600' }}>
                EMERGENCY
              </Text>
            </View>
          )}
        </LinearGradient>
        
        {/* Contact Body */}
        <View style={{ padding: 16 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 14,
              color: '#6B7280',
              marginBottom: 4
            }}>
              Phone Number
            </Text>
            <Text style={{
              fontSize: 18,
              color: '#1F2937',
              fontWeight: '500'
            }}>
              {displayPhone}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            marginTop: 8
          }}>
            <TouchableOpacity
              onPress={() => handleCall(displayPhone, displayName)}
              style={{
                backgroundColor: '#F0FDF4',
                padding: 12,
                borderRadius: 12,
                flex: 1,
                marginRight: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="call" size={20} color="#10B981" style={{ marginRight: 8 }} />
              <Text style={{ color: '#10B981', fontWeight: '600' }}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleMessage(item)}
              style={{
                backgroundColor: '#EBF5FF',
                padding: 12,
                borderRadius: 12,
                flex: 1,
                marginRight: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="chatbubble" size={20} color="#3B82F6" style={{ marginRight: 8 }} />
              <Text style={{ color: '#3B82F6', fontWeight: '600' }}>Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => deleteContact(item.id)}
              style={{
                backgroundColor: '#FEF2F2',
                padding: 12,
                borderRadius: 12,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="trash" size={20} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={{ color: '#EF4444', fontWeight: '600' }}>Delete</Text>
            </TouchableOpacity>
          </View>
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

      {/* Message Modal */}
      <Modal
        visible={showMessageModal}
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
            maxHeight: height * 0.7
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937' }}>
                Send Message to {currentContact?.name}
              </Text>
              <TouchableOpacity onPress={() => setShowMessageModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Message
                </Text>
                <TextInput
                  value={messageText}
                  onChangeText={setMessageText}
                  placeholder="Enter your message (or leave blank for default emergency alert)"
                  multiline
                  numberOfLines={4}
                  style={{
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: 12,
                    padding: 12,
                    fontSize: 16,
                    textAlignVertical: 'top',
                    height: 120
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={() => setIncludeLocation(!includeLocation)}
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
                  borderColor: includeLocation ? '#3B82F6' : '#D1D5DB',
                  backgroundColor: includeLocation ? '#3B82F6' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  {includeLocation && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text style={{ fontSize: 16, color: '#374151' }}>
                  Include my current location
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={sendMessage}
                style={{
                  backgroundColor: '#3B82F6',
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginBottom: 8
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  Send Message
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
