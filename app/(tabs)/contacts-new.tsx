import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Linking,
    Modal,
    RefreshControl,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../store/auth';

const { width, height } = Dimensions.get('window');

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  priority: number;
  is_primary: boolean;
  is_emergency_service: boolean;
  contact_type: string;
  notes?: string;
  avatar_color: string;
  last_contacted?: string;
  is_verified: boolean;
  created_at: string;
}

export default function ContactsScreen() {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: '',
    notes: '',
    is_primary: false,
    priority: 1,
    avatar_color: theme.colors.primary,
  });

  const relationshipOptions = [
    'Father', 'Mother', 'Sister', 'Brother', 'Husband', 'Wife',
    'Friend', 'Colleague', 'Doctor', 'Neighbor', 'Other'
  ];

  const avatarColors = [
    '#5A189A', '#DC2626', '#059669', '#D97706', '#7C2D12',
    '#1E40AF', '#BE185D', '#0891B2', '#65A30D', '#C2410C'
  ];

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('priority', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddContact = async () => {
    if (!user || !formData.name.trim() || !formData.phone.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const contactData = {
        user_id: user.id,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        relationship: formData.relationship || 'Other',
        notes: formData.notes.trim() || null,
        is_primary: formData.is_primary,
        priority: formData.priority,
        avatar_color: formData.avatar_color,
        is_emergency_service: false,
        contact_type: 'personal',
        is_verified: false,
      };

      const { error } = await supabase
        .from('emergency_contacts')
        .insert([contactData]);

      if (error) throw error;

      Alert.alert('Success', 'Contact added successfully');
      setShowAddModal(false);
      resetForm();
      fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
      Alert.alert('Error', 'Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  const handleEditContact = async () => {
    if (!editingContact || !formData.name.trim() || !formData.phone.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .update({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          relationship: formData.relationship || 'Other',
          notes: formData.notes.trim() || null,
          is_primary: formData.is_primary,
          priority: formData.priority,
          avatar_color: formData.avatar_color,
        })
        .eq('id', editingContact.id);

      if (error) throw error;

      Alert.alert('Success', 'Contact updated successfully');
      setEditingContact(null);
      resetForm();
      fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
      Alert.alert('Error', 'Failed to update contact');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = (contact: Contact) => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${contact.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('emergency_contacts')
                .delete()
                .eq('id', contact.id);

              if (error) throw error;
              fetchContacts();
            } catch (error) {
              console.error('Error deleting contact:', error);
              Alert.alert('Error', 'Failed to delete contact');
            }
          },
        },
      ]
    );
  };

  const handleCall = async (contact: Contact) => {
    Alert.alert(
      'Call Contact',
      `Do you want to call ${contact.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: async () => {
            try {
              await Linking.openURL(`tel:${contact.phone}`);
              
              // Log the call
              await supabase
                .from('call_logs')
                .insert([{
                  user_id: user?.id,
                  contact_id: contact.id,
                  phone_number: contact.phone,
                  contact_name: contact.name,
                  call_type: 'outgoing',
                  is_emergency: contact.is_emergency_service,
                }]);

              // Update last contacted
              await supabase
                .from('emergency_contacts')
                .update({ last_contacted: new Date().toISOString() })
                .eq('id', contact.id);
                
            } catch (error) {
              console.error('Error making call:', error);
              Alert.alert('Error', 'Unable to make call');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      relationship: '',
      notes: '',
      is_primary: false,
      priority: 1,
      avatar_color: theme.colors.primary,
    });
  };

  const openEditModal = (contact: Contact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      relationship: contact.relationship,
      notes: contact.notes || '',
      is_primary: contact.is_primary,
      priority: contact.priority,
      avatar_color: contact.avatar_color,
    });
    setEditingContact(contact);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery) ||
    contact.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ContactCard = ({ contact }: { contact: Contact }) => (
    <TouchableOpacity
      style={[
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.md,
          marginVertical: theme.spacing.sm,
          marginHorizontal: theme.spacing.md,
          shadowColor: theme.colors.shadowColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.colors.shadowOpacity,
          shadowRadius: 4,
          elevation: 3,
        }
      ]}
      onPress={() => handleCall(contact)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Avatar */}
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: contact.avatar_color,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme.spacing.md,
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            {contact.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Contact Info */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: theme.colors.text,
                flex: 1,
              }}
            >
              {contact.name}
            </Text>
            {contact.is_primary && (
              <View
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                  marginLeft: 8,
                }}
              >
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                  PRIMARY
                </Text>
              </View>
            )}
            {contact.is_emergency_service && (
              <View
                style={{
                  backgroundColor: theme.colors.emergency,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                  marginLeft: 8,
                }}
              >
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                  EMERGENCY
                </Text>
              </View>
            )}
          </View>
          
          <Text style={{ color: theme.colors.textSecondary, fontSize: 16, marginTop: 2 }}>
            {contact.phone}
          </Text>
          
          <Text style={{ color: theme.colors.textMuted, fontSize: 14, marginTop: 2 }}>
            {contact.relationship}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {!contact.is_emergency_service && (
            <TouchableOpacity
              onPress={() => openEditModal(contact)}
              style={{
                padding: theme.spacing.sm,
                marginRight: theme.spacing.sm,
              }}
            >
              <Ionicons name="pencil" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={() => handleCall(contact)}
            style={{
              backgroundColor: theme.colors.primary,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.md,
              marginRight: theme.spacing.sm,
            }}
          >
            <Ionicons name="call" size={20} color="white" />
          </TouchableOpacity>
          
          {!contact.is_emergency_service && (
            <TouchableOpacity
              onPress={() => handleDeleteContact(contact)}
              style={{
                backgroundColor: theme.colors.error,
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.md,
              }}
            >
              <Ionicons name="trash" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const AddContactModal = () => (
    <Modal
      visible={showAddModal || !!editingContact}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryLight]}
          style={{
            paddingTop: 50,
            paddingBottom: 20,
            paddingHorizontal: theme.spacing.md,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={() => {
                setShowAddModal(false);
                setEditingContact(null);
                resetForm();
              }}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
              {editingContact ? 'Edit Contact' : 'Add Contact'}
            </Text>
            
            <TouchableOpacity
              onPress={editingContact ? handleEditContact : handleAddContact}
              disabled={loading}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={{ flex: 1, padding: theme.spacing.md }}>
          {/* Name Input */}
          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              Name *
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                fontSize: 16,
                color: theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              placeholder="Enter contact name"
              placeholderTextColor={theme.colors.placeholder}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          {/* Phone Input */}
          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              Phone Number *
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                fontSize: 16,
                color: theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              placeholder="Enter phone number"
              placeholderTextColor={theme.colors.placeholder}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              Email (Optional)
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                fontSize: 16,
                color: theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              placeholder="Enter email address"
              placeholderTextColor={theme.colors.placeholder}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
            />
          </View>

          {/* Relationship Picker */}
          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              Relationship
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {relationshipOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setFormData({ ...formData, relationship: option })}
                  style={{
                    backgroundColor: formData.relationship === option ? theme.colors.primary : theme.colors.card,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: theme.borderRadius.md,
                    margin: 4,
                    borderWidth: 1,
                    borderColor: formData.relationship === option ? theme.colors.primary : theme.colors.border,
                  }}
                >
                  <Text
                    style={{
                      color: formData.relationship === option ? 'white' : theme.colors.text,
                      fontSize: 14,
                      fontWeight: formData.relationship === option ? 'bold' : 'normal',
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Avatar Color Picker */}
          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              Avatar Color
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {avatarColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setFormData({ ...formData, avatar_color: color })}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: color,
                    margin: 6,
                    borderWidth: formData.avatar_color === color ? 3 : 0,
                    borderColor: theme.colors.text,
                  }}
                />
              ))}
            </View>
          </View>

          {/* Primary Contact Toggle */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.md,
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text }}>
              Primary Contact
            </Text>
            <Switch
              value={formData.is_primary}
              onValueChange={(value) => setFormData({ ...formData, is_primary: value })}
              trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
              thumbColor={formData.is_primary ? 'white' : theme.colors.placeholder}
            />
          </View>

          {/* Notes Input */}
          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>
              Notes (Optional)
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                fontSize: 16,
                color: theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
                height: 80,
                textAlignVertical: 'top',
              }}
              placeholder="Add any additional notes..."
              placeholderTextColor={theme.colors.placeholder}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              multiline
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryLight]}
        style={{
          paddingTop: 50,
          paddingBottom: 20,
          paddingHorizontal: theme.spacing.md,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
            Emergency Contacts
          </Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: 10,
              borderRadius: theme.borderRadius.md,
            }}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: theme.borderRadius.md,
            paddingHorizontal: theme.spacing.md,
            marginTop: theme.spacing.md,
          }}
        >
          <Ionicons name="search" size={20} color="white" />
          <TextInput
            style={{
              flex: 1,
              color: 'white',
              fontSize: 16,
              marginLeft: theme.spacing.sm,
              paddingVertical: theme.spacing.md,
            }}
            placeholder="Search contacts..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.md }}>
          <Text style={{ color: 'white', fontSize: 14 }}>
            {filteredContacts.length} Contact{filteredContacts.length !== 1 ? 's' : ''}
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, marginLeft: theme.spacing.md }}>
            {filteredContacts.filter(c => c.is_primary).length} Primary
          </Text>
        </View>
      </LinearGradient>

      {/* Contacts List */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContactCard contact={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchContacts();
            }}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 50 }}>
            <Ionicons name="people-outline" size={80} color={theme.colors.textMuted} />
            <Text style={{ fontSize: 18, color: theme.colors.textMuted, marginTop: theme.spacing.md }}>
              No contacts found
            </Text>
            <Text style={{ fontSize: 14, color: theme.colors.textMuted, textAlign: 'center', marginTop: 8 }}>
              Add emergency contacts to get started
            </Text>
          </View>
        }
      />

      {/* Add Contact Modal */}
      <AddContactModal />

      {/* SOS FAB */}
      <TouchableOpacity
        onPress={() => {
          // Navigate to SOS screen or trigger emergency
          Alert.alert('SOS', 'Emergency SOS activated!');
        }}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          backgroundColor: theme.colors.emergency,
          width: 60,
          height: 60,
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: theme.colors.emergency,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="warning" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
