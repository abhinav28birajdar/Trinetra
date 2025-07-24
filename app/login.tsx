import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../store/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 pt-16">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-6">
              <Ionicons name="shield-checkmark" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
            <Text className="text-gray-600 text-center">Sign in to access your safety dashboard</Text>
          </View>

          {/* Login Form */}
          <View className="space-y-6">
            <View>
              <Text className="text-gray-700 font-medium mb-2">Email Address</Text>
              <View className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="text-gray-900"
                />
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 flex-row items-center">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  className="flex-1 text-gray-900"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-2"
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity className="self-end">
              <Text className="text-blue-600 font-medium">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`mt-8 py-4 rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Emergency Access */}
          <TouchableOpacity 
            className="mt-4 py-4 border border-red-500 rounded-lg"
            onPress={() => router.push('/emergency-access')}
          >
            <Text className="text-red-600 text-center font-semibold text-lg">
              Emergency Access
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Don't have an account? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
