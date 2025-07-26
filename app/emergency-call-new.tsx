import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, Linking, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function EmergencyCallScreen() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  const emergencyServices = [
    {
      id: 'police',
      name: 'Police',
      number: '100',
      color: '#8B5CF6',
      icon: 'shield-outline'
    },
    {
      id: 'fire',
      name: 'Fire Department',
      number: '101', 
      color: '#EF4444',
      icon: 'flame-outline'
    },
    {
      id: 'medical',
      name: 'Medical Emergency',
      number: '102',
      color: '#10B981',
      icon: 'medical-outline'
    },
    {
      id: 'women',
      name: 'Women Helpline',
      number: '1091',
      color: '#F59E0B',
      icon: 'heart-outline'
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Call duration timer
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000) as unknown as NodeJS.Timeout;
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleServicePress = (service: any) => {
    setSelectedService(service.id);
    Alert.alert(
      `Call ${service.name}`,
      `Do you want to call ${service.name} at ${service.number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          style: 'destructive',
          onPress: () => {
            setIsCallActive(true);
            setCallDuration(0);
            Linking.openURL(`tel:${service.number}`);
          }
        }
      ]
    );
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    setSelectedService(null);
    Alert.alert('Call Ended', 'Emergency call has been ended.');
  };

  return (
    <LinearGradient
      colors={['#8B5CF6', '#A855F7']}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View style={{ paddingTop: 50, paddingHorizontal: 24, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 20, 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
            {isCallActive ? 'Calling via SIM1' : 'Call Emergency'}
          </Text>
          
          <View style={{ width: 40 }} />
        </View>

        {isCallActive && (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>
              {emergencyServices.find(s => s.id === selectedService)?.number || '100'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
              {emergencyServices.find(s => s.id === selectedService)?.name || 'Police'}
            </Text>
          </View>
        )}
      </View>

      {/* Main Content */}
      <View style={{ 
        flex: 1, 
        backgroundColor: 'white', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30,
        paddingTop: 30
      }}>
        {!isCallActive ? (
          // Emergency Services Grid
          <View style={{ paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 30, textAlign: 'center' }}>
              Select Emergency Service
            </Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {emergencyServices.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  onPress={() => handleServicePress(service)}
                  style={{ 
                    width: '48%',
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 20,
                    marginBottom: 20,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 5,
                    borderWidth: 2,
                    borderColor: service.color
                  }}
                >
                  <View style={{ 
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: `${service.color}15`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 15
                  }}>
                    <Ionicons name={service.icon as any} size={28} color={service.color} />
                  </View>
                  
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: service.color, marginBottom: 5 }}>
                    {service.number}
                  </Text>
                  
                  <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 18 }}>
                    {service.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quick Actions */}
            <View style={{ marginTop: 30 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 15 }}>
                Quick Actions
              </Text>
              
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/live-location')}
                style={{ 
                  backgroundColor: '#F8FAFC',
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12
                }}
              >
                <Ionicons name="location-outline" size={24} color="#8B5CF6" style={{ marginRight: 12 }} />
                <Text style={{ flex: 1, fontSize: 16, color: '#1F2937' }}>Share Live Location</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(tabs)/contacts')}
                style={{ 
                  backgroundColor: '#F8FAFC',
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Ionicons name="people-outline" size={24} color="#8B5CF6" style={{ marginRight: 12 }} />
                <Text style={{ flex: 1, fontSize: 16, color: '#1F2937' }}>Alert Emergency Contacts</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Active Call Interface
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
            {/* Call Duration */}
            <Text style={{ fontSize: 18, color: '#6B7280', marginBottom: 30 }}>
              {formatDuration(callDuration)}
            </Text>

            {/* Animated Call Button */}
            <Animated.View style={{ 
              transform: [{ scale: pulseAnim }],
              marginBottom: 50
            }}>
              <View style={{ 
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: '#EF4444',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#EF4444',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
                elevation: 10
              }}>
                <Ionicons name="call" size={50} color="white" />
              </View>
            </Animated.View>

            {/* Call Controls */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 30 }}>
              <TouchableOpacity style={{ 
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#F3F4F6',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Ionicons name="mic-off-outline" size={28} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity style={{ 
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#F3F4F6',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Ionicons name="volume-high-outline" size={28} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity style={{ 
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#F3F4F6',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Ionicons name="keypad-outline" size={28} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* End Call Button */}
            <TouchableOpacity
              onPress={endCall}
              style={{ 
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#EF4444',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#EF4444',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8
              }}
            >
              <Ionicons name="call" size={35} color="white" style={{ transform: [{ rotate: '135deg' }] }} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}
