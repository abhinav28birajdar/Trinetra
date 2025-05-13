import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';
import { useColors } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isDarkMode?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  isDarkMode = false,
}: ButtonProps) {
  const Colors = useColors();
  
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: Colors.button.primary };
      case 'secondary':
        return { 
          backgroundColor: isDarkMode ? Colors.button.secondary : Colors.button.secondary,
          borderWidth: 1,
          borderColor: Colors.primary,
        };
      case 'danger':
        return { backgroundColor: Colors.button.danger };
      case 'success':
        return { backgroundColor: Colors.button.success };
      default:
        return { backgroundColor: Colors.button.primary };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return { color: Colors.text.light };
      case 'secondary':
        return { color: Colors.text.secondary };
      case 'danger':
        return { color: Colors.text.light };
      case 'success':
        return { color: Colors.text.light };
      default:
        return { color: Colors.text.light };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? Colors.primary : Colors.text.light} />
      ) : (
        <Text style={[styles.buttonText, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});