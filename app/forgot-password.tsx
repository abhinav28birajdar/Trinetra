import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://your-app.com/reset-password', // You can customize this
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          'Check Your Email',
          'We have sent you a password reset link. Please check your email and follow the instructions.',
          [{ text: 'OK', onPress: () => router.push('/login') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#5A189A' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            {/* Header Image */}
            <View style={{ alignItems: 'center', paddingTop: 60, marginBottom: 40 }}>
              <Image 
                source={require('../assets/images/header.png')}
                style={{ 
                  width: 300, 
                  height: 150,
                  resizeMode: 'contain',
                  marginBottom: 20
                }}
              />
              
              <Text style={{ 
                fontSize: 28, 
                fontWeight: 'bold', 
                color: 'white', 
                textAlign: 'center',
                marginBottom: 8
              }}>
                Reset Password
              </Text>
              <Text style={{ 
                fontSize: 16, 
                color: 'rgba(255,255,255,0.8)', 
                textAlign: 'center',
                paddingHorizontal: 40
              }}>
                Enter your email address and we'll send you a link to reset your password
              </Text>
            </View>

            {/* Reset Form */}
            <View style={{ 
              backgroundColor: 'white', 
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              flex: 1,
              paddingHorizontal: 24,
              paddingTop: 32,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 10
            }}>
              {/* Email Input */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ 
                  color: '#374151', 
                  fontWeight: '600', 
                  marginBottom: 8, 
                  fontSize: 14 
                }}>
                  Email Address
                </Text>
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  borderWidth: 1, 
                  borderColor: '#E5E7EB', 
                  borderRadius: 12, 
                  paddingHorizontal: 16, 
                  paddingVertical: 12, 
                  backgroundColor: '#F9FAFB' 
                }}>
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ flex: 1, color: '#1F2937', fontSize: 16 }}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Reset Button */}
              <TouchableOpacity
                onPress={handleResetPassword}
                disabled={isLoading}
                style={{ 
                  backgroundColor: isLoading ? '#9CA3AF' : '#5A189A',
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginBottom: 16
                }}
              >
                {isLoading ? (
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    Sending...
                  </Text>
                ) : (
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    Send Reset Link
                  </Text>
                )}
              </TouchableOpacity>

              {/* Back to Login Link */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: 20,
              }}>
                <Text style={{ color: '#6b7280', fontSize: 14 }}>
                  Remember your password? 
                </Text>
                <TouchableOpacity 
                  style={{ marginLeft: 4 }}
                  onPress={() => router.push('/login')}
                >
                  <Text style={{ color: '#5A189A', fontSize: 14, fontWeight: '600' }}>
                    Sign in
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Back Button */}
              <TouchableOpacity 
                style={{ 
                  marginTop: 20,
                  paddingVertical: 16, 
                  alignItems: 'center' 
                }}
                onPress={() => router.back()}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="arrow-back" size={20} color="#5A189A" style={{ marginRight: 8 }} />
                  <Text style={{ color: '#5A189A', fontWeight: '600', fontSize: 16 }}>
                    Go Back
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
