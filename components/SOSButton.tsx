import React, { useState, useEffect } from "react";
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  Easing,
  Platform,
  View
} from "react-native";
import { AlertTriangle } from "lucide-react-native";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

interface SOSButtonProps {
  onPress: () => void;
  size?: "normal" | "large";
  label?: string;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ 
  onPress, 
  size = "normal",
  label = "SOS"
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const pulseAnim = new Animated.Value(1);
  
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.in(Easing.ease),
          useNativeDriver: Platform.OS !== "web",
        }),
      ])
    );
    
    pulse.start();
    
    return () => {
      pulse.stop();
    };
  }, []);
  
  const handlePress = () => {
    setIsPressed(true);
    
    // Trigger haptic feedback on supported platforms
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    // Call the onPress handler
    onPress();
    
    // Reset the pressed state after a delay
    setTimeout(() => {
      setIsPressed(false);
    }, 200);
  };
  
  const buttonSize = size === "large" ? styles.largeButton : styles.normalButton;
  const textSize = size === "large" ? styles.largeText : styles.normalText;
  
  return Platform.OS !== "web" ? (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          buttonSize,
          isPressed && styles.buttonPressed,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <AlertTriangle size={size === "large" ? 32 : 24} color={Colors.white} />
        <Text style={[styles.text, textSize]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  ) : (
    // Fallback for web without animation
    <View>
      <TouchableOpacity
        style={[
          styles.button,
          buttonSize,
          isPressed && styles.buttonPressed,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <AlertTriangle size={size === "large" ? 32 : 24} color={Colors.white} />
        <Text style={[styles.text, textSize]}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  normalButton: {
    width: 80,
    height: 80,
  },
  largeButton: {
    width: 120,
    height: 120,
  },
  buttonPressed: {
    backgroundColor: "#E03060", // Darker shade when pressed
    transform: [{ scale: 0.95 }],
  },
  text: {
    color: Colors.white,
    fontWeight: "bold",
    marginTop: 4,
  },
  normalText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 22,
  },
});