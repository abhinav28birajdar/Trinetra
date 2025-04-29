import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  TouchableOpacity,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Shield, 
  MapPin, 
  Bell, 
  Phone, 
  Users, 
  Mail,
  Globe
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';

export default function AboutScreen() {
  const router = useRouter();
  
  const handleContactPress = () => {
    router.push('./contact');
  };
  
  const handleEmailPress = async () => {
    try {
      await Linking.openURL('mailto:support@shesafe.app');
    } catch (error) {
      console.error('Failed to open email:', error);
    }
  };
  
  const handleWebsitePress = async () => {
    try {
      await Linking.openURL('https://www.shesafe.app');
    } catch (error) {
      console.error('Failed to open website:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80' }}
            style={styles.logo}
          />
          <Text style={styles.appName}>SheSafe</Text>
          <Text style={styles.tagline}>Your safety, one tap away.</Text>
        </View>
        
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>
            SheSafe is a personal safety app made to empower women by offering real-time protection and fast emergency support. Whether walking home at night, traveling, or working late—SheSafe helps you stay connected and safe with just one tap.
          </Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Bell size={24} color={colors.danger} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>SOS Alert</Text>
              <Text style={styles.featureDescription}>
                One-tap emergency alert that notifies your trusted contacts with your location.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <MapPin size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Live Location Tracking</Text>
              <Text style={styles.featureDescription}>
                Real-time location sharing with trusted contacts during emergencies.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Users size={24} color={colors.secondary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Trusted Contacts</Text>
              <Text style={styles.featureDescription}>
                Add and manage emergency contacts who will be alerted in case of danger.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Phone size={24} color={colors.info} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Emergency Helplines</Text>
              <Text style={styles.featureDescription}>
                Quick access to important emergency numbers.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Shield size={24} color={colors.success} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Safety Tips</Text>
              <Text style={styles.featureDescription}>
                Daily safety advice to help you stay aware and protected.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={handleEmailPress}
          >
            <Mail size={20} color={colors.primary} />
            <Text style={styles.contactText}>support@shesafe.app</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={handleWebsitePress}
          >
            <Globe size={20} color={colors.primary} />
            <Text style={styles.contactText}>www.shesafe.app</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={handleContactPress}
          >
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 12,
  },
  tagline: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 4,
  },
  aboutContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  aboutText: {
    fontSize: 16,
    color: colors.textDark,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  contactContainer: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: 12,
  },
  contactButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  contactButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textLight,
  },
});