import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  SafeAreaView
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { User, Phone, Heart } from "lucide-react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useContactsStore } from "@/store/contacts-store";
import Colors from "@/constants/colors";

const relationshipOptions = [
  "Family",
  "Friend",
  "Spouse",
  "Colleague",
  "Neighbor",
  "Other"
];

export default function AddContactScreen() {
  const params = useLocalSearchParams();
  const contactId = params.id as string;
  const isEditing = !!contactId;
  
  const { contacts, addContact, updateContact, getContactById } = useContactsStore();
  
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isTrusted, setIsTrusted] = useState(false);
  
  const [errors, setErrors] = useState({
    name: "",
    phoneNumber: "",
    relationship: ""
  });
  
  // Load contact data if editing
  useEffect(() => {
    if (isEditing) {
      const contact = getContactById(contactId);
      if (contact) {
        setName(contact.name);
        setPhoneNumber(contact.phoneNumber);
        setRelationship(contact.relationship);
        setIsTrusted(contact.isTrusted);
      }
    }
  }, [contactId, isEditing]);
  
  const validate = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      phoneNumber: "",
      relationship: ""
    };
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    }
    
    if (!relationship) {
      newErrors.relationship = "Relationship is required";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSave = () => {
    if (!validate()) return;
    
    if (isEditing) {
      updateContact(contactId, {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        relationship,
        isTrusted
      });
    } else {
      addContact({
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
          relationship,
          isTrusted,
          isFavorite: false
      });
    }
    
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: isEditing ? "Edit Contact" : "Add Contact",
          headerShown: true,
        }} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Input
            label="Full Name"
            placeholder="Enter contact name"
            value={name}
            onChangeText={setName}
            error={errors.name}
            leftIcon={<User size={20} color={Colors.gray[500]} />}
          />
          
          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            error={errors.phoneNumber}
            leftIcon={<Phone size={20} color={Colors.gray[500]} />}
          />
          
          <Text style={styles.label}>Relationship</Text>
          <View style={styles.relationshipContainer}>
            {relationshipOptions.map(option => (
              <Button
                key={option}
                title={option}
                variant={relationship === option ? "primary" : "outline"}
                size="small"
                onPress={() => setRelationship(option)}
                style={styles.relationshipButton}
              />
            ))}
          </View>
          {errors.relationship ? (
            <Text style={styles.errorText}>{errors.relationship}</Text>
          ) : null}
          
          <View style={styles.trustedContainer}>
            <View style={styles.trustedTextContainer}>
              <Heart 
                size={20} 
                color={isTrusted ? Colors.primary : Colors.gray[400]} 
                fill={isTrusted ? Colors.primary : "transparent"} 
              />
              <View>
                <Text style={styles.trustedLabel}>Trusted Contact</Text>
                <Text style={styles.trustedDescription}>
                  Trusted contacts will be notified in emergencies and shown on your home screen
                </Text>
              </View>
            </View>
            <Switch
              value={isTrusted}
              onValueChange={setIsTrusted}
              trackColor={{ false: Colors.gray[300], true: Colors.primary + "80" }}
              thumbColor={isTrusted ? Colors.primary : Colors.white}
            />
          </View>
          
          <Button
            title={isEditing ? "Save Changes" : "Add Contact"}
            onPress={handleSave}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 8,
  },
  relationshipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  relationshipButton: {
    marginBottom: 8,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginTop: -8,
    marginBottom: 16,
  },
  trustedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  trustedTextContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: 12,
  },
  trustedLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  trustedDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  saveButton: {
    marginTop: 8,
  }
});