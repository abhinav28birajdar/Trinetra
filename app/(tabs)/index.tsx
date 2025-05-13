import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useContactsStore } from '@/store/contactsStore';
import Colors from '@/constants/colors';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import { Phone, Users } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { contacts, fetchContacts } = useContactsStore();
  
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    fetchContacts();
  }, []);
  
  const handleEmergencyCall = (number: string, name: string) => {
    router.push({
      pathname: '/call',
      params: { number, name },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header showAvatar username={user?.username} showSettingsButton />
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="search.."
        />
        
        <View style={styles.quickAccessContainer}>
          <TouchableOpacity 
            style={styles.quickAccessItem}
            onPress={() => router.push('/contacts')}
          >
            <Phone size={32} color={Colors.text.light} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAccessItem}
            onPress={() => router.push('/community')}
          >
            <Users size={32} color={Colors.text.light} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.emergencyContainer}>
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={() => handleEmergencyCall('100', 'Police')}
          >
            <Text style={styles.emergencyNumber}>100</Text>
            <Text style={styles.emergencyLabel}>Police</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={() => handleEmergencyCall('181', 'Ambulance')}
          >
            <Text style={styles.emergencyNumber}>181</Text>
            <Text style={styles.emergencyLabel}>Ambulance</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={() => router.push('/location')}
          >
            <Text style={styles.emergencyIcon}>📍</Text>
            <Text style={styles.emergencyLabel}>Location</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.paginationContainer}>
            <View style={[styles.paginationDot, styles.activeDot]} />
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 40,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  quickAccessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAccessItem: {
    width: '48%',
    height: 100,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  emergencyButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyNumber: {
    color: Colors.text.light,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emergencyIcon: {
    fontSize: 24,
  },
  emergencyLabel: {
    color: Colors.text.light,
    fontSize: 12,
    marginTop: 4,
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
});