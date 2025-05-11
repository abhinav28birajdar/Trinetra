import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Phone, Users, MapPin } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useEmergencyStore } from '@/store/emergencyStore';
import EmergencyServiceItem from '@/components/EmergencyServiceItem';
import Colors from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { emergencyServices } = useEmergencyStore();
  
  const handleEmergencyCall = (number: string) => {
    router.push({
      pathname: '/call',
      params: { number, type: 'emergency' }
    });
  };
  
  const navigateToLocation = () => {
    router.push('/location');
  };
  
  const navigateToCommunity = () => {
    router.push('/community');
  };
  
  const navigateToContacts = () => {
    router.push('/profile');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>User..</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/profile')}
        >
          <View style={styles.settingsIcon}>
            <Text>⚙️</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>search..</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={navigateToContacts}
          >
            <Phone size={24} color={Colors.white} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={navigateToCommunity}
          >
            <Users size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.emergencyServices}>
          {emergencyServices.map((service) => (
            <EmergencyServiceItem
              key={service.id}
              service={service}
              onPress={() => handleEmergencyCall(service.number)}
            />
          ))}
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={navigateToLocation}
          >
            <MapPin size={24} color={Colors.white} />
            <Text style={styles.locationText}>Location</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.carousel}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80' }}
            style={styles.carouselImage}
          />
          <View style={styles.indicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    color: Colors.textLight,
    fontSize: 16,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyServices: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  locationButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  locationText: {
    color: Colors.white,
    fontSize: 12,
    marginTop: 4,
  },
  carousel: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  carouselImage: {
    width: '100%',
    height: 200,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: Colors.primary,
  },
});