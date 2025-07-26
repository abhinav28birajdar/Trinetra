import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../store/auth';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#8B5CF6', '#A855F7', '#C084FC']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 60 }}>
              {/* Decorative Elements */}
              <View style={{ position: 'absolute', top: 40, right: 20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <View style={{ position: 'absolute', top: 120, left: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.05)' }} />
              
              {/* Header with People Illustrations */}
              <View style={{ alignItems: 'center', marginBottom: 50 }}>
                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                  <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#F59E0B', marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="person" size={24} color="white" />
                  </View>
                  <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#EF4444', marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="person" size={24} color="white" />
                  </View>
                  <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#10B981', marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="person" size={24} color="white" />
                  </View>
                  <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#3B82F6', marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="person" size={24} color="white" />
                  </View>
                  <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#8B5CF6', marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="person" size={24} color="white" />
                  </View>
                </View>
                
                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                  <View style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: 40, 
                    backgroundColor: 'white', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginBottom: 15, 
                    shadowColor: '#000', 
                    shadowOffset: { width: 0, height: 4 }, 
                    shadowOpacity: 0.3, 
                    shadowRadius: 8, 
                    elevation: 8 
                  }}>
                    <Ionicons name="shield-checkmark" size={40} color="#8B5CF6" />
                  </View>
                  <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>Welcome Back</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontSize: 16 }}>Login to your account</Text>
                </View>
              </View>

              {/* Login Form Card */}
              <View style={{ 
                backgroundColor: 'white', 
                borderRadius: 20, 
                padding: 24, 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 8 }, 
                shadowOpacity: 0.15, 
                shadowRadius: 20, 
                elevation: 10 
              }}>
                {/* Email Input */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ color: '#374151', fontWeight: '600', marginBottom: 8, fontSize: 14 }}>Username</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F9FAFB' }}>
                    <Ionicons name="person-outline" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Username"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={{ flex: 1, color: '#1F2937', fontSize: 16 }}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={{ marginBottom: 16 }}>
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

                {/* Remember Me & Forgot Password */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <TouchableOpacity 
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: rememberMe ? '#8B5CF6' : '#D1D5DB', backgroundColor: rememberMe ? '#8B5CF6' : 'transparent', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                      {rememberMe && <Ionicons name="checkmark" size={12} color="white" />}
                    </View>
                    <Text style={{ color: '#6B7280', fontSize: 14 }}>Remember me</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={{ color: '#8B5CF6', fontWeight: '600', fontSize: 14 }}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleLogin}
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
                      {isLoading ? 'Signing In...' : 'Login'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#6B7280', fontSize: 14 }}>Don't have an account? </Text>
                  <Link href="/register" asChild>
                    <TouchableOpacity>
                      <Text style={{ color: '#8B5CF6', fontWeight: '600', fontSize: 14 }}>Sign up</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>

              {/* Emergency Access */}
              <TouchableOpacity 
                style={{ marginTop: 20, paddingVertical: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 12, alignItems: 'center' }}
                onPress={() => router.push('/emergency-access')}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                  Emergency Access
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}
