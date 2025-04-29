import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { 
  Phone, 
  MapPin, 
  Bell, 
  Share2, 
  AlertTriangle,
  Ambulance,
  Shield
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { SafetyTipCard } from '@/components/SafetyTipCard';
import { useAuthStore } from '@/store/auth-store';
import { useContactsStore } from '@/store/contacts-store';
import { useSOSStore } from '@/store/sos-store';
import { safetyTips } from '@/constants/safety-tips';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { contacts } = useContactsStore();
  const { isActive, activateSOS, deactivateSOS, isLoading, updateLocation } = useSOSStore();
  const [dailyTip, setDailyTip] = useState(safetyTips[0]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // Get a random safety tip each day
  useEffect(() => {
    const today = new Date().toDateString();
    const randomIndex = Math.floor(
      parseInt(today.split(' ').join(''), 36) % safetyTips.length
    );
    setDailyTip(safetyTips[randomIndex]);
  }, []);
  
  // Get current location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permission to access location was denied');
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        
        // Update SOS store with location
        if (currentLocation) {
          updateLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude
          });
        }
        
        // Get address from coordinates
        try {
          let geocode = await Location.reverseGeocodeAsync({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude
          });
          
          if (geocode && geocode.length > 0) {
            const addressParts = [
              geocode[0].street,
              geocode[0].district,
              geocode[0].city,
              geocode[0].region
            ].filter(Boolean);
            
            setAddress(addressParts.join(', '));
            
            // Update SOS store with address
            updateLocation({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              address: addressParts.join(', ')
            });
          }
        } catch (error) {
          console.error('Error getting address:', error);
        }
      } catch (error) {
        console.error('Error getting location:', error);
        setLocationError('Failed to get your location');
      }
    })();
  }, []);
  
  const handleSOSPress = async () => {
    if (isActive) {
      // Confirm before deactivating
      if (Platform.OS === 'web') {
        if (window.confirm('Are you sure you want to cancel the SOS alert?')) {
          await deactivateSOS();
        }
      } else {
        Alert.alert(
          'Cancel SOS',
          'Are you sure you want to cancel the SOS alert?',
          [
            { text: 'No', style: 'cancel' },
            { text: 'Yes, I\'m Safe', onPress: async () => await deactivateSOS() }
          ]
        );
      }
    } else {
      // Activate SOS and navigate to SOS screen
      await activateSOS();
      router.push('/sos');
    }
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
  
  const handleShareLocation = async () => {
    if (!location) {
      Alert.alert('Location Unavailable', 'Unable to share your location. Please try again.');
      return;
    }
    
    const locationUrl = `https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;
    const message = `I'm currently at ${address || 'this location'}. You can find me here: ${locationUrl}`;
    
    try {
      if (Platform.OS === 'web') {
        // Web fallback
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(message);
          Alert.alert('Location Copied', 'Location link copied to clipboard. You can paste it in any messaging app.');
        } else {
          Alert.alert('Share Location', 'On a real device, this would share your current location.');
        }
      } else {
        await Linking.openURL(`sms:?body=${encodeURIComponent(message)}`);
      }
    } catch (error) {
      console.error('Error sharing location:', error);
      Alert.alert('Error', 'Failed to share location. Please try again.');
    }
  };
  
  // Get primary contacts for quick calls
  const favoriteContacts = contacts.filter(contact => contact.isPrimary).slice(0, 2);
  
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.fullName?.split(' ')[0] || 'User'} 👋</Text>
          <Text style={styles.subGreeting}>Your safety is our priority.</Text>
        </View>
        
        <View style={styles.locationContainer}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.locationTitle}>Your Current Location</Text>
          </View>
          {locationError ? (
            <Text style={styles.locationError}>{locationError}</Text>
          ) : !location ? (
            <Text style={styles.locationText}>Getting your location...</Text>
          ) : (
            <>
              <Text style={styles.locationText}>
                {address || 'Determining your address...'}
              </Text>
              <TouchableOpacity 
                style={styles.shareLocationButton}
                onPress={handleShareLocation}
              >
                <Share2 size={16} color={colors.white} />
                <Text style={styles.shareLocationText}>Share My Location</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        
        <View style={styles.emergencyContainer}>
          <Text style={styles.sectionTitle}>Emergency Services</Text>
          <View style={styles.emergencyButtons}>
            <TouchableOpacity 
              style={[styles.emergencyButton, { backgroundColor: colors.danger }]}
              onPress={() => handleCall('100')}
            >
              <AlertTriangle size={24} color={colors.white} />
              <Text style={styles.emergencyButtonText}>Police</Text>
              <Text style={styles.emergencyButtonNumber}>100</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.emergencyButton, { backgroundColor: colors.info }]}
              onPress={() => handleCall('102')}
            >
              <Ambulance size={24} color={colors.white} />
              <Text style={styles.emergencyButtonText}>Ambulance</Text>
              <Text style={styles.emergencyButtonNumber}>102</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.emergencyButton, { backgroundColor: colors.secondary }]}
              onPress={() => handleCall('1091')}
            >
              <Shield size={24} color={colors.white} />
              <Text style={styles.emergencyButtonText}>Women</Text>
              <Text style={styles.emergencyButtonNumber}>1091</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Contacts</Text>
          <View style={styles.quickContactsContainer}>
            {favoriteContacts.length > 0 ? (
              favoriteContacts.map((contact) => (
                <TouchableOpacity 
                  key={contact.id}
                  style={styles.quickContactCard}
                  onPress={() => handleCall(contact.phoneNumber)}
                >
                  <View style={styles.contactInitial}>
                    <Text style={styles.initialText}>
                      {contact.fullName.charAt(0)}
                    </Text>
                  </View>
                  <Text style={styles.contactName} numberOfLines={1}>
                    {contact.fullName}
                  </Text>
                  <Text style={styles.contactRelation} numberOfLines={1}>
                    {contact.relationship}
                  </Text>
                  <View style={styles.callButton}>
                    <Phone size={16} color={colors.white} />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity 
                style={styles.addContactsButton}
                onPress={() => router.push('/contacts')}
              >
                <Text style={styles.addContactsText}>Add Emergency Contacts</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.viewAllContactsButton}
              onPress={() => router.push('/contacts')}
            >
              <Text style={styles.viewAllContactsText}>View All</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Safety Tip of the Day</Text>
            <TouchableOpacity onPress={() => router.push('/safety-tips')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <SafetyTipCard tip={dailyTip} />
        </View>
        
        <View style={styles.safetyNewsContainer}>
          <Text style={styles.sectionTitle}>Latest Safety Updates</Text>
          <TouchableOpacity style={styles.newsCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80' }}
              style={styles.newsImage}
            />
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>New Women Safety Law Passed</Text>
              <Text style={styles.newsDate}>June 15, 2023</Text>
              <Text style={styles.newsDescription} numberOfLines={2}>
                The government has passed a new law strengthening penalties for crimes against women and improving safety measures.
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.newsCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80' }}
              style={styles.newsImage}
            />
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>Safety Workshop This Weekend</Text>
              <Text style={styles.newsDate}>June 10, 2023</Text>
              <Text style={styles.newsDescription} numberOfLines={2}>
                Join our free self-defense workshop this weekend at Central Park. Learn essential techniques from experts.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Extra padding for SOS button
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  subGreeting: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 4,
  },
  locationContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginLeft: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 12,
  },
  locationError: {
    fontSize: 14,
    color: colors.danger,
  },
  shareLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  shareLocationText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 6,
  },
  emergencyContainer: {
    marginBottom: 24,
  },
  emergencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emergencyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  emergencyButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
    marginTop: 8,
  },
  emergencyButtonNumber: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  quickContactsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickContactCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactInitial: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  initialText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  contactRelation: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 8,
  },
  callButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addContactsButton: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  addContactsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  viewAllContactsButton: {
    width: '100%',
    alignItems: 'center',
    padding: 8,
  },
  viewAllContactsText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
  },
  safetyNewsContainer: {
    marginBottom: 24,
  },
  newsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newsImage: {
    width: '100%',
    height: 120,
  },
  newsContent: {
    padding: 12,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  newsDate: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 6,
  },
  newsDescription: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
  },
});