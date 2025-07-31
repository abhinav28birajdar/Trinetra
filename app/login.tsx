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
import { useAuth } from '../store/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        Alert.alert('Login Failed', error.message || 'Invalid credentials');
      } else {
        router.replace('/(tabs)');
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
            <View style={{ alignItems: 'center', paddingTop: 0, marginBottom: 40 }}>
              <Image 
                  source={require('../assets/images/header.png')}
                style={{ 
                  width: 500, 
                  height: 265,
                  borderBottomLeftRadius: 30,
                  borderBottomRightRadius: 30,
                  resizeMode: 'contain',
                  marginBottom: 10
                }}
              />
              
              <Text style={{ 
                fontSize: 28, 
                fontWeight: 'bold', 
                color: 'white', 
                textAlign: 'center',
                marginBottom: 8
              }}>
                Welcome Back
              </Text>
              <Text style={{ 
                fontSize: 16, 
                color: 'rgba(255,255,255,0.8)', 
                textAlign: 'center' 
              }}>
                Sign in to continue to Trinetra
              </Text>
            </View>

            {/* Login Form */}
            <View style={{ 
              backgroundColor: 'white', 
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              flex: 1,
              paddingHorizontal: 24,
              paddingTop: 25,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 10
            }}>
              {/* Email Input */}
              <View style={{ marginBottom: 20 }}>
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

              {/* Password Input */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ 
                  color: '#374151', 
                  fontWeight: '600', 
                  marginBottom: 8, 
                  fontSize: 14 
                }}>
                  Password
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
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    style={{ flex: 1, color: '#1F2937', fontSize: 16 }}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ marginLeft: 8 }}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#9CA3AF" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remember Me & Forgot Password */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 24 
              }}>
                <TouchableOpacity 
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={{ 
                    width: 20, 
                    height: 20, 
                    borderRadius: 4, 
                    borderWidth: 2, 
                    borderColor: rememberMe ? '#5A189A' : '#D1D5DB', 
                    backgroundColor: rememberMe ? '#5A189A' : 'transparent', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginRight: 8 
                  }}>
                    {rememberMe && <Ionicons name="checkmark" size={12} color="white" />}
                  </View>
                  <Text style={{ color: '#6B7280', fontSize: 14 }}>Remember me</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                  <Text style={{ color: '#5A189A', fontWeight: '600', fontSize: 14 }}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
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
                    Signing In...
                  </Text>
                ) : (
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    Login
                  </Text>
                )}
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: 20,
              }}>
                <Text style={{ color: '#6b7280', fontSize: 14 }}>
                  Don't have an account? 
                </Text>
                <TouchableOpacity 
                  style={{ marginLeft: 4 }}
                  onPress={() => router.push('/register')}
                >
                  <Text style={{ color: '#5A189A', fontSize: 14, fontWeight: '600' }}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Emergency Access */}
              <TouchableOpacity 
                style={{ 
                  marginBottom: 20, 
                  paddingVertical: 16, 
                  borderWidth: 2, 
                  borderColor: '#5A189A', 
                  borderRadius: 12, 
                  alignItems: 'center' 
                }}
                onPress={() => router.push('/emergency-access')}
              >
                <Text style={{ color: '#5A189A', fontWeight: 'bold', fontSize: 16 }}>
                  Emergency Access
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
