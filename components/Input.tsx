import React, { useState, memo } from 'react'; // Import memo
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions // Make sure this is imported if you use it
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@/constants/Colors';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  disabled?: boolean;
  style?: ViewStyle; // Style for the outer container <View>
  inputStyle?: TextStyle; // Style specifically for the <TextInput> element
  labelStyle?: TextStyle;
  multiline?: boolean;
  numberOfLines?: number;
  onBlur?: () => void;
  onFocus?: () => void;
  onSubmitEditing?: () => void;
  // Add common TextInput props users might want to pass down
  textContentType?: 'none' | 'URL' | 'addressCity' | 'addressCityAndState' | 'addressState' | 'countryName' | 'creditCardNumber' | 'emailAddress' | 'familyName' | 'fullStreetAddress' | 'givenName' | 'jobTitle' | 'location' | 'middleName' | 'name' | 'namePrefix' | 'nameSuffix' | 'nickname' | 'organizationName' | 'postalCode' | 'streetAddressLine1' | 'streetAddressLine2' | 'sublocality' | 'telephoneNumber' | 'username' | 'password' | 'newPassword' | 'oneTimeCode';
  autoComplete?: 'birthdate-day'| 'birthdate-full'| 'birthdate-month'| 'birthdate-year'| 'cc-csc'| 'cc-exp'| 'cc-exp-day'| 'cc-exp-month'| 'cc-exp-year'| 'cc-number'| 'email'| 'gender'| 'name'| 'name-family'| 'name-given'| 'name-middle'| 'name-middle-initial'| 'name-prefix'| 'name-suffix'| 'password'| 'password-new'| 'postal-address'| 'postal-address-country'| 'postal-address-extended'| 'postal-address-extended-postal-code'| 'postal-address-locality'| 'postal-address-region'| 'postal-code'| 'street-address'| 'sms-otp'| 'tel'| 'tel-country-code'| 'tel-national'| 'tel-device'| 'username'| 'username-new'| 'off';
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
}

// Renamed the internal component to avoid confusion with the exported memoized component
const InputComponent: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  returnKeyType = 'done',
  autoCapitalize = 'none',
  error,
  disabled = false,
  style,
  inputStyle,
  labelStyle,
  multiline = false,
  numberOfLines = 1,
  onBlur,
  onFocus,
  onSubmitEditing,
  textContentType, // Added
  autoComplete,    // Added
  inputMode        // Added
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determine if autocorrect should be off (usually for passwords, emails, codes)
  const turnOffAutoCorrect = secureTextEntry || keyboardType === 'email-address' || keyboardType === 'visible-password' || textContentType?.includes('password') || textContentType === 'emailAddress' || textContentType === 'oneTimeCode';

  return (
    // Apply the passed 'style' prop to the main container
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, labelStyle, disabled && styles.disabledText]}>{label}</Text>
      )}

      <View style={[
        styles.inputContainer,
        isFocused && !error && styles.inputContainerFocused, // Only apply focus style if no error
        error && styles.inputContainerError,
        disabled && styles.inputContainerDisabled
      ]}>
        <TextInput
          // Apply the passed 'inputStyle' prop directly to the TextInput
          style={[
            styles.input,
            secureTextEntry && styles.secureInput, // Adjust padding if eye icon is present
            multiline && styles.multilineInput,
            disabled && styles.disabledText,
            inputStyle // Allow overriding internal styles
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight} // Use a consistent placeholder color
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmitEditing}
          // Setting blurOnSubmit=false for 'next' can improve multi-input form flow
          blurOnSubmit={returnKeyType === 'done' || returnKeyType === 'send' || returnKeyType === 'go' || returnKeyType === 'search' || !onSubmitEditing}
          // Performance hints:
          autoCorrect={!turnOffAutoCorrect} // Turn off autocorrect for sensitive/specific fields
          spellCheck={!turnOffAutoCorrect}   // Turn off spellcheck as well
          // Accessibility & Autofill hints:
          textContentType={textContentType}
          autoComplete={autoComplete}
          inputMode={inputMode}
        />

        {/* Only show the eye icon if secureTextEntry is true */}
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIconContainer} // Use container for better touch area
            onPress={togglePasswordVisibility}
            disabled={disabled}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase touchable area
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={isFocused ? colors.primary : colors.textLight} />
            ) : (
              <Eye size={20} color={isFocused ? colors.primary : colors.textLight} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Display error message below the input */}
      {error && !disabled && ( // Don't show error if disabled
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

// --- Export the memoized component ---
export const Input = memo(InputComponent);
// ------------------------------------

const styles = StyleSheet.create({
  container: {
    marginBottom: 16, // Default spacing below the input
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8, // Increased space between label and input
    color: colors.textDark,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Vertically center items in the container
    borderWidth: 1.5, // Slightly thicker border
    borderColor: colors.border, // Default border color
    borderRadius: 10, // Slightly more rounded corners
    backgroundColor: colors.white,
    overflow: 'hidden', // Clip potential shadow overflow if needed
  },
  inputContainerFocused: {
    borderColor: colors.primary, // Highlight color when focused
    // Optional: Add subtle shadow on focus (can impact performance slightly)
    // shadowColor: colors.primary,
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.15,
    // shadowRadius: 3,
    // elevation: 3,
  },
  inputContainerError: {
    borderColor: colors.danger, // Red border for errors
  },
  inputContainerDisabled: {
    backgroundColor: colors.border, // Use a more distinct disabled background
    borderColor: colors.border, // Match border color
    // opacity: 0.7, // Opacity can make text hard to read, prefer background change
  },
  disabledText: {
    color: colors.textLight, // Make disabled text lighter
  },
  input: {
    flex: 1, // Take up available horizontal space
    paddingVertical: 14, // Slightly more vertical padding
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text, // Default text color
    // Ensure minimum height matches container expectations, especially for single line
    minHeight: 50,
  },
  secureInput: {
    // Reduce right padding to make space for the icon container
    paddingRight: 45,
  },
  multilineInput: {
    textAlignVertical: 'top', // Align text to the top in multiline
    paddingTop: 14, // Match vertical padding
    minHeight: 100, // Default min height for multiline
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center', // Center the icon vertically
    paddingHorizontal: 12, // Horizontal padding for touch area
     // backgroundColor: 'rgba(0,0,0,0.1)' // Optional: for visualizing touch area
  },
  errorText: {
    color: colors.danger, // Error text color
    fontSize: 13, // Slightly larger error text
    marginTop: 6, // Space between input and error message
    // marginLeft: 4, // No need for left margin if container is full width
  },
});