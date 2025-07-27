import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#5A189A', '#7C3AED', '#A855F7']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: 40 
      }}>
        {/* App Icon */}
        <View style={{
          alignItems: 'center',
          marginBottom: 40,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 10
        }}>
          <Image 
            source={require('../assets/images/icon.png')}
            style={{ 
              width: 120, 
              height: 120,
              borderRadius: 20
            }}
          />
        </View>

        {/* Title */}
        <Text style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          marginBottom: 16,
        }}>
          Trinatra
        </Text>

        {/* Subtitle */}
        <Text style={{
          fontSize: 18,
          color: 'rgba(255,255,255,0.8)',
          textAlign: 'center',
          marginBottom: 60,
          lineHeight: 24,
        }}>
          Your Personal Safety Companion
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={{
            backgroundColor: 'white',
            borderRadius: 25,
            paddingVertical: 16,
            paddingHorizontal: 40,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text style={{
            color: '#5A189A',
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
            Get Started
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity
          onPress={() => router.push('/register-premium')}
          style={{
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.5)',
            borderRadius: 25,
            paddingVertical: 16,
            paddingHorizontal: 40,
          }}
        >
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
          }}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
