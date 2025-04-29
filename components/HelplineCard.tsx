import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from "react-native";
import { Phone } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Helpline } from "@/constants/helplines";

interface HelplineCardProps {
  helpline: Helpline;
}

export const HelplineCard: React.FC<HelplineCardProps> = ({ helpline }) => {
  const handleCall = async () => {
    if (Platform.OS === "web") {
      alert(`In a real app, this would call ${helpline.number}`);
      return;
    }
    
    const url = `tel:${helpline.number}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      alert(`Unable to call ${helpline.number}`);
    }
  };
  
  const getCategoryColor = () => {
    switch (helpline.category) {
      case "emergency":
        return Colors.danger;
      case "women":
        return Colors.primary;
      case "health":
        return Colors.success;
      default:
        return Colors.info;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor() }]} />
      
      <View style={styles.content}>
        <Text style={styles.name}>{helpline.name}</Text>
        <Text style={styles.description}>{helpline.description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.categoryContainer}>
            <Text style={[styles.categoryText, { color: getCategoryColor() }]}>
              {helpline.category}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.callButton, { backgroundColor: getCategoryColor() }]}
            onPress={handleCall}
          >
            <Phone size={16} color={Colors.white} />
            <Text style={styles.callButtonText}>{helpline.number}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIndicator: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray[100],
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  }
});