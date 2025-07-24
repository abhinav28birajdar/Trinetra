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
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 pt-16">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-6">
              <Ionicons name="person-add" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
            <Text className="text-gray-600 text-center">Join Trinatra for emergency safety</Text>
          </View>

          {/* Registration Form */}
          <View className="space-y-6">
            <View>
              <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
              <View className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  className="text-gray-900"
                />
              </View>
            </View>

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
                  placeholder="Create a password"
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

            <View>
              <Text className="text-gray-700 font-medium mb-2">Confirm Password</Text>
              <View className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 flex-row items-center">
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  className="flex-1 text-gray-900"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2"
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
            className={`mt-8 py-4 rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Terms and Privacy */}
          <Text className="text-center text-gray-500 text-sm mt-6">
            By creating an account, you agree to our{' '}
            <Text className="text-blue-600">Terms of Service</Text> and{' '}
            <Text className="text-blue-600">Privacy Policy</Text>
          </Text>

          {/* Sign In Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
