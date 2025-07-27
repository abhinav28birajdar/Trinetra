import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, StatusBar, Text, View } from 'react-native';
import { useAuthStore } from '../store/auth';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { initializeAuth, session, isLoading } = useAuthStore();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [logoAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Initialize auth when the app starts
    initializeAuth();
  }, []);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Navigate based on auth state after loading is complete
      const timer = setTimeout(() => {
        if (session) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      }, 2500); // Show splash for 2.5 seconds

      return () => clearTimeout(timer);
    }
  }, [session, isLoading]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#5A189A" />
      <LinearGradient
        colors={['#5A189A', '#7C3AED', '#A855F7']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 40
        }}>
          {/* Logo Container */}
          <Animated.View style={{
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
            alignItems: 'center',
            marginBottom: 50
          }}>
            {/* Logo Background Circle */}
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 30,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10
            }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Ionicons name="shield-checkmark" size={40} color="#8B5CF6" />
              </View>
            </View>

            {/* App Name */}
            <Animated.View style={{
              opacity: logoAnim,
              transform: [{
                translateY: logoAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }}>
              <Text style={{
                fontSize: 36,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                marginBottom: 8,
                letterSpacing: 1
              }}>
                Trinatra
              </Text>
              <Text style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
                marginBottom: 8,
                fontWeight: '500'
              }}>
                Safety & Emergency App
              </Text>
              <Text style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.7)',
                textAlign: 'center',
                fontWeight: '300'
              }}>
                Your safety, our priority
              </Text>
            </Animated.View>
          </Animated.View>

          {/* Features Preview */}
          <Animated.View style={{
            opacity: logoAnim,
            width: '100%',
            alignItems: 'center',
            marginBottom: 50
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              paddingHorizontal: 20
            }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8
                }}>
                  <Ionicons name="call" size={24} color="white" />
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textAlign: 'center' }}>
                  Emergency{'\n'}Calls
                </Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8
                }}>
                  <Ionicons name="location" size={24} color="white" />
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textAlign: 'center' }}>
                  Live{'\n'}Location
                </Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8
                }}>
                  <Ionicons name="people" size={24} color="white" />
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textAlign: 'center' }}>
                  Emergency{'\n'}Contacts
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Loading Indicator */}
          <Animated.View style={{
            opacity: fadeAnim,
            alignItems: 'center'
          }}>
            <ActivityIndicator size="large" color="white" style={{ marginBottom: 16 }} />
            <Text style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 16,
              fontWeight: '500'
            }}>
              {isLoading ? 'Checking authentication...' : 'Loading...'}
            </Text>
          </Animated.View>

          {/* Bottom Branding */}
          <View style={{
            position: 'absolute',
            bottom: 50,
            alignItems: 'center'
          }}>
            <Text style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12,
              textAlign: 'center'
            }}>
              Powered by React Native & Expo
            </Text>
            <Text style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 10,
              marginTop: 4
            }}>
              Version 1.0.0
            </Text>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}
