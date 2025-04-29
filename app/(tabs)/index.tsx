import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Platform
} from 'react-native';
import { Phone, Ambulance, MapPin, Share2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SafetyTipCard } from '@/components/SafetyTipCard';
import { EmergencyServiceButton } from '@/components/EmergencyServiceButton';
import { useUserStore } from '@/store/user-store';
import { useContactsStore } from '@/store/contacts-store';
import { useSafetyTipsStore } from '@/store/safety-tips-store';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const { user } = useUserStore();
  const { contacts } = useContactsStore();
  const { tips, getNextTip } = useSafetyTipsStore();
  const currentTip = tips[0]; // Just use the first tip for simplicity
  
  const favoriteContacts = contacts.filter(contact => contact.isFavorite);
  
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
  
  const handleShareLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Create a Google Maps link
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      
      if (Platform.OS === 'web') {
        alert(`In a real app, this would share your location: ${mapsUrl}`);
      } else {
        await Linking.openURL(`sms:?body=Here is my current location: ${mapsUrl}`);
      }
    } catch (error) {
      console.error('Error sharing location:', error);
      alert('Failed to share location');
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'} 👋</Text>
        <Text style={styles.subGreeting}>Your safety is our priority.</Text>
      </View>
      
      <View style={styles.emergencyServices}>
        <EmergencyServiceButton
          title="Call Police"
          phoneNumber="100"
          color={Colors.info}
          icon={<Phone size={20} color={Colors.white} />}
        />
        
        <EmergencyServiceButton
          title="Call Ambulance"
          phoneNumber="102"
          color={Colors.success}
          icon={<Ambulance size={20} color={Colors.white} />}
        />
        
        <TouchableOpacity 
          style={styles.shareLocationButton}
          onPress={handleShareLocation}
          activeOpacity={0.8}
        >
          <MapPin size={20} color={Colors.white} />
          <Text style={styles.shareLocationText}>Share My Location</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Calls</Text>
        
        {favoriteContacts.length > 0 ? (
          <View style={styles.contactsList}>
            {favoriteContacts.map(contact => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactItem}
                onPress={() => handleCallContact(contact.phoneNumber)}
              >
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactInitial}>{contact.name.charAt(0)}</Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRelation}>{contact.relationship}</Text>
                </View>
                <View style={styles.callButton}>
                  <Phone size={18} color={Colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No favorite contacts yet. Add contacts and mark them as favorites.
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <SafetyTipCard tip={currentTip} onNext={getNextTip} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[100],
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: Colors.subtext,
  },
  emergencyServices: {
    marginBottom: 24,
  },
  shareLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  shareLocationText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInitial: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  contactRelation: {
    fontSize: 14,
    color: Colors.subtext,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
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
});