import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  Easing,
  View,
  Platform
} from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { colors } from '@/constants/Colors';

interface SOSButtonProps {
  onPress: () => void;
  isActive?: boolean;
  isLoading?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const SOSButton: React.FC<SOSButtonProps> = ({
  onPress,
  isActive = false,
  isLoading = false,
  size = 'large'
}) => {
  // Animation for pulsing effect
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.in(Easing.ease),
            useNativeDriver: Platform.OS !== 'web',
          })
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
    
    return () => {
      pulseAnim.stopAnimation();
    };
  }, [isActive, pulseAnim]);
  
  // Get size dimensions
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 80, height: 80, fontSize: 14, iconSize: 24 };
      case 'medium':
        return { width: 120, height: 120, fontSize: 18, iconSize: 32 };
      case 'large':
      default:
        return { width: 160, height: 160, fontSize: 22, iconSize: 40 };
    }
  };
  
  const { width, height, fontSize, iconSize } = getDimensions();
  
  // Animated styles
  const animatedStyles = {
    transform: [{ scale: pulseAnim }],
  };
  
  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.pulseContainer,
        { width, height, borderRadius: width / 2 },
        isActive && styles.activePulse,
        animatedStyles
      ]}>
        <TouchableOpacity
          style={[
            styles.button,
            { width, height, borderRadius: width / 2 },
            isActive && styles.activeButton,
            isLoading && styles.loadingButton
          ]}
          onPress={onPress}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <AlertTriangle size={iconSize} color={colors.white} />
          <Text style={[styles.text, { fontSize }]}>
            {isActive ? 'CANCEL' : 'SOS'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      
      {isActive && (
        <Text style={styles.activeText}>SOS Alert Active</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  activePulse: {
    backgroundColor: 'rgba(255, 59, 48, 0.3)',
  },
  button: {
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  activeButton: {
    backgroundColor: colors.danger,
  },
  loadingButton: {
    opacity: 0.7,
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
    marginTop: 8,
  },
  activeText: {
    color: colors.danger,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 16,
  },
});