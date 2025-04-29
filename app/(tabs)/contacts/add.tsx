import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Switch,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/Colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useContactsStore } from '@/store/contacts-store';

const relationshipOptions = [
  'Mother', 'Father', 'Sister', 'Brother', 'Spouse', 
  'Friend', 'Relative', 'Colleague', 'Other'
];

export default function AddContactScreen() {
  const router = useRouter();
  const { addContact, isLoading, error, clearError } = useContactsStore();
  
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  
  const [fullNameError, setFullNameError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [relationshipError, setRelationshipError] = useState('');
  
  const validateInputs = () => {
    let isValid = true;
    
    // Reset errors
    setFullNameError('');
    setPhoneNumberError('');
    setRelationshipError('');
    clearError();
    
    // Validate full name
    if (!fullName.trim()) {
      setFullNameError('Full name is required');
      isValid = false;
    }
    
    // Validate phone number
    if (!phoneNumber.trim()) {
      setPhoneNumberError('Phone number is required');
      isValid = false;
    } else if (!/^\+?[0-9\s]{10,15}$/.test(phoneNumber.replace(/\s/g, ''))) {
      setPhoneNumberError('Please enter a valid phone number');
      isValid = false;
    }
    
    // Validate relationship
    if (!relationship.trim()) {
      setRelationshipError('Relationship is required');
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleSave = async () => {
    Keyboard.dismiss();
    if (validateInputs()) {
      try {
        await addContact({
          fullName,
          phoneNumber,
          relationship,
          isPrimary
        });
        
        router.back();
      } catch (error) {
        console.error('Failed to add contact:', error);
      }
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
            <Text style={styles.title}>Add Trusted Contact</Text>
            <Text style={styles.subtitle}>
              Add someone you trust who can be contacted in an emergency.
            </Text>
          </View>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter contact's full name"
            autoCapitalize="words"
            error={fullNameError}
            style={styles.input}
            returnKeyType="next"
          />
          
          <Input
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter contact's phone number"
            keyboardType="phone-pad"
            error={phoneNumberError}
            style={styles.input}
            returnKeyType="next"
          />
          
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Relationship</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relationshipOptions}
              keyboardShouldPersistTaps="handled"
            >
              {relationshipOptions.map((option) => (
                <Button
                  key={option}
                  title={option}
                  variant={relationship === option ? 'primary' : 'outline'}
                  size="small"
                  onPress={() => setRelationship(option)}
                  style={styles.relationshipButton}
                />
              ))}
            </ScrollView>
            {relationshipError && (
              <Text style={styles.errorText}>{relationshipError}</Text>
            )}
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Set as Primary Contact</Text>
            <Switch
              value={isPrimary}
              onValueChange={setIsPrimary}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          <Text style={styles.switchDescription}>
            Primary contacts are called first during emergencies.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Save Contact"
              onPress={handleSave}
              isLoading={isLoading}
              fullWidth
            />
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
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
  },
  input: {
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.textDark,
  },
  relationshipOptions: {
    paddingVertical: 8,
    flexWrap: 'wrap',
  },
  relationshipButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textDark,
  },
  switchDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 16,
  },
});