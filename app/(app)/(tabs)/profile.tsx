import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useContactsStore } from '@/store/contactsStore';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuthStore();
  const { contacts, fetchContacts } = useContactsStore();
  
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [age, setAge] = useState(user?.age || '');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '');
  const [isEditing, setIsEditing] = useState(false);
  
  React.useEffect(() => {
    fetchContacts();
  }, []);
  
  const handleSave = async () => {
    await updateProfile({
      username,
      phone,
      age,
      bloodGroup,
    });
    
    setIsEditing(false);
  };
  
  const navigateToSettings = () => {
    router.push('/settings');
  };
  
  const navigateToContacts = () => {
    router.push('/contacts');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
          style={styles.avatar}
        />
        <Text style={styles.username}>User..</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={navigateToSettings}
        >
          <Settings size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80' }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>User</Text>
        </View>
        
        <View style={styles.form}>
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            editable={isEditing}
          />
          
          <Input
            label="Email address"
            value={email}
            onChangeText={setEmail}
            editable={false}
            keyboardType="email-address"
          />
          
          <View style={styles.phoneContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <Input
              containerStyle={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.rowContainer}>
            <View style={styles.halfInput}>
              <Input
                label="Age"
                value={age}
                onChangeText={setAge}
                editable={isEditing}
                keyboardType="number-pad"
              />
            </View>
            
            <View style={styles.halfInput}>
              <Input
                label="Blood G."
                value={bloodGroup}
                onChangeText={setBloodGroup}
                editable={isEditing}
              />
            </View>
          </View>
          
          {isEditing ? (
            <Button
              title="Save"
              onPress={handleSave}
              isLoading={isLoading}
              style={styles.saveButton}
              variant="primary"
            />
          ) : (
            <Button
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
              style={styles.editButton}
              variant="outline"
            />
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.contactsButton}
          onPress={navigateToContacts}
        >
          <Text style={styles.contactsButtonText}>View Contacts</Text>
        </TouchableOpacity>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginLeft: 12,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: Colors.text,
  },
  form: {
    paddingHorizontal: 16,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  countryCode: {
    height: 50,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    color: Colors.text,
  },
  phoneInput: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  saveButton: {
    backgroundColor: Colors.success,
    marginTop: 16,
  },
  editButton: {
    marginTop: 16,
  },
  contactsButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactsButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});