import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle,
  Animated,
  Easing,
} from 'react-native';
import { useEmergencyStore } from '@/store/emergencyStore';
import Colors from '@/constants/colors';

interface SOSButtonProps {
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  onPress?: () => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({
  size = 'medium',
  style,
  onPress,
}) => {
  const { isSOSActive, activateSOS, deactivateSOS } = useEmergencyStore();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isSOSActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isSOSActive, pulseAnim]);

  const handlePress = () => {
    if (isSOSActive) {
      deactivateSOS();
    } else {
      activateSOS();
    }
    
    if (onPress) {
      onPress();
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { width: 50, height: 50 };
      case 'medium':
        return { width: 70, height: 70 };
      case 'large':
        return { width: 120, height: 120 };
      default:
        return { width: 70, height: 70 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return { fontSize: 12 };
      case 'medium':
        return { fontSize: 16 };
      case 'large':
        return { fontSize: 24 };
      default:
        return { fontSize: 16 };
    }
  };

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        { transform: [{ scale: pulseAnim }] },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          getSizeStyle(),
          isSOSActive ? styles.activeButton : {},
          style,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, getTextSize()]}>
          {isSOSActive ? 'SOS' : 'SOS'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  activeButton: {
    backgroundColor: Colors.sosRed,
  },
  text: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default SOSButton;