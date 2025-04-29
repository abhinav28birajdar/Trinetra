import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  Linking,
  Platform,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, UserPlus, Search, Star } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { ContactCard } from '@/components/ContactCard';
import { Button } from '@/components/Button';
import { useContactsStore } from '@/store/contacts-store';
import { EmergencyContact } from '@/types';

export default function ContactsScreen() {
  const router = useRouter();
  const { contacts, removeContact, setPrimaryContact, isLoading } = useContactsStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleAddContact = () => {
    router.push('/contacts/add');
  };
  
  const handleCall = async (phoneNumber: string) => {
    try {
      if (Platform.OS !== 'web') {
        await Linking.openURL(`tel:${phoneNumber}`);
      } else {
        console.log('Phone calls are not supported in web');
        Alert.alert('Phone Call', `In a real device, this would call ${phoneNumber}`);
      }
    } catch (error) {
      console.error('Failed to make call', error);
    }
  };
  
  const handleDelete = (id: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to remove this contact?')) {
        removeContact(id);
        setRefreshKey(prev => prev + 1);
      }
    } else {
      Alert.alert(
        'Remove Contact',
        'Are you sure you want to remove this contact?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Remove', 
            style: 'destructive',
            onPress: () => {
              removeContact(id);
              setRefreshKey(prev => prev + 1);
            }
          }
        ]
      );
    }
  };
  
  const handleSetPrimary = (id: string) => {
    setPrimaryContact(id);
    setRefreshKey(prev => prev + 1);
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate primary contacts
  const primaryContacts = filteredContacts.filter(contact => contact.isPrimary);
  const otherContacts = filteredContacts.filter(contact => !contact.isPrimary);
  
  // Combine with primary contacts first
  const sortedContacts = [...primaryContacts, ...otherContacts];
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <UserPlus size={60} color={colors.primary} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No Emergency Contacts</Text>
      <Text style={styles.emptyText}>
        Add trusted contacts who will be notified in case of an emergency.
      </Text>
      <Button
        title="Add Emergency Contact"
        onPress={handleAddContact}
        style={styles.addButton}
      />
    </View>
  );
  
  const renderContact = ({ item }: { item: EmergencyContact }) => (
    <ContactCard
      contact={item}
      onCall={handleCall}
      onDelete={handleDelete}
      onSetPrimary={handleSetPrimary}
    />
  );

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Emergency Contacts</Text>
        <Text style={styles.subtitle}>
          These people will be contacted in emergencies.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textLight}
        />
      </View>

      {primaryContacts.length > 0 && (
        <View style={styles.favoriteContactsContainer}>
          <View style={styles.favoriteHeader}>
            <Star size={16} color={colors.primary} />
            <Text style={styles.favoriteHeaderText}>Favorite Contacts</Text>
          </View>
          {primaryContacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onCall={handleCall}
              onDelete={handleDelete}
              onSetPrimary={handleSetPrimary}
            />
          ))}
        </View>
      )}
      
      <FlatList
        data={otherContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={contacts.length === 0 ? renderEmptyState : null}
        extraData={refreshKey}
        ListHeaderComponent={otherContacts.length > 0 && primaryContacts.length > 0 ? 
          () => renderSectionHeader("Other Contacts") : null
        }
      />
      
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={handleAddContact}
        >
          <Plus size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: colors.textDark,
  },
  favoriteContactsContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  favoriteHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  sectionHeader: {
    backgroundColor: colors.cardBackground,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    marginTop: 16,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});