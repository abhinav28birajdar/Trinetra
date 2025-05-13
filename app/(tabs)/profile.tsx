import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useColors } from '@/constants/colors';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { User, Mail, Phone, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const Colors = useColors();
  const { user, updateUser, isLoading } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [age, setAge] = useState(user?.age || '');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '');
  
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showBloodGroupModal, setShowBloodGroupModal] = useState(false);
  
  const ageOptions = ['18-25', '26-35', '36-45', '46-55', '56+'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const handleSave = async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    await updateUser({
      username,
      email,
      phone,
      age,
      bloodGroup,
    });
  };

  const selectAge = (selectedAge: string) => {
    setAge(selectedAge);
    setShowAgeModal(false);
  };

  const selectBloodGroup = (selectedBloodGroup: string) => {
    setBloodGroup(selectedBloodGroup);
    setShowBloodGroupModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.primary }]}>
      <View style={styles.header}>
        <Header showSettingsButton isDarkMode={isDarkMode} />
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' }}
            style={styles.profileImage}
          />
        </View>
        
        <Text style={[styles.title, { color: Colors.text.light }]}>User</Text>
        
        <View style={[styles.formContainer, { backgroundColor: Colors.background.primary }]}>
          <Input
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            icon={<User size={20} color={Colors.primary} />}
            isDarkMode={isDarkMode}
          />
          
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            keyboardType="email-address"
            icon={<Mail size={20} color={Colors.primary} />}
            isDarkMode={isDarkMode}
          />
          
          <View style={styles.phoneContainer}>
            <View style={[styles.countryCode, { backgroundColor: isDarkMode ? Colors.background.secondary : '#F5F5F5' }]}>
              <Text style={[styles.countryCodeText, { color: Colors.text.dark }]}>+91</Text>
            </View>
            <Input
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              keyboardType="phone-pad"
              style={styles.phoneInput}
              isDarkMode={isDarkMode}
            />
          </View>
          
          <View style={styles.rowContainer}>
            <TouchableOpacity 
              style={[
                styles.smallInput, 
                { 
                  borderColor: Colors.primary,
                  backgroundColor: isDarkMode ? Colors.background.secondary : '#F5F5F5'
                }
              ]}
              onPress={() => setShowAgeModal(true)}
            >
              <Text style={[styles.smallInputLabel, { color: Colors.primary }]}>
                {age || 'Age'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.smallInput, 
                { 
                  borderColor: Colors.primary,
                  backgroundColor: isDarkMode ? Colors.background.secondary : '#F5F5F5'
                }
              ]}
              onPress={() => setShowBloodGroupModal(true)}
            >
              <Text style={[styles.smallInputLabel, { color: Colors.primary }]}>
                {bloodGroup || 'Blood G.'}
              </Text>
            </TouchableOpacity>
            
            <Button
              title="Save"
              onPress={handleSave}
              loading={isLoading}
              style={styles.saveButton}
              variant="secondary"
              isDarkMode={isDarkMode}
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Age Selection Modal */}
      <Modal
        visible={showAgeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAgeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: Colors.background.primary }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: Colors.text.dark }]}>Select Age Group</Text>
              <TouchableOpacity onPress={() => setShowAgeModal(false)}>
                <X size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            
            {ageOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionItem,
                  { borderBottomColor: Colors.border }
                ]}
                onPress={() => selectAge(option)}
              >
                <Text style={[styles.optionText, { color: Colors.text.dark }]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
      
      {/* Blood Group Selection Modal */}
      <Modal
        visible={showBloodGroupModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBloodGroupModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: Colors.background.primary }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: Colors.text.dark }]}>Select Blood Group</Text>
              <TouchableOpacity onPress={() => setShowBloodGroupModal(false)}>
                <X size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.bloodGroupGrid}>
              {bloodGroupOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.bloodGroupItem,
                    { 
                      backgroundColor: option === bloodGroup 
                        ? Colors.primary 
                        : isDarkMode ? Colors.background.secondary : '#F5F5F5'
                    }
                  ]}
                  onPress={() => selectBloodGroup(option)}
                >
                  <Text 
                    style={[
                      styles.bloodGroupText, 
                      { 
                        color: option === bloodGroup 
                          ? Colors.text.light 
                          : Colors.primary 
                      }
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  countryCode: {
    width: 60,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    width: '30%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  smallInputLabel: {
    fontSize: 16,
  },
  saveButton: {
    width: '30%',
    height: 50,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
  bloodGroupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bloodGroupItem: {
    width: '48%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  bloodGroupText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});