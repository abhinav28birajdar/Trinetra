import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { LoginScreenNavigationProp } from '../../types/navigation'; // Adjust path if needed
import { Ionicons } from '@expo/vector-icons'; // For icons

// You might want to add an image like the one in your UI
// const loginIllustration = require('../../assets/images/login_illustration.png'); // Example

const LoginScreen = ({ navigation }: { navigation: LoginScreenNavigationProp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    try {
      await login(email, password);
      // Navigation to AppNavigator will happen automatically via AuthContext
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "An unexpected error occurred.");
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header illustration part */}
      <View className="bg-primary h-1/4 items-center justify-center p-4 rounded-b-[50px]">
        {/* Replace with your actual image/illustration if you have one for the login header */}
        {/* <Image source={loginIllustration} className="w-full h-48" resizeMode="contain" /> */}
        <Text className="text-white text-3xl font-bold mt-4">Safety App</Text>
      </View>

      <View className="flex-1 items-center justify-center p-8 -mt-10">
        <View className="w-24 h-24 bg-lightGray rounded-full items-center justify-center mb-6 border-4 border-white shadow-md">
          <Ionicons name="person-outline" size={48} color="#A0A0A0" />
        </View>
        <Text className="text-primary text-3xl font-bold mb-2">Welcome Back</Text>
        <Text className="text-darkGray text-sm mb-8">Login to your account</Text>

        <View className="w-full mb-4 p-3 bg-lightGray rounded-lg flex-row items-center border border-gray-300">
          <Ionicons name="person-outline" size={20} color="gray" className="mr-2" />
          <TextInput
            className="flex-1 text-darkGray"
            placeholder="Username or Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="gray"
          />
        </View>

        <View className="w-full mb-6 p-3 bg-lightGray rounded-lg flex-row items-center border border-gray-300">
          <Ionicons name="lock-closed-outline" size={20} color="gray" className="mr-2" />
          <TextInput
            className="flex-1 text-darkGray"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="gray"
          />
        </View>

        <View className="w-full flex-row justify-between items-center mb-8">
          <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} className="flex-row items-center">
            <Ionicons name={rememberMe ? "checkbox" : "square-outline"} size={20} color="#4A00A8" />
            <Text className="text-darkGray ml-2">Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-primary font-semibold">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="w-full bg-primary p-4 rounded-lg items-center justify-center shadow-md"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-lg font-bold">Login</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row mt-8">
          <Text className="text-darkGray">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-primary font-bold">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;