import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert // Import Alert for better feedback
} from 'react-native';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react-native';
import { useUserStore } from '@/store/user-store';
import { useContactsStore } from '@/store/contacts-store';
import Colors from '@/constants/colors'; // Now imports the updated colors
import { router, Href } from 'expo-router';

export default function AccountScreen() {
  const { user, logout } = useUserStore();
  const { contacts } = useContactsStore();

  const handleLogout = () => {
    logout();
    Alert.alert("Logged Out", "You have been successfully logged out.", [
        // Assuming you have a login route defined
        { text: "OK", onPress: () => router.replace('/login' as Href) }
    ]);
    // Alternatively, navigate home if no dedicated login screen
    // router.replace('/');
  };

  // Function to safely navigate, ensuring Href type
  const navigateTo = (path: Href) => {
      router.push(path);
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>User data not available.</Text>
        <TouchableOpacity onPress={() => router.replace('/login' as Href)} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        {user.profileImage ? (
          <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileInitial}>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</Text>
          </View>
        )}
        <Text style={styles.profileName}>{user.name || 'User Name'}</Text>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigateTo('./edit-profile')}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Personal Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoCard}>
          {/* Full Name */}
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              {/* Removed fallback */}
              <User size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{user.name || 'N/A'}</Text>
            </View>
          </View>

          {/* Email */}
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              {/* Removed fallback */}
              <Mail size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email || 'N/A'}</Text>
            </View>
          </View>

          {/* Phone Number */}
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              {/* Removed fallback */}
              <Phone size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{user.phoneNumber || 'N/A'}</Text>
            </View>
          </View>

          {/* Address (Conditional) */}
          {user.address && (
            <View style={[styles.infoItem, styles.lastInfoItem]}>
              <View style={styles.infoIcon}>
                {/* Removed fallback */}
                <MapPin size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{user.address}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Emergency Contacts Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo('/contacts')}
        >
          <View style={styles.menuIcon}>
            {/* Removed fallback */}
            <Users size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Manage Contacts</Text>
            <Text style={styles.menuValue}>
              You have {contacts?.length ?? 0} emergency contacts
            </Text>
          </View>
           {/* Removed fallback */}
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>
      </View>

      {/* App Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo('/settings')}
        >
          <View style={styles.menuIcon}>
             {/* Removed fallback */}
            <Settings size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>App Settings</Text>
            <Text style={styles.menuValue}>
              Notifications, sounds, language
            </Text>
          </View>
           {/* Removed fallback */}
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
         {/* Removed fallback */}
        <LogOut size={20} color={Colors.danger} />
        {/* Removed fallback */}
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// --- Styles ---
// References to Colors should now work without fallbacks if the key exists
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[100], // Use defined gray
  },
  contentContainer: {
    paddingBottom: 40,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 16,
    backgroundColor: Colors.white, // Use defined white
    borderRadius: 12,
    shadowColor: Colors.black, // Use defined black
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.primary, // Use defined primary
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary, // Use defined primary
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.white, // Use defined white
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text, // Use defined text
    marginBottom: 8,
  },
  editProfileButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: Colors.gray[200], // Use defined gray
    borderRadius: 16,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary, // Use defined primary
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text, // Use defined text
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  infoCard: {
    backgroundColor: Colors.white, // Use defined white
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: Colors.black, // Use defined black
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100], // Use defined gray
    alignItems: 'center',
  },
  lastInfoItem: {
      borderBottomWidth: 0,
      paddingBottom: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    // Primary color with 10% opacity (1A in hex)
    backgroundColor: Colors.primary + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.subtext, // Use defined subtext
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text, // Use defined text
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white, // Use defined white
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black, // Use defined black
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // Primary color with 10% opacity (1A in hex)
    backgroundColor: Colors.primary + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text, // Use defined text
    marginBottom: 4,
  },
  menuValue: {
    fontSize: 14,
    color: Colors.subtext, // Use defined subtext
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white, // Use defined white
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
     // Shadow with danger color hint (20% opacity = 33 in hex)
    shadowColor: Colors.danger + '33',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.danger, // Use defined danger
  },
  errorText: {
    fontSize: 16,
    color: Colors.danger, // Use defined danger
    textAlign: 'center',
    marginTop: 24,
  },
  loginButton: {
      marginTop: 16,
      backgroundColor: Colors.primary, // Use defined primary
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
  },
  loginButtonText: {
      color: Colors.white, // Use defined white
      fontWeight: '600',
      fontSize: 16,
  }
});