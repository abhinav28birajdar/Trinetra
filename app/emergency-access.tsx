import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, Text, TouchableOpacity, View } from 'react-native';

export default function EmergencyAccessScreen() {
  const [emergencyNumbers] = useState([
    { name: 'Police', number: '911', icon: 'shield-outline', color: '#1e40af' },
    { name: 'Fire Department', number: '911', icon: 'flame-outline', color: '#dc2626' },
    { name: 'Medical Emergency', number: '911', icon: 'medical-outline', color: '#059669' },
    { name: 'Poison Control', number: '1-800-222-1222', icon: 'warning-outline', color: '#d97706' },
  ]);

  const callEmergencyNumber = async (number: string, service: string) => {
    try {
      const phoneUrl = `tel:${number}`;
      const canCall = await Linking.canOpenURL(phoneUrl);
      
      if (canCall) {
        Alert.alert(
          `Call ${service}?`,
          `This will call ${number}`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Call', 
              onPress: () => {
                // Navigate to emergency-call screen with parameters
                router.push({
                  pathname: '/emergency-call',
                  params: {
                    contactId: service.toLowerCase().replace(/\s+/g, '-'),
                    contactName: service,
                    contactPhone: number
                  }
                });
              } 
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Unable to make phone calls on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate call');
    }
  };

  return (
    <View className="flex-1 bg-red-600">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-16 pb-8">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text className="text-white text-xl font-bold">Emergency Access</Text>
        
        <TouchableOpacity
          onPress={() => router.push('/login')}
          className="px-4 py-2 bg-white/20 rounded-lg"
        >
          <Text className="text-white font-semibold">Login</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Warning */}
      <View className="mx-6 mb-8 p-6 bg-white/10 rounded-xl backdrop-blur">
        <View className="flex-row items-center mb-4">
          <Ionicons name="warning" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-3">Emergency Only</Text>
        </View>
        <Text className="text-white/90 text-base leading-6">
          This screen provides quick access to emergency services. For non-emergency situations, 
          please create an account to access all safety features.
        </Text>
      </View>

      {/* Emergency Numbers */}
      <View className="flex-1 mx-6">
        <Text className="text-white font-bold text-lg mb-4">Emergency Contacts</Text>
        
        {emergencyNumbers.map((emergency, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => callEmergencyNumber(emergency.number, emergency.name)}
            className="bg-white rounded-xl p-6 mb-4 flex-row items-center shadow-lg"
          >
            <View 
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: emergency.color }}
            >
              <Ionicons name={emergency.icon as any} size={24} color="white" />
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-lg">{emergency.name}</Text>
              <Text className="text-gray-600 text-base">{emergency.number}</Text>
            </View>
            
            <Ionicons name="call" size={24} color={emergency.color} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View className="mx-6 mb-8">
        <View className="bg-white/10 rounded-xl p-4">
          <Text className="text-white/90 text-center text-sm">
            For full safety features including SOS alerts, emergency contacts, 
            and location sharing, please create an account.
          </Text>
          
          <TouchableOpacity
            onPress={() => router.push('/register')}
            className="mt-4 bg-white py-3 rounded-lg"
          >
            <Text className="text-red-600 text-center font-bold text-lg">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
