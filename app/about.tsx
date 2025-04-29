import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  SafeAreaView
} from "react-native";
import { Mail, Globe, Heart } from "lucide-react-native";
import Colors from "@/constants/colors";
import { router } from "expo-router";

export default function AboutScreen() {
  const handleOpenLink = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=300&auto=format&fit=crop" }}
            style={styles.logo}
          />
          <Text style={styles.title}>SheSafe</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About SheSafe</Text>
          <Text style={styles.paragraph}>
            SheSafe is a personal safety app designed to help women feel safer by providing quick access to emergency services and trusted contacts.
          </Text>
          <Text style={styles.paragraph}>
            Our mission is to empower women with tools and resources to enhance their safety and security in everyday situations.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.featureText}>
              <Text style={styles.featureHighlight}>SOS Alert:</Text> Quickly send emergency alerts with your location to trusted contacts
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: Colors.secondary }]} />
            <Text style={styles.featureText}>
              <Text style={styles.featureHighlight}>Trusted Contacts:</Text> Add and manage emergency contacts who can help you in times of need
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: Colors.info }]} />
            <Text style={styles.featureText}>
              <Text style={styles.featureHighlight}>Safety Resources:</Text> Access safety tips and emergency helplines
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.featureText}>
              <Text style={styles.featureHighlight}>Evidence Collection:</Text> Capture and store evidence securely
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handleOpenLink("mailto:support@shesafe.com")}
          >
            <Mail size={20} color={Colors.primary} />
            <Text style={styles.contactText}>support@shesafe.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handleOpenLink("https://www.shesafe.com")}
          >
            <Globe size={20} color={Colors.primary} />
            <Text style={styles.contactText}>www.shesafe.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => router.push("/contact")}
          >
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with <Heart size={14} color={Colors.primary} fill={Colors.primary} /> for women's safety
          </Text>
          <Text style={styles.copyright}>
            © 2023 SheSafe. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  version: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  featureHighlight: {
    fontWeight: "600",
    color: Colors.text,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  contactText: {
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 12,
  },
  contactButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  contactButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  copyright: {
    fontSize: 12,
    color: Colors.textLight,
  }
});