import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../store/auth';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !fullName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        Alert.alert('Registration Failed', error.message || 'An error occurred');
      } else {
        Alert.alert(
          'Registration Successful', 
          'Please check your email to verify your account before signing in.',
          [{ text: 'OK', onPress: () => router.replace('/login') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: 'white' }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 64 }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <View style={{ 
              width: 80, 
              height: 80, 
              backgroundColor: '#2563EB', 
              borderRadius: 40, 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: 24 
            }}>
              <Ionicons name="person-add" size={40} color="white" />
            </View>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
              Create Account
            </Text>
            <Text style={{ color: '#6B7280', textAlign: 'center' }}>
              Join Trinetra for emergency safety
            </Text>
          </View>

          {/* Registration Form */}
          <View style={{ gap: 24 }}>
            <View>
              <Text style={{ color: '#374151', fontWeight: '500', marginBottom: 8 }}>
                Full Name
              </Text>
              <View style={{ 
                borderWidth: 1, 
                borderColor: '#D1D5DB', 
                borderRadius: 8, 
                paddingHorizontal: 16, 
                paddingVertical: 12, 
                backgroundColor: '#F9FAFB' 
              }}>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  style={{ color: '#111827' }}
                />
              </View>
            </View>

            <View>
              <Text style={{ color: '#374151', fontWeight: '500', marginBottom: 8 }}>
                Email Address
              </Text>
              <View style={{ 
                borderWidth: 1, 
                borderColor: '#D1D5DB', 
                borderRadius: 8, 
                paddingHorizontal: 16, 
                paddingVertical: 12, 
                backgroundColor: '#F9FAFB' 
              }}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ color: '#111827' }}
                />
              </View>
            </View>

            <View>
              <Text style={{ color: '#374151', fontWeight: '500', marginBottom: 8 }}>
                Password
              </Text>
              <View style={{ 
                borderWidth: 1, 
                borderColor: '#D1D5DB', 
                borderRadius: 8, 
                paddingHorizontal: 16, 
                paddingVertical: 12, 
                backgroundColor: '#F9FAFB',
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  secureTextEntry={!showPassword}
                  style={{ flex: 1, color: '#111827' }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ marginLeft: 8 }}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={{ color: '#374151', fontWeight: '500', marginBottom: 8 }}>
                Confirm Password
              </Text>
              <View style={{ 
                borderWidth: 1, 
                borderColor: '#D1D5DB', 
                borderRadius: 8, 
                paddingHorizontal: 16, 
                paddingVertical: 12, 
                backgroundColor: '#F9FAFB',
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  style={{ flex: 1, color: '#111827' }}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ marginLeft: 8 }}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            style={{ 
              marginTop: 32,
              paddingVertical: 16,
              borderRadius: 8,
              backgroundColor: isLoading ? '#9CA3AF' : '#2563EB'
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 18 }}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Terms and Privacy */}
          <Text style={{ textAlign: 'center', color: '#6B7280', fontSize: 14, marginTop: 24 }}>
            By creating an account, you agree to our{' '}
            <Text style={{ color: '#2563EB' }}>Terms of Service</Text> and{' '}
            <Text style={{ color: '#2563EB' }}>Privacy Policy</Text>
          </Text>

          {/* Sign In Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
            <Text style={{ color: '#6B7280' }}>Already have an account? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={{ color: '#2563EB', fontWeight: '600' }}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
