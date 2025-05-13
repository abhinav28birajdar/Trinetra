import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import EmergencyButton from '@/components/EmergencyButton';

export default function LocationShareScreen() {
  const router = useRouter();
  
  const handleEmergencyCall = (type: string) => {
    router.push({
      pathname: '/call',
      params: { 
        number: type === 'Police' ? '100' : 'family', 
        name: type 
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Location Share" showBackButton />
      </View>
      
      <View style={styles.content}>
        <EmergencyButton 
          title="Police" 
          onPress={() => handleEmergencyCall('Police')} 
        />
        
        <EmergencyButton 
          title="Father" 
          onPress={() => handleEmergencyCall('Father')} 
        />
        
        <EmergencyButton 
          title="Mother" 
          onPress={() => handleEmergencyCall('Mother')} 
        />
        
        <EmergencyButton 
          title="Women Safety" 
          onPress={() => handleEmergencyCall('Women Safety')} 
        />
      </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
});