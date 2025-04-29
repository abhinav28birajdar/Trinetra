import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import Colors from "@/constants/colors";
import { SafetyTip } from "@/constants/safety-tips";

interface SafetyTipCardProps {
  tip: SafetyTip;
  onNext?: () => void;
  showControls?: boolean;
}

export const SafetyTipCard: React.FC<SafetyTipCardProps> = ({ 
  tip, 
  onNext,
  showControls = true
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Safety Tip</Text>
        {showControls && onNext && (
          <TouchableOpacity onPress={onNext} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next Tip</Text>
            <ChevronRight size={18} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Text style={styles.tipContent}>{tip.content}</Text>
        
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{tip.category}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.tertiary,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 4,
  },
  content: {
    padding: 16,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  tipContent: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  categoryContainer: {
    alignSelf: "flex-start",
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: "capitalize",
  }
});