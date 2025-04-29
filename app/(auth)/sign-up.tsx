import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView
} from "react-native";
import { router } from "expo-router";
import { User, Mail, Lock, Phone } from "lucide-react-native";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuthStore } from "@/store/auth-store";
import Colors from "@/constants/colors";

export default function SignUpScreen() {
  const { signUp, error, isLoading, resetError } = useAuthStore();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: ""
    };
    
    // Name validation
    if (!name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }
    
    // Email validation
    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email";
      isValid = false;
    }
    
    // Phone validation
    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
      isValid = false;
    }
    
    // Password validation
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };
  
  const handleSignUp = async () => {
    resetError();
    
    if (validateForm()) {
      await signUp(name, email, password, phoneNumber);
    }
  };
  
  const handleSignIn = () => {
    router.push("/sign-in");
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join SheSafe for your personal safety</Text>
          </View>
          
          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              error={validationErrors.name}
              leftIcon={<User size={20} color={Colors.gray[500]} />}
            />
            
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={validationErrors.email}
              leftIcon={<Mail size={20} color={Colors.gray[500]} />}
            />
            
            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              error={validationErrors.phoneNumber}
              leftIcon={<Phone size={20} color={Colors.gray[500]} />}
            />
            
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              isPassword
              error={validationErrors.password}
              leftIcon={<Lock size={20} color={Colors.gray[500]} />}
            />
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              error={validationErrors.confirmPassword}
              leftIcon={<Lock size={20} color={Colors.gray[500]} />}
            />
            
            <Button
              title="Sign Up"
              onPress={handleSignUp}
              loading={isLoading}
              style={styles.signUpButton}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  formContainer: {
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: Colors.danger + "20", // 20% opacity
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
  },
  signUpButton: {
    marginTop: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  footerText: {
    color: Colors.textSecondary,
    marginRight: 4,
  },
  signInText: {
    color: Colors.primary,
    fontWeight: "bold",
  }
});