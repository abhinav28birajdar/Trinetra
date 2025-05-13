import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Colors from '@/constants/colors';
import { User, Mail, Lock } from 'lucide-react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const handleRegister = async () => {
    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      setValidationError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    setValidationError('');
    await register(username, email, password);
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
          <Text style={styles.title}>Register</Text>
          <Text style={styles.subtitle}>Create your account</Text>
          
          <View style={styles.inputContainer}>
            <Input
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              icon={<User size={20} color={Colors.primary} />}
              style={styles.input}
            />
            
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              keyboardType="email-address"
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
              placeholder="Confirm password"
              secureTextEntry
              icon={<Lock size={20} color={Colors.primary} />}
              style={styles.input}
            />
            
            {(validationError || error) && (
              <Text style={styles.errorText}>{validationError || error}</Text>
            )}
            
            <Text style={styles.termsText}>
              By registering, you are agreeing to our Terms of use and Privacy Policy
            </Text>
            
            <Button 
              title="REGISTER" 
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