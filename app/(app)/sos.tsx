import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  Easing,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useEmergencyStore } from '@/store/emergencyStore';
import { useLocationStore } from '@/store/locationStore';
import Colors from '@/constants/colors';

export default function SOSScreen() {
  const router = useRouter();
  const { activateSOS, deactivateSOS, isSOSActive } = useEmergencyStore();
  const { currentLocation, startTracking } = useLocationStore();
  
  const [isPressed, setIsPressed] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Start location tracking if not already active
    if (!currentLocation) {
      startTracking();
    }
    
    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    return () => {
      pulseAnim.stopAnimation();
    };
  }, []);
  
  const handleSOSPress = () => {
    setIsPressed(true);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    // Activate SOS mode
    activateSOS();
    
    // Navigate to emergency call screen
    setTimeout(() => {
      router.push({
        pathname: '/call',
        params: { number: '100', type: 'emergency' }
      });
    }, 500);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SOS</Text>
      </View>
      
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.pulseContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.sosButton,
              isPressed ? styles.sosButtonPressed : {},
            ]}
            onPress={handleSOSPress}
            activeOpacity={0.7}
          >
            <Text style={styles.sosButtonText}>TAP</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  sosButtonPressed: {
    backgroundColor: Colors.sosRed,
  },
  sosButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
  },
});