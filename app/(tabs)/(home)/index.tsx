import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  SafeAreaView
} from "react-native";
import { router } from "expo-router";
import {
  Phone,
  Ambulance,
  MapPin,
  Shield,
  Bell,
  ChevronRight,
  Info
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useAuthStore } from "@/store/auth-store";
import { useContactsStore } from "@/store/contacts-store";
import { SafetyTipCard } from "@/components/SafetyTipCard";
import { Button } from "@/components/Button";
import { safetyTips } from "@/constants/safety-tips";
import * as Location from "expo-location";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { contacts, getTrustedContacts } = useContactsStore();
  const [currentTip, setCurrentTip] = useState(safetyTips[0]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  
  const trustedContacts = getTrustedContacts();
  
  useEffect(() => {
    // Get a random safety tip
    const randomIndex = Math.floor(Math.random() * safetyTips.length);
    setCurrentTip(safetyTips[randomIndex]);
    
    // Request location permissions
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();
  }, []);
  
  const handleNextTip = () => {
    const currentIndex = safetyTips.findIndex(tip => tip.id === currentTip.id);
    const nextIndex = (currentIndex + 1) % safetyTips.length;
    setCurrentTip(safetyTips[nextIndex]);
  };
  
  const handleCallEmergency = async (number: string) => {
    if (Platform.OS === "web") {
      alert(`In a real app, this would call ${number}`);
      return;
    }
    
    const url = `tel:${number}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      alert(`Unable to call ${number}`);
    }
  };
  
  const handleShareLocation = async () => {
    try {
      if (!location) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== "granted") {
          alert("Permission to access location was denied");
          return;
        }
        
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
      
      if (location) {
        const { latitude, longitude } = location.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        if (Platform.OS === "web") {
          alert(`In a real app, this would share your location: ${mapsUrl}`);
        } else {
          await Linking.openURL(`sms:?body=Here is my current location: ${mapsUrl}`);
        }
      }
    } catch (error) {
      console.error("Error sharing location:", error);
      alert("Failed to share location");
    }
  };
  
  const handleCallContact = async (phoneNumber: string) => {
    if (Platform.OS === "web") {
      alert(`In a real app, this would call ${phoneNumber}`);
      return;
    }
    
    const url = `tel:${phoneNumber}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      alert(`Unable to call ${phoneNumber}`);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.name?.split(" ")[0] || "User"} 👋
            </Text>
            <Text style={styles.subGreeting}>Your safety, one tap away</Text>
          </View>
          
          {user?.profileImage ? (
            <Image 
              source={{ uri: user.profileImage }} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitial}>
                {user?.name?.charAt(0) || "U"}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.emergencyActions}>
          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: Colors.danger }]}
            onPress={() => handleCallEmergency("100")}
          >
            <Phone size={24} color={Colors.white} />
            <Text style={styles.emergencyButtonText}>Police</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: Colors.success }]}
            onPress={() => handleCallEmergency("102")}
          >
            <Ambulance size={24} color={Colors.white} />
            <Text style={styles.emergencyButtonText}>Ambulance</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: Colors.info }]}
            onPress={handleShareLocation}
          >
            <MapPin size={24} color={Colors.white} />
            <Text style={styles.emergencyButtonText}>Share Location</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trusted Contacts</Text>
            <TouchableOpacity onPress={() => router.push("/contacts")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {trustedContacts.length > 0 ? (
            <View style={styles.contactsList}>
              {trustedContacts.slice(0, 3).map(contact => (
                <TouchableOpacity
                  key={contact.id}
                  style={styles.contactItem}
                  onPress={() => handleCallContact(contact.phoneNumber)}
                >
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactInitial}>{contact.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactRelation}>{contact.relationship}</Text>
                  </View>
                  <View style={styles.callButton}>
                    <Phone size={18} color={Colors.primary} />
                  </View>
                </TouchableOpacity>
              ))}
              
              {trustedContacts.length < 3 && (
                <Button
                  title="Add Trusted Contact"
                  variant="outline"
                  onPress={() => router.push("/contacts/add")}
                  style={styles.addContactButton}
                />
              )}
            </View>
          ) : (
            <View style={styles.emptyContacts}>
              <Text style={styles.emptyText}>
                No trusted contacts added yet. Add contacts to quickly reach them in emergencies.
              </Text>
              <Button
                title="Add Trusted Contact"
                variant="outline"
                onPress={() => router.push("/contacts/add")}
                style={styles.addContactButton}
              />
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Safety Tip</Text>
            <TouchableOpacity onPress={() => router.push("/safety-tips")}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <SafetyTipCard tip={currentTip} onNext={handleNextTip} />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity 
              style={styles.quickAccessItem}
              onPress={() => router.push("/helplines")}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: Colors.danger + "20" }]}>
                <Phone size={24} color={Colors.danger} />
              </View>
              <Text style={styles.quickAccessText}>Helplines</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAccessItem}
              onPress={() => router.push("/safety-tips")}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: Colors.info + "20" }]}>
                <Shield size={24} color={Colors.info} />
              </View>
              <Text style={styles.quickAccessText}>Safety Tips</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAccessItem}
              onPress={() => router.push("/evidence")}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: Colors.secondary + "20" }]}>
                <Bell size={24} color={Colors.secondary} />
              </View>
              <Text style={styles.quickAccessText}>Evidence</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAccessItem}
              onPress={() => router.push("/about")}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: Colors.success + "20" }]}>
                <Info size={24} color={Colors.success} />
              </View>
              <Text style={styles.quickAccessText}>About</Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
  },
  emergencyActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  emergencyButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emergencyButtonText: {
    color: Colors.white,
    fontWeight: "600",
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  seeAllText: {
    color: Colors.primary,
    fontWeight: "500",
  },
  contactsList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.tertiary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactInitial: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray[100],
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContacts: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  addContactButton: {
    marginTop: 8,
  },
  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },
  quickAccessItem: {
    width: "48%",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickAccessIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickAccessText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  }
});