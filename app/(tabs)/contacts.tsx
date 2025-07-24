import Ionicons from '@expo/vector-icons/Ionicons';
import * as Contacts from 'expo-contacts';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Linking,
    PermissionsAndroid,
    Platform,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { Database } from '../../types/supabase';

type Contact = Database['public']['Tables']['contacts']['Row'];

export default function ContactsScreen() {
  const { user } = useAuthStore();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch contacts from Supabase
  const fetchContacts = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true });

    if (error) {
      Alert.alert('Error', 'Failed to fetch contacts');
      console.error('Fetch contacts error:', error);
    } else {
      setContacts(data || []);
    }
    setLoading(false);
  };

  // Request permissions and sync device contacts
  const syncDeviceContacts = async () => {
    try {
      // Request contacts permission
      const { status } = await Contacts.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need access to your contacts to sync them.');
        return;
      }

      setLoading(true);
      
      // Fetch device contacts
      const { data: deviceContacts } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
      });

      if (!user) return;

      // Prepare contacts for insertion
      const contactsToInsert = deviceContacts
        .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0)
        .map(contact => ({
          user_id: user.id,
          name: contact.name || 'Unknown',
          phone: contact.phoneNumbers?.[0]?.number || '',
          email: contact.emails?.[0]?.email || null,
          is_favorite: false,
        }));

      // Insert contacts into Supabase
      const { error } = await supabase
        .from('contacts')
        .upsert(contactsToInsert, { 
          onConflict: 'user_id,phone',
          ignoreDuplicates: true 
        });

      if (error) {
        Alert.alert('Error', 'Failed to sync contacts');
        console.error('Sync contacts error:', error);
      } else {
        Alert.alert('Success', `Synced ${contactsToInsert.length} contacts`);
        fetchContacts(); // Refresh the list
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sync contacts');
      console.error('Sync contacts error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Make a phone call
  const makeCall = async (phoneNumber: string, contactName: string) => {
    try {
      // Request phone call permission on Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          {
            title: 'Phone Call Permission',
            message: 'This app needs access to make phone calls',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Cannot make calls without permission');
          return;
        }
      }

      // Log the call attempt
      if (user) {
        await logCall({
          user_id: user.id,
          phone_number: phoneNumber,
          contact_name: contactName,
          call_type: 'outgoing',
          timestamp: new Date().toISOString(),
          duration: 0, // Will be updated when call ends
        });
      }

      // Make the call
      const phoneUrl = `tel:${phoneNumber}`;
      const supported = await Linking.canOpenURL(phoneUrl);
      
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'Phone calls are not supported on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to make call');
      console.error('Make call error:', error);
    }
  };

  // Log call to database
  const logCall = async (callData: Database['public']['Tables']['call_logs']['Insert']) => {
    const { error } = await supabase
      .from('call_logs')
      .insert(callData);

    if (error) {
      console.error('Failed to log call:', error);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (contactId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('contacts')
      .update({ is_favorite: !currentStatus })
      .eq('id', contactId);

    if (error) {
      Alert.alert('Error', 'Failed to update favorite status');
    } else {
      fetchContacts(); // Refresh the list
    }
  };

  // Delete contact
  const deleteContact = async (contactId: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('contacts')
              .delete()
              .eq('id', contactId);

            if (error) {
              Alert.alert('Error', 'Failed to delete contact');
            } else {
              fetchContacts(); // Refresh the list
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  const renderContact = ({ item }: { item: Contact }) => (
    <View className="bg-white mx-4 mb-3 p-4 rounded-lg shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-lg font-semibold text-gray-800">
              {item.name}
            </Text>
            {item.is_favorite && (
              <Ionicons name="star" size={16} color="#FFD700" style={{ marginLeft: 8 }} />
            )}
          </View>
          <Text className="text-gray-600 mt-1">{item.phone}</Text>
          {item.email && (
            <Text className="text-gray-500 text-sm mt-1">{item.email}</Text>
          )}
        </View>

        <View className="flex-row">
          <TouchableOpacity
            className="bg-green-500 p-3 rounded-full mr-2"
            onPress={() => makeCall(item.phone, item.name)}
          >
            <Ionicons name="call" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-500 p-3 rounded-full mr-2"
            onPress={() => toggleFavorite(item.id, item.is_favorite)}
          >
            <Ionicons 
              name={item.is_favorite ? "star" : "star-outline"} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 p-3 rounded-full"
            onPress={() => deleteContact(item.id)}
          >
            <Ionicons name="trash" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary pt-12 pb-6 px-4">
        <Text className="text-white text-2xl font-bold">Contacts</Text>
        <Text className="text-purple-200 mt-1">
          {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Sync Button */}
      <View className="px-4 py-3">
        <TouchableOpacity
          className="bg-primary py-3 px-4 rounded-lg flex-row items-center justify-center"
          onPress={syncDeviceContacts}
          disabled={loading}
        >
          <Ionicons name="sync" size={20} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white font-semibold">Sync Device Contacts</Text>
        </TouchableOpacity>
      </View>

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons name="people-outline" size={80} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg font-semibold mt-4 text-center">
            No Contacts Yet
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            Tap "Sync Device Contacts" to import your contacts
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContact}
          keyExtractor={(item: Contact) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
