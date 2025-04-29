import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Phone, MessageSquare } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  
  const validateInputs = () => {
    let isValid = true;
    
    // Reset errors
    setNameError('');
    setEmailError('');
    setMessageError('');
    
    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    // Validate message
    if (!message.trim()) {
      setMessageError('Message is required');
      isValid = false;
    } else if (message.trim().length < 10) {
      setMessageError('Message is too short');
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleSubmit = () => {
    Keyboard.dismiss();
    if (validateInputs()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          'Message Sent',
          'Thank you for contacting us. We will get back to you soon.',
          [
            { 
              text: 'OK', 
              onPress: () => {
                // Clear form
                setName('');
                setEmail('');
                setMessage('');
              }
            }
          ]
        );
      }, 1500);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 40}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Contact Support</Text>
            <Text style={styles.subtitle}>
              If you have any feedback, queries, or support requests, contact us.
            </Text>
          </View>
          
          <View style={styles.contactInfoContainer}>
            <View style={styles.contactInfoItem}>
              <Mail size={20} color={colors.primary} />
              <Text style={styles.contactInfoText}>support@shesafe.app</Text>
            </View>
            
            <View style={styles.contactInfoItem}>
              <Phone size={20} color={colors.primary} />
              <Text style={styles.contactInfoText}>+91-XXXXXXXXXX</Text>
            </View>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Send us a message</Text>
            
            <Input
              label="Your Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              autoCapitalize="words"
              error={nameError}
              style={styles.input}
              returnKeyType="next"
            />
            
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
              style={styles.input}
              returnKeyType="next"
            />
            
            <Input
              label="Message"
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message here..."
              multiline
              numberOfLines={5}
              error={messageError}
              style={styles.input}
              inputStyle={styles.messageInput}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            
            <Button
              title="Send Message"
              onPress={handleSubmit}
              isLoading={isLoading}
              style={styles.submitButton}
              fullWidth
            />
          </View>
          
          <View style={styles.responseContainer}>
            <MessageSquare size={20} color={colors.primary} />
            <Text style={styles.responseText}>
              We typically respond within 24 hours.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  contactInfoContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactInfoText: {
    fontSize: 16,
    color: colors.textDark,
    marginLeft: 12,
  },
  formContainer: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 8,
  },
  responseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  responseText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
  },
});