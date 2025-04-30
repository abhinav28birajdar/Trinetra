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
import { Phone, Ambulance, MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SafetyTipCard } from '@/components/SafetyTipCard';
import { EmergencyServiceButton } from '@/components/EmergencyServiceButton';
import { useUserStore } from '@/store/user-store';
import { useContactsStore } from '@/store/contacts-store';
import { useSafetyTipsStore } from '@/store/safety-tips-store';
import * as Location from 'expo-location';
import { Contact } from '@/types';

export default function HomeScreen() {
  const { user } = useUserStore();
  const { contacts } = useContactsStore();
  const { getRandomTip, getNextTip } = useSafetyTipsStore();
  const [currentTip, setCurrentTip] = React.useState(() => getRandomTip());

  const safeContacts = contacts || [];
  const favoriteContacts = safeContacts.filter((contact: Contact) => contact.isFavorite);

  const handleNextTip = () => {
    setCurrentTip(getNextTip());
  };

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

  const handleShareLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is needed to share your location.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const message = `Here is my current location: ${mapsUrl}`;

      if (Platform.OS === 'web') {
        alert(message);
        return;
      }

      const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
      const canOpenSms = await Linking.canOpenURL(smsUrl);
      if (canOpenSms) {
        await Linking.openURL(smsUrl);
      } else {
        Alert.alert('Cannot Share', 'Unable to open messaging app.');
      }
    } catch (error) {
      console.error('Error sharing location:', error);
      Alert.alert('Error', 'Failed to get or share location.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'} 👋</Text>
        <Text style={styles.subGreeting}>Stay safe and connected.</Text>
      </View>

      <View style={styles.emergencyServices}>
        <EmergencyServiceButton
          title="Police"
          phoneNumber="100"
          color={Colors.info}
          icon={<Phone size={20} color={Colors.white} />}
        />
        <EmergencyServiceButton
          title="Ambulance"
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
          <Text style={styles.shareLocationText}>Share Location</Text>
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
                activeOpacity={0.7}
              >
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactInitial}>{contact.name ? contact.name.charAt(0).toUpperCase() : '?'}</Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName} numberOfLines={1}>{contact.name}</Text>
                  <Text style={styles.contactRelation} numberOfLines={1}>{contact.relationship}</Text>
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
              Add contacts and mark them as favorites for quick calling access here.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Tip</Text>
        <SafetyTipCard tip={currentTip} onNext={handleNextTip} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emergencyServices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 10,
    alignItems: 'stretch',
  },
  shareLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    flex: 1,
    minHeight: 50,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    gap: 8,
  },
  shareLocationText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    marginRight: 8,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 13,
    color: Colors.subtext,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  emptyStateText: {
    color: Colors.subtext,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});