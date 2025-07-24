import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
       // Auth state listener in RootLayout handles redirection
       console.log('Login successful');
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 items-center bg-white">
      <View className="w-full p-8 mt-10 bg-white rounded-t-3xl flex-1 items-center">
        <Ionicons name="person-circle-outline" size={80} color="#6B21A8" />
        <Text className="text-3xl font-bold text-primary mb-2 mt-4">Welcome Back</Text>
        <Text className="text-gray-500 mb-8">Login to your account</Text>

        <View className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 mb-4 flex-row items-center">
          <Ionicons name="person-outline" size={20} color="#6B21A8" style={{ marginRight: 10 }}/>
          <TextInput
            className="flex-1 text-gray-800"
            placeholder="Username or Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#9CA3AF"
          />
        </View>

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

        <View className="w-full flex-row justify-between items-center mb-8">
          <Text className="text-primary">Remember me</Text>
          <Text className="text-primary">Forgot Password?</Text>
        </View>

        <TouchableOpacity
          className="w-full bg-primary py-4 rounded-lg items-center justify-center mb-4"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-bold">Login</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row">
          <Text className="text-gray-500">Don't have an account? </Text>
          <Link href="/register">
            <Text className="text-primary font-semibold">Sign up</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
