import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  ChevronRight, 
  Camera 
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/Colors';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { useContactsStore } from '@/store/contacts-store';

// Define proper types for the contact
interface Contact {
  id: string;
  fullName: string;
  relationship: string;
  isPrimary: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const { contacts } = useContactsStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEditProfile = () => {
    // In a real app, this would navigate to an edit profile screen
    Alert.alert(
      'Edit Profile',
      'This feature would allow you to edit your profile details.',
      [{ text: 'OK' }]
    );
  };
  
  const handleManageContacts = () => {
    router.push('/contacts');
  };
  
  const handlePickImage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Image picking is not available on web');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to change your profile picture.');
        setIsLoading(false);
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Update profile with new image
        await updateProfile({ profilePicture: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
        </View>
        
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ 
                uri: user.profilePicture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={handlePickImage}
              disabled={isLoading}
            >
              <Camera size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{user.fullName}</Text>
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Mail size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Phone size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user.phoneNumber}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <MapPin size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Home Address</Text>
              <Text style={styles.infoValue}>
                {user.homeAddress || 'Not set'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.contactsContainer}
            onPress={handleManageContacts}
          >
            <View style={styles.contactsHeader}>
              <View style={styles.infoIconContainer}>
                <Users size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Emergency Contacts</Text>
                <Text style={styles.infoValue}>
                  {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'} added
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </View>
            
            {contacts.length > 0 && (
              <View style={styles.contactsList}>
                {(contacts as Contact[]).slice(0, 3).map((contact) => (
                  <View key={contact.id} style={styles.contactItem}>
                    <View style={styles.contactInitial}>
                      <Text style={styles.initialText}>
                        {contact.fullName && typeof contact.fullName === 'string' 
                          ? contact.fullName.charAt(0) 
                          : '?'}
                      </Text>
                    </View>
                    <View style={styles.contactDetails}>
                      <Text style={styles.contactName}>{contact.fullName}</Text>
                      <Text style={styles.contactRelation}>{contact.relationship}</Text>
                    </View>
                    {contact.isPrimary && (
                      <View style={styles.primaryBadge}>
                        <Text style={styles.primaryText}>Primary</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Edit Profile"
            onPress={handleEditProfile}
            variant="outline"
            fullWidth
            style={styles.actionButton}
          />
          
          <Button
            title="Manage Emergency Contacts"
            onPress={handleManageContacts}
            fullWidth
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
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
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  infoSection: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 139, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '500',
  },
  contactsContainer: {
    marginTop: 12,
  },
  contactsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactsList: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactInitial: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textDark,
  },
  contactRelation: {
    fontSize: 12,
    color: colors.textLight,
  },
  primaryBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  primaryText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '500',
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionButton: {
    marginBottom: 12,
  },
});