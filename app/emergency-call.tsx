import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Linking,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function EmergencyCallScreen() {
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (callStatus === 'calling') {
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

      // Simulate call connection after 3 seconds
      const timer = setTimeout(() => {
        setCallStatus('connected');
        startCallTimer();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [callStatus]);

  const startCallTimer = () => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCall = (type: 'police' | 'medical' | 'emergency') => {
    const numbers = {
      police: '100',
      medical: '181',
      emergency: '911'
    };

    Alert.alert(
      'Emergency Call',
      `Calling ${type} services (${numbers[type]})`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Now', 
          style: 'destructive',
          onPress: () => {
            setCallStatus('calling');
            Linking.openURL(`tel:${numbers[type]}`);
          }
        }
      ]
    );
  };

  const endCall = () => {
    setCallStatus('idle');
    setCallDuration(0);
    pulseAnim.setValue(1);
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#DC2626', '#EF4444', '#F87171']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={{ paddingTop: 50, paddingHorizontal: 24, alignItems: 'center', marginBottom: 40 }}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ 
              position: 'absolute', 
              left: 24, 
              top: 55,
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

          <Text style={{ 
            color: 'white', 
            fontSize: 24, 
            fontWeight: 'bold',
            marginTop: 20
          }}>
            Emergency Call
          </Text>
          <Text style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: 16,
            marginTop: 8
          }}>
            {callStatus === 'idle' && 'Choose emergency service'}
            {callStatus === 'calling' && 'Calling emergency services...'}
            {callStatus === 'connected' && `Connected - ${formatTime(callDuration)}`}
          </Text>
        </View>

        {/* Main Content */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          {callStatus === 'idle' && (
            <>
              {/* Emergency Service Buttons */}
              <View style={{ width: '100%', marginBottom: 40 }}>
                <TouchableOpacity
                  onPress={() => handleCall('police')}
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: 20, 
                    padding: 20, 
                    marginBottom: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8
                  }}
                >
                  <View style={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: 30, 
                    backgroundColor: '#3B82F6', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: 16
                  }}>
                    <Ionicons name="shield" size={28} color="white" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 }}>
                      Police
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6B7280' }}>
                      Emergency: 100
                    </Text>
                  </View>
                  <Ionicons name="call" size={24} color="#3B82F6" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleCall('medical')}
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: 20, 
                    padding: 20, 
                    marginBottom: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8
                  }}
                >
                  <View style={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: 30, 
                    backgroundColor: '#10B981', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: 16
                  }}>
                    <Ionicons name="medical" size={28} color="white" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 }}>
                      Medical Emergency
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6B7280' }}>
                      Women Helpline: 181
                    </Text>
                  </View>
                  <Ionicons name="call" size={24} color="#10B981" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleCall('emergency')}
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: 20, 
                    padding: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8
                  }}
                >
                  <View style={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: 30, 
                    backgroundColor: '#EF4444', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: 16
                  }}>
                    <Ionicons name="warning" size={28} color="white" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 }}>
                      General Emergency
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6B7280' }}>
                      Emergency: 911
                    </Text>
                  </View>
                  <Ionicons name="call" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </>
          )}

          {(callStatus === 'calling' || callStatus === 'connected') && (
            <View style={{ alignItems: 'center' }}>
              {/* Call Animation */}
              <Animated.View style={{ 
                transform: [{ scale: pulseAnim }],
                marginBottom: 40
              }}>
                <View style={{ 
                  width: 150, 
                  height: 150, 
                  borderRadius: 75, 
                  backgroundColor: 'white', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 15,
                  elevation: 10
                }}>
                  <Ionicons name="call" size={60} color="#DC2626" />
                </View>
              </Animated.View>

              {/* Call Info */}
              <Text style={{ 
                color: 'white', 
                fontSize: 20, 
                fontWeight: 'bold',
                marginBottom: 8,
                textAlign: 'center'
              }}>
                Emergency Services
              </Text>
              <Text style={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: 16,
                marginBottom: 40,
                textAlign: 'center'
              }}>
                {callStatus === 'calling' ? 'Connecting...' : 'Call in progress'}
              </Text>

              {/* Call Actions */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                <TouchableOpacity style={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: 30, 
                  backgroundColor: 'rgba(255,255,255,0.3)', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Ionicons name="mic-off" size={28} color="white" />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={endCall}
                  style={{ 
                    width: 70, 
                    height: 70, 
                    borderRadius: 35, 
                    backgroundColor: '#DC2626', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8
                  }}
                >
                  <Ionicons name="call" size={32} color="white" style={{ transform: [{ rotate: '135deg' }] }} />
                </TouchableOpacity>

                <TouchableOpacity style={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: 30, 
                  backgroundColor: 'rgba(255,255,255,0.3)', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Ionicons name="volume-high" size={28} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Contact Emergency Contacts */}
        {callStatus === 'idle' && (
          <View style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            margin: 24, 
            borderRadius: 20, 
            padding: 20 
          }}>
            <Text style={{ 
              color: 'white', 
              fontSize: 18, 
              fontWeight: 'bold',
              marginBottom: 12,
              textAlign: 'center'
            }}>
              Quick Actions
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: 25, 
                  backgroundColor: 'white', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: 8
                }}>
                  <Ionicons name="location" size={24} color="#DC2626" />
                </View>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                  Share Location
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: 25, 
                  backgroundColor: 'white', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: 8
                }}>
                  <Ionicons name="people" size={24} color="#DC2626" />
                </View>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                  Alert Contacts
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: 25, 
                  backgroundColor: 'white', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: 8
                }}>
                  <Ionicons name="camera" size={24} color="#DC2626" />
                </View>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                  Emergency Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}
