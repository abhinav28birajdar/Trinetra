import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    setLoading(true);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
          data: {
            full_name: fullName,
          }
      }
    });

    if (signUpError) {
      Alert.alert('Registration Failed', signUpError.message);
    } else if (signUpData.user) {
        // Create profile entry
         try {
             const { error: profileError } = await supabase
                 .from('profiles')
                 .upsert({ 
                   id: signUpData.user.id,
                   email: signUpData.user.email || email,
                   full_name: fullName 
                 });

             if (profileError) {
                 console.warn("Could not create profile:", profileError.message);
             }
         } catch (e) {
              console.warn("Error creating profile:", e);
         }

      // Alert the user about email confirmation if enabled in Supabase
      if (signUpData.session == null) { // Indicates confirmation required
         Alert.alert('Registration Successful', 'Please check your email to confirm your account.');
         router.replace('/login'); // Go back to login screen
      } else {
         // Auto-logged in (if email confirmation is disabled or successful immediately)
         console.log('Registration and auto-login successful');
      }

    } else {
        Alert.alert('Registration Failed', 'An unknown error occurred.');
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 items-center bg-white">
       <View className="w-full p-8 mt-10 bg-white rounded-t-3xl flex-1 items-center">
           <Ionicons name="person-add-outline" size={80} color="#6B21A8" />
           <Text className="text-3xl font-bold text-primary mb-2 mt-4">Register</Text>
           <Text className="text-gray-500 mb-8">Create your account</Text>

         {/* Full Name Input */}
         <View className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 mb-4 flex-row items-center">
            <Ionicons name="person-outline" size={20} color="#6B21A8" style={{ marginRight: 10 }}/>
            <TextInput
                className="flex-1 text-gray-800"
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                placeholderTextColor="#9CA3AF"
            />
        </View>

        {/* Email Input */}
        <View className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 mb-4 flex-row items-center">
            <Ionicons name="mail-outline" size={20} color="#6B21A8" style={{ marginRight: 10 }}/>
            <TextInput
                className="flex-1 text-gray-800"
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#9CA3AF"
            />
        </View>

        {/* Password Input */}
        <View className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 mb-4 flex-row items-center">
            <Ionicons name="lock-closed-outline" size={20} color="#6B21A8" style={{ marginRight: 10 }}/>
            <TextInput
                className="flex-1 text-gray-800"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
            />
        </View>

         {/* Confirm Password Input */}
         <View className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 mb-6 flex-row items-center">
            <Ionicons name="lock-closed-outline" size={20} color="#6B21A8" style={{ marginRight: 10 }}/>
            <TextInput
                className="flex-1 text-gray-800"
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
            />
        </View>

         <Text className="text-xs text-gray-500 mb-6 text-center px-4">
             By registering, you are agreeing to our Terms of use and Privacy Policy
         </Text>

        <TouchableOpacity
          className="w-full bg-primary py-4 rounded-lg items-center justify-center mb-4"
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-bold">Register</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row">
             <Text className="text-gray-500">Already have an account? </Text>
             <Link href="/login">
                 <Text className="text-primary font-semibold">Login</Text>
             </Link>
         </View>
       </View>
    </View>
  );
}
