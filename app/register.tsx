import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Colors from '@/constants/colors';
import { User, Mail, Lock } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const { register, isLoading, error } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !username) {
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

    const success = await register(username, email, password);
    if (success) {
      Alert.alert(
        'Registration Successful',
        'Please check your email to confirm your account',
        [
          { text: 'OK', onPress: () => router.replace('/login') }
        ]
      );
    } else {
      Alert.alert('Registration Error', error || 'An unknown error occurred');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our community</Text>
          
          <View style={styles.inputContainer}>
            <Input
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              autoCapitalize="none"
              icon={<User size={20} color={Colors.primary} />}
              style={styles.input}
            />
            
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
            
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              secureTextEntry
              icon={<Lock size={20} color={Colors.primary} />}
              style={styles.input}
            />
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <Text style={styles.termsText}>
              By registering, you agree to our Terms of Service and Privacy Policy
            </Text>
            
            <Button 
              title="Register" 
              onPress={handleRegister} 
              loading={isLoading}
              style={styles.button}
            />
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
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
  imageContainer: {
    height: 200,
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
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
  termsText: {
    fontSize: 12,
    color: Colors.text.dark,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
    color: Colors.text.dark,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});