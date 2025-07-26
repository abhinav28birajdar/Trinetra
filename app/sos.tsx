import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, Linking, StatusBar, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { useAuth } from '../store/auth';

const { width, height } = Dimensions.get('window');

export default function SOSScreen() {
  const { user, profile } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    
    if (isActive && countdown > 0) {
      // Vibrate every second during countdown
      Vibration.vibrate(200);
      
      // Pulse animation
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      interval = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isActive && countdown === 0) {
      // Activate SOS
      activateEmergency();
    }

    return () => {
      if (interval) clearTimeout(interval);
    };
  }, [isActive, countdown]);

  const startSOS = () => {
    Alert.alert(
      'Emergency SOS',
      'This will call emergency services and alert your emergency contacts. Hold the button to continue.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start SOS',
          style: 'destructive',
          onPress: () => {
            setIsActive(true);
            setCountdown(5);
            // Start scale animation
            Animated.timing(scaleAnim, {
              toValue: 1.5,
              duration: 5000,
              useNativeDriver: true,
            }).start();
          }
        }
      ]
    );
  };

  const cancelSOS = () => {
    setIsActive(false);
    setCountdown(5);
    
    // Reset animations
    scaleAnim.setValue(1);
    pulseAnim.setValue(1);
    
    Alert.alert('SOS Cancelled', 'Emergency activation has been cancelled.');
  };

  const activateEmergency = () => {
    setIsActive(false);
    setCountdown(5);
    
    // Reset animations
    scaleAnim.setValue(1);
    pulseAnim.setValue(1);
    
    // Long vibration for activation
    Vibration.vibrate(1000);
    
    Alert.alert(
      'SOS ACTIVATED!',
      'Emergency services are being called and your emergency contacts have been notified.',
      [
        {
          text: 'Call Police (100)',
          onPress: () => Linking.openURL('tel:100')
        },
        {
          text: 'Call Medical (102)',
          onPress: () => Linking.openURL('tel:102')
        }
      ]
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={isActive ? '#EF4444' : '#8B5CF6'} />
      <LinearGradient
        colors={isActive ? ['#EF4444', '#DC2626', '#B91C1C'] : ['#8B5CF6', '#7C3AED', '#6D28D9']}
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
              {isActive ? 'SOS ACTIVATING' : 'Emergency SOS'}
            </Text>
            
            <View style={{ width: 40 }} />
          </View>

          {isActive && (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
                Calling Emergency Services
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginTop: 8 }}>
                in {countdown} seconds
              </Text>
            </View>
          )}
        </View>

        {/* Main SOS Interface */}
        <View style={{ 
          flex: 1, 
          alignItems: 'center', 
          justifyContent: 'center',
          paddingHorizontal: 40
        }}>
          {/* SOS Button */}
          <TouchableOpacity
            onPress={isActive ? cancelSOS : startSOS}
            onLongPress={!isActive ? startSOS : undefined}
            style={{ alignItems: 'center' }}
          >
            <Animated.View style={{
              transform: [{ scale: scaleAnim }, { scale: pulseAnim }]
            }}>
              <LinearGradient
                colors={isActive ? ['#FFFFFF', '#F3F4F6'] : ['#FFFFFF', '#F9FAFB']}
                style={{ 
                  width: 280,
                  height: 280,
                  borderRadius: 140,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 20 },
                  shadowOpacity: 0.3,
                  shadowRadius: 30,
                  elevation: 20,
                  borderWidth: isActive ? 8 : 4,
                  borderColor: isActive ? '#EF4444' : '#8B5CF6'
                }}
              >
                <Text style={{ 
                  fontSize: 48, 
                  fontWeight: 'bold',
                  color: isActive ? '#EF4444' : '#8B5CF6',
                  textAlign: 'center',
                  marginBottom: 8
                }}>
                  {isActive ? countdown : 'TAP'}
                </Text>
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '600',
                  color: isActive ? '#DC2626' : '#7C3AED',
                  textAlign: 'center'
                }}>
                  {isActive ? 'TAP TO CANCEL' : 'FOR EMERGENCY'}
                </Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          {/* Instructions */}
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <Text style={{ 
              color: 'white', 
              fontSize: 18, 
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 12
            }}>
              {isActive ? 'Emergency Activation in Progress' : 'Emergency Help'}
            </Text>
            <Text style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: 14, 
              textAlign: 'center',
              lineHeight: 20,
              marginBottom: 20
            }}>
              {isActive 
                ? 'Tap the button to cancel emergency activation'
                : 'Tap the button to start emergency protocol\nThis will alert emergency services and your contacts'
              }
            </Text>

            {!isActive && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="information-circle-outline" size={20} color="rgba(255,255,255,0.8)" />
                <Text style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: 12, 
                  marginLeft: 8
                }}>
                  Long press for immediate activation
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        {!isActive && (
          <View style={{ 
            paddingHorizontal: 24, 
            paddingBottom: 40 
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <TouchableOpacity
                onPress={() => Linking.openURL('tel:100')}
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 20,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  alignItems: 'center',
                  minWidth: 100
                }}
              >
                <Ionicons name="call" size={24} color="white" style={{ marginBottom: 4 }} />
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                  Police
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10 }}>
                  100
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Linking.openURL('tel:102')}
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 20,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  alignItems: 'center',
                  minWidth: 100
                }}
              >
                <Ionicons name="medical" size={24} color="white" style={{ marginBottom: 4 }} />
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                  Medical
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10 }}>
                  102
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Linking.openURL('tel:1091')}
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 20,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  alignItems: 'center',
                  minWidth: 100
                }}
              >
                <Ionicons name="heart" size={24} color="white" style={{ marginBottom: 4 }} />
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                  Women
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10 }}>
                  1091
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>
    </>
  );
}
