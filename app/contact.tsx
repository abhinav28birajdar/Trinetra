import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from "react-native";
import { Mail, MessageSquare, Send } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function ContactScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const validate = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      message: ""
    };
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }
    
    if (!message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = () => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
    }, 1500);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Contact Us</Text>
            <Text style={styles.subtitle}>
              Have questions or feedback? We'd love to hear from you.
            </Text>
          </View>
          
          {isSubmitted ? (
            <View style={styles.successContainer}>
              <Send size={48} color={Colors.primary} />
              <Text style={styles.successTitle}>Message Sent!</Text>
              <Text style={styles.successText}>
                Thank you for reaching out. We'll get back to you as soon as possible.
              </Text>
              <Button
                title="Send Another Message"
                variant="outline"
                onPress={() => setIsSubmitted(false)}
                style={styles.sendAnotherButton}
              />
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Input
                label="Your Name"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                error={errors.name}
                leftIcon={<User size={20} color={Colors.gray[500]} />}
              />
              
              <Input
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                leftIcon={<Mail size={20} color={Colors.gray[500]} />}
              />
              
              <View style={styles.messageContainer}>
                <Text style={styles.label}>Message</Text>
                <View style={[
                  styles.textAreaContainer,
                  errors.message ? styles.textAreaError : null
                ]}>
                  <MessageSquare 
                    size={20} 
                    color={Colors.gray[500]} 
                    style={styles.messageIcon} 
                  />
                  <Input
                    placeholder="Type your message here..."
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    containerStyle={styles.textAreaInput}
                  />
                </View>
                {errors.message ? (
                  <Text style={styles.errorText}>{errors.message}</Text>
                ) : null}
              </View>
              
              <Button
                title="Send Message"
                onPress={handleSubmit}
                loading={isSubmitting}
                style={styles.submitButton}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { User } from "lucide-react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
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
  messageContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 8,
  },
  textAreaContainer: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 12,
    padding: 12,
  },
  textAreaError: {
    borderColor: Colors.danger,
  },
  messageIcon: {
    marginTop: 4,
    marginRight: 8,
  },
  textAreaInput: {
    flex: 1,
    marginBottom: 0,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 8,
  },
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  sendAnotherButton: {
    width: "100%",
  }
});