import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  StyleProp, 
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions
} from 'react-native';
import { useColors } from '@/constants/colors';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  isDarkMode?: boolean;
}

export default function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  inputStyle,
  icon,
  multiline = false,
  numberOfLines = 1,
  autoCapitalize = 'none',
  isDarkMode = false,
}: InputProps) {
  const Colors = useColors();
  
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: Colors.primary }]}>{label}</Text>}
      <View style={[
        styles.inputContainer, 
        { 
          borderColor: error ? Colors.status.error : '#ddd',
          backgroundColor: isDarkMode ? Colors.background.secondary : Colors.background.primary
        },
        error ? styles.inputError : null
      ]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          style={[
            styles.input, 
            { color: Colors.text.dark },
            icon ? styles.inputWithIcon : null, 
            inputStyle
          ]}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
        />
      </View>
      {error && <Text style={[styles.errorText, { color: Colors.status.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  inputError: {
    borderColor: '#F44336',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  iconContainer: {
    paddingLeft: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});