import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Colors from '@/constants/colors';
import { Mail, Lock } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.replace('/(tabs)/profile');
    } else {
      Alert.alert('Login Error', error || 'An unknown error occurred');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>SafeConnect</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to your account</Text>
            
            <View style={styles.inputContainer}>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Email address"
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Mail size={20} color={Colors.primary} />}
                style={styles.input}
              />
              
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                icon={<Lock size={20} color={Colors.primary} />}
                style={styles.input}
              />
              
              {error && <Text style={styles.errorText}>{error}</Text>}
              
              <Button 
                title="Login" 
                onPress={handleLogin} 
                loading={loading}
                style={styles.button}
              />
              
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Text style={styles.signupLink}>Sign up</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => router.push('./forgot-password')}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  headerContainer: {
    height: 160,
    width: '100%',
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.dark,
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: Colors.status.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginBottom: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  signupText: {
    fontSize: 14,
    color: Colors.text.dark,
  },
  signupLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  forgotPassword: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
  },
});