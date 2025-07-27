import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../store/auth';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms of Service');
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
      const { error } = await signUp(email, password, username);
      
      if (error) {
        Alert.alert('Registration Failed', error.message || 'An error occurred');
      } else {
        Alert.alert(
          'Registration Successful', 
          'Please check your email to verify your account',
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
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Illustration Section */}
          <View style={{ 
            backgroundColor: 'white',
            paddingTop: 60,
            paddingBottom: 40,
            alignItems: 'center',
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            shadowColor: '#5A189A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}>
            {/* People Illustration - Same as login */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'flex-end',
              marginBottom: 30,
              paddingHorizontal: 20,
            }}>
              {/* Person 1 - Business Woman */}
              <View style={{ alignItems: 'center', marginRight: 15 }}>
                <View style={{
                  width: 50,
                  height: 60,
                  backgroundColor: '#3B82F6',
                  borderRadius: 25,
                  marginBottom: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name="person" size={30} color="white" />
                </View>
                <View style={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#1E40AF',
                  borderRadius: 20,
                }} />
              </View>

              {/* Person 2 - Doctor */}
              <View style={{ alignItems: 'center', marginRight: 15 }}>
                <View style={{
                  width: 50,
                  height: 60,
                  backgroundColor: '#10B981',
                  borderRadius: 25,
                  marginBottom: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name="medical" size={30} color="white" />
                </View>
                <View style={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#065F46',
                  borderRadius: 20,
                }} />
              </View>

              {/* Person 3 - Student */}
              <View style={{ alignItems: 'center', marginRight: 15 }}>
                <View style={{
                  width: 50,
                  height: 60,
                  backgroundColor: '#F59E0B',
                  borderRadius: 25,
                  marginBottom: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name="school" size={30} color="white" />
                </View>
                <View style={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#D97706',
                  borderRadius: 20,
                }} />
              </View>

              {/* Person 4 - Professional */}
              <View style={{ alignItems: 'center', marginRight: 15 }}>
                <View style={{
                  width: 50,
                  height: 60,
                  backgroundColor: '#EF4444',
                  borderRadius: 25,
                  marginBottom: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name="briefcase" size={30} color="white" />
                </View>
                <View style={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#DC2626',
                  borderRadius: 20,
                }} />
              </View>

              {/* Person 5 - Teacher */}
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 50,
                  height: 60,
                  backgroundColor: '#8B5CF6',
                  borderRadius: 25,
                  marginBottom: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name="library" size={30} color="white" />
                </View>
                <View style={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#7C3AED',
                  borderRadius: 20,
                }} />
              </View>
            </View>
          </View>

          {/* Register Form */}
          <View style={{ 
            flex: 1,
            backgroundColor: 'white',
            marginHorizontal: 20,
            marginTop: 30,
            marginBottom: 30,
            borderRadius: 20,
            padding: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
              {/* App Icon */}
              <View style={{
                alignItems: 'center',
                marginBottom: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 5
              }}>
                <Image 
                  source={require('../assets/images/icon.png')}
                  style={{ 
                    width: 60, 
                    height: 60,
                    borderRadius: 12
                  }}
                />
              </View>
              
              <Text style={{ 
                fontSize: 28, 
                fontWeight: 'bold', 
                color: '#5A189A',
                marginBottom: 8,
              }}>
                Create Account
              </Text>
              <Text style={{ 
                fontSize: 16, 
                color: '#6b7280',
                textAlign: 'center',
              }}>
                Join Trinatra for enhanced safety
              </Text>
            </View>

            {/* Username Input */}
            <View style={{ marginBottom: 20 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: '#e5e7eb',
              }}>
                <Ionicons name="person" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
                <TextInput
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  style={{ 
                    flex: 1, 
                    fontSize: 16, 
                    color: '#111827',
                  }}
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={{ marginBottom: 20 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: '#e5e7eb',
              }}>
                <Ionicons name="mail" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
                <TextInput
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  style={{ 
                    flex: 1, 
                    fontSize: 16, 
                    color: '#111827',
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 20 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: '#e5e7eb',
              }}>
                <Ionicons name="lock-closed" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={{ 
                    flex: 1, 
                    fontSize: 16, 
                    color: '#111827',
                  }}
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={{ marginBottom: 20 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: '#e5e7eb',
              }}>
                <Ionicons name="lock-closed" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
                <TextInput
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  style={{ 
                    flex: 1, 
                    fontSize: 16, 
                    color: '#111827',
                  }}
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms Agreement */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 30,
            }}>
              <TouchableOpacity
                onPress={() => setAgreeToTerms(!agreeToTerms)}
                style={{ marginRight: 12, marginTop: 2 }}
              >
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: agreeToTerms ? '#5A189A' : '#d1d5db',
                  backgroundColor: agreeToTerms ? '#5A189A' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {agreeToTerms && <Ionicons name="checkmark" size={12} color="white" />}
                </View>
              </TouchableOpacity>
              <Text style={{ color: '#6b7280', fontSize: 14, flex: 1, lineHeight: 20 }}>
                By registering you are agreeing to our Terms of
                Service and Privacy Policy
              </Text>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              style={{
                backgroundColor: '#5A189A',
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                marginBottom: 20,
                shadowColor: '#5A189A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              {isLoading ? (
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  Creating Account...
                </Text>
              ) : (
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  REGISTER
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginTop: 10,
            }}>
              <Text style={{ color: '#6b7280', fontSize: 14 }}>
                Already have an account? 
              </Text>
              <Link href="/login" asChild>
                <TouchableOpacity style={{ marginLeft: 4 }}>
                  <Text style={{ color: '#5A189A', fontSize: 14, fontWeight: '600' }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
