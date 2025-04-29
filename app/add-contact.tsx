import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Button } from '@/components/Button';
import { useContactsStore } from '@/store/contacts-store';
import Colors from '@/constants/colors';
import { Check } from 'lucide-react-native';

const relationshipOptions = [
  'Family',
  'Friend',
  'Spouse',
  'Partner',
  'Colleague',
  'Neighbor',
  'Other'
];

export default function AddContactScreen() {
  const { addContact } = useContactsStore();
  
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relationship, setRelationship] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    phoneNumber: '',
    relationship: '',
  });
  
  const validate = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      phoneNumber: '',
      relationship: '',
    };
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    }
    
    if (!relationship) {
      newErrors.relationship = 'Relationship is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSave = () => {
    if (!validate()) return;
    
    addContact({
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      relationship,
      isFavorite: false,
    });
    
    router.back();
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen 
        options={{
          title: 'Add Trusted Contact',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            placeholder="Enter full name"
            value={name}
            onChangeText={setName}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.phoneNumber ? styles.inputError : null]}
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Relationship</Text>
          <View style={styles.relationshipOptions}>
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
          </View>
          {errors.relationship ? <Text style={styles.errorText}>{errors.relationship}</Text> : null}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Save Contact"
          leftIcon={<Check size={20} color={Colors.white} />}
          onPress={handleSave}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginTop: 4,
  },
  relationshipOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relationshipButton: {
    marginBottom: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
});