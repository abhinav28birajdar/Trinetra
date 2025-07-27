import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Text } from 'react-native';

export default function LoadingScreen() {
  return (
    <LinearGradient
      colors={['#5A189A', '#7C3AED', '#A855F7']}
      style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}
    >
      <ActivityIndicator size="large" color="white" />
      <Text style={{ 
        color: 'white', 
        fontSize: 16, 
        marginTop: 20,
        fontWeight: '600'
      }}>
        Loading...
      </Text>
    </LinearGradient>
  );
}
