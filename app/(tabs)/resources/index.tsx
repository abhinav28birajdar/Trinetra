import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView
} from "react-native";
import { router } from "expo-router";
import {
  Phone,
  Shield,
  Camera,
  Info,
  ChevronRight
} from "lucide-react-native";
import Colors from "@/constants/colors";

export default function ResourcesScreen() {
  const resources = [
    {
      id: "helplines",
      title: "Emergency Helplines",
      description: "Quick access to emergency numbers and helplines",
      icon: <Phone size={24} color={Colors.white} />,
      color: Colors.danger,
      route: "/helplines"
    },
    {
      id: "safety-tips",
      title: "Safety Tips",
      description: "Learn how to stay safe in different situations",
      icon: <Shield size={24} color={Colors.white} />,
      color: Colors.info,
      route: "/safety-tips"
    },
    {
      id: "evidence",
      title: "Evidence Collection",
      description: "Capture and store evidence securely",
      icon: <Camera size={24} color={Colors.white} />,
      color: Colors.secondary,
      route: "/evidence"
    },
    {
      id: "about",
      title: "About SheSafe",
      description: "Learn more about the app and its features",
      icon: <Info size={24} color={Colors.white} />,
      color: Colors.success,
      route: "/about"
    }
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=300&auto=format&fit=crop" }}
            style={styles.headerImage}
          />
          <Text style={styles.headerTitle}>Safety Resources</Text>
          <Text style={styles.headerSubtitle}>
            Access important safety information and tools
          </Text>
        </View>
        
        <View style={styles.resourcesContainer}>
          {resources.map(resource => (
            <TouchableOpacity
              key={resource.id}
              style={styles.resourceCard}
              onPress={() => router.push(resource.route)}
            >
              <View style={[styles.resourceIcon, { backgroundColor: resource.color }]}>
                {resource.icon}
              </View>
              
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
              </View>
              
              <ChevronRight size={20} color={Colors.gray[400]} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Need Support?</Text>
          <Text style={styles.supportText}>
            If you need immediate assistance, use the SOS button or contact emergency services.
          </Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => router.push("/contact")}
          >
            <Text style={styles.contactButtonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  resourcesContainer: {
    marginBottom: 24,
  },
  resourceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resourceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  supportSection: {
    backgroundColor: Colors.tertiary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  contactButtonText: {
    color: Colors.white,
    fontWeight: "600",
  }
});