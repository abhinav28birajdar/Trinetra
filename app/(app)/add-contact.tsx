import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Switch,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useContactsStore } from '@/store/contactsStore';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function AddContactScreen() {
  const router = useRouter();
  const { addContact, isLoading, error } = useContactsStore();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isEmergency, setIsEmergency] = useState(true);
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleAddContact = async () => {
    if (!name || !phone) {
      return;
    }
    
    await addContact({
      name,
      phone,
      relationship,
      isEmergency,
    });
    
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <ArrowLeft size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Contact</Text>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Contact name"
          />
          
          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            keyboardType="phone-pad"
          />
          
          <Input
            label="Relationship"
            value={relationship}
            onChangeText={setRelationship}
            placeholder="e.g. Father, Mother, Friend"
          />
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Emergency Contact</Text>
            <Switch
              value={isEmergency}
              onValueChange={setIsEmergency}
              trackColor={{ false: Colors.gray, true: Colors.primaryLight }}
              thumbColor={isEmergency ? Colors.primary : Colors.white}
            />
          </View>
          
          <Button
            title="Add Contact"
            onPress={handleAddContact}
            isLoading={isLoading}
            style={styles.addButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.error,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  addButton: {
    marginTop: 20,
  },
});