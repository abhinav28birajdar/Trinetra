import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../store/auth';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !fullName) {
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
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#5A189A',"#5A189A"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1, paddingHorizontal: 2, paddingTop: 40 }}>
              {/* Decorative Elements */}
              <View style={{ position: 'absolute', top: 40, right: 20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <View style={{ position: 'absolute', top: 120, left: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.05)' }} />
              
              {/* Header with App Icon */}
              <View style={{ alignItems: 'center', marginBottom: 30 }}>
                {/* App Icon */}
                <View style={{
                  alignItems: 'center',
                  marginBottom: -45,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  elevation: 10
                }}>
                  <Image 
                    source={require('../assets/images/icon.png')}
                    style={{ 
                      width: 100, 
                      height: 150,
                      borderRadius: 15
                    }}
                  />
                </View>
                
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 6 }}>Create Account</Text>
                <Text style={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontSize: 16 }}>Create your account</Text>
              </View>

              {/* Registration Form Card */}
              <View style={{ 
                backgroundColor: 'white', 
                borderRadius: 20, 
                padding: 26, 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 8 }, 
                shadowOpacity: 0.15, 
                shadowRadius: 20, 
                elevation: 10 
              }}>
                {/* Full Name Input */}
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ color: '#374151', fontWeight: '600', marginBottom: 12, fontSize: 14 }}>Full Name</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F9FAFB' }}>
                    <Ionicons name="person-outline" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
                    <TextInput
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Full Name"
                      style={{ flex: 1, color: '#1F2937', fontSize: 16 }}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                {/* Email Input */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ color: '#374151', fontWeight: '600', marginBottom: 8, fontSize: 14 }}>Email Address</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F9FAFB' }}>
                    <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Email Address"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={{ flex: 1, color: '#1F2937', fontSize: 16 }}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ color: '#374151', fontWeight: '600', marginBottom: 8, fontSize: 14 }}>Password</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F9FAFB' }}>
                    <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Password"
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

                {/* Confirm Password Input */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ color: '#374151', fontWeight: '600', marginBottom: 8, fontSize: 14 }}>Confirm Password</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F9FAFB' }}>
                    <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
                    <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm password"
                      secureTextEntry={!showConfirmPassword}
                      style={{ flex: 1, color: '#1F2937', fontSize: 16 }}
                      placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ marginLeft: 8 }}
                    >
                      <Ionicons 
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color="#9CA3AF" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Terms Agreement */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                  <TouchableOpacity 
                    style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                    onPress={() => setAgreeToTerms(!agreeToTerms)}
                  >
                    <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: agreeToTerms ? '#8B5CF6' : '#D1D5DB', backgroundColor: agreeToTerms ? '#8B5CF6' : 'transparent', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                      {agreeToTerms && <Ionicons name="checkmark" size={12} color="white" />}
                    </View>
                    <Text style={{ color: '#6B7280', fontSize: 14, flex: 1 }}>
                      By registering, you agree to our{' '}
                      <Text style={{ color: '#8B5CF6', fontWeight: '600' }}>Terms of Service</Text>
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={isLoading}
                  style={{ marginBottom: 16 }}
                >
                  <LinearGradient
                    colors={isLoading ? ['#9CA3AF', '#9CA3AF'] : ['#8B5CF6', '#A855F7']}
                    style={{ paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                      {isLoading ? 'Creating Account...' : 'REGISTER'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Sign In Link */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#6B7280', fontSize: 14 }}>Already have an account? </Text>
                  <Link href="/login" asChild>
                    <TouchableOpacity>
                      <Text style={{ color: '#8B5CF6', fontWeight: '600', fontSize: 14 }}>Login</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}
