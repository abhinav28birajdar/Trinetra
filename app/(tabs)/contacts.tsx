import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Linking,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../store/auth';

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
  const { user, profile } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Sample contacts data
  const sampleContacts: Contact[] = [
    { id: '1', name: 'Father', phone: '+1234567890', relationship: 'Father', color: '#EF4444', is_emergency: true },
    { id: '2', name: 'Mother', phone: '+1234567891', relationship: 'Mother', color: '#10B981', is_emergency: true },
    { id: '3', name: 'Sister', phone: '+1234567892', relationship: 'Sister', color: '#3B82F6', is_emergency: false },
    { id: '4', name: 'Uncle', phone: '+1234567893', relationship: 'Uncle', color: '#F59E0B', is_emergency: false },
  ];

  useEffect(() => {
    setContacts(sampleContacts);
  }, []);

  const handleCall = (phone: string, name: string) => {
    Alert.alert(
      'Call Contact',
      `Do you want to call ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${phone}`) }
      ]
    );
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      backgroundColor: 'white', 
      marginHorizontal: 24, 
      marginVertical: 6, 
      padding: 16, 
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    }}>
      {/* Contact Avatar */}
      <View style={{ 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        backgroundColor: item.color, 
        alignItems: 'center', 
        justifyContent: 'center',
        marginRight: 16
      }}>
        <Ionicons name="person" size={24} color="white" />
      </View>

      {/* Contact Info */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 2 }}>
          {item.relationship}
        </Text>
        <Text style={{ fontSize: 14, color: '#9CA3AF' }}>
          {item.phone}
        </Text>
      </View>

      {/* Emergency Badge */}
      {item.is_emergency && (
        <View style={{ 
          backgroundColor: '#FEE2E2', 
          paddingHorizontal: 8, 
          paddingVertical: 4, 
          borderRadius: 12,
          marginRight: 12
        }}>
          <Text style={{ fontSize: 12, color: '#DC2626', fontWeight: '600' }}>
            Emergency
          </Text>
        </View>
      )}

      {/* Call Button */}
      <TouchableOpacity
        onPress={() => handleCall(item.phone, item.name)}
        style={{ 
          width: 40, 
          height: 40, 
          borderRadius: 20, 
          backgroundColor: '#8B5CF6', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <Ionicons name="call" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#8B5CF6', '#A855F7']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
      >
        {/* Header */}
        <View style={{ paddingTop: 50, paddingHorizontal: 24, paddingBottom: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>
              Contact List
            </Text>
            <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, paddingHorizontal: 16, paddingVertical: 12 }}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search"
              style={{ flex: 1, fontSize: 16, color: '#1F2937' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Main Content */}
        <View style={{ 
          flex: 1, 
          backgroundColor: '#F8FAFC', 
          borderTopLeftRadius: 30, 
          borderTopRightRadius: 30,
          paddingTop: 20
        }}>
          {/* Quick Actions */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 24, marginBottom: 20 }}>
            <TouchableOpacity style={{ alignItems: 'center' }}>
              <View style={{ 
                width: 60, 
                height: 60, 
                borderRadius: 30, 
                backgroundColor: '#8B5CF6', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: 8
              }}>
                <Ionicons name="person-add" size={24} color="white" />
              </View>
              <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '600' }}>Add Contact</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ alignItems: 'center' }}>
              <View style={{ 
                width: 60, 
                height: 60, 
                borderRadius: 30, 
                backgroundColor: '#EF4444', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: 8
              }}>
                <Ionicons name="warning" size={24} color="white" />
              </View>
              <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '600' }}>Emergency</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ alignItems: 'center' }}>
              <View style={{ 
                width: 60, 
                height: 60, 
                borderRadius: 30, 
                backgroundColor: '#10B981', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: 8
              }}>
                <Ionicons name="call" size={24} color="white" />
              </View>
              <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '600' }}>Recent Calls</Text>
            </TouchableOpacity>
          </View>

          {/* Contacts List */}
          <FlatList
            data={filteredContacts}
            renderItem={renderContact}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  setTimeout(() => setRefreshing(false), 1000);
                }}
                tintColor="#8B5CF6"
              />
            }
          />
        </View>

        {/* Floating SOS Button */}
        <TouchableOpacity
          style={{ 
            position: 'absolute', 
            bottom: 30, 
            right: 24, 
            width: 60, 
            height: 60, 
            borderRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8
          }}
        >
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            style={{ 
              width: 60, 
              height: 60, 
              borderRadius: 30, 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>SOS</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Bottom Navigation */}
        <View style={{ 
          backgroundColor: 'white', 
          paddingVertical: 15, 
          paddingHorizontal: 24,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity style={{ alignItems: 'center' }}>
              <Ionicons name="home-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center' }}>
              <Ionicons name="people" size={24} color="#8B5CF6" />
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center' }}>
              <Ionicons name="call-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center' }}>
              <Ionicons name="person-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
