import { useThemeStore } from '@/store/themeStore';

const lightColors = {
  primary: '#6A0DAD', // Deep purple
  primaryLight: '#8A2BE2', // Medium purple
  primaryDark: '#4B0082', // Indigo
  secondary: '#F5F5F5', // Light gray
  accent: '#FF4500', // Orange-red for emergency buttons
  text: {
    primary: '#FFFFFF', // White text on dark backgrounds
    secondary: '#6A0DAD', // Purple text on light backgrounds
    dark: '#333333', // Dark text
    light: '#FFFFFF', // Light text
  },
  background: {
    primary: '#FFFFFF', // White
    secondary: '#F5F5F5', // Light gray
    card: '#F0E6FF', // Light purple
  },
  button: {
    primary: '#6A0DAD', // Deep purple
    secondary: '#E6E6FA', // Lavender
    danger: '#FF4500', // Orange-red
    success: '#4CAF50', // Green
  },
  status: {
    success: '#4CAF50', // Green
    warning: '#FFC107', // Amber
    error: '#F44336', // Red
  },
  tabBar: {
    active: '#6A0DAD', // Deep purple
    inactive: '#9370DB', // Medium purple
    background: '#6A0DAD', // Deep purple

    
  },
  border: '#E0E0E0',
};

const darkColors = {
  primary: '#8A2BE2', // Medium purple (lighter for dark mode)
  primaryLight: '#9370DB', // Medium purple
  primaryDark: '#4B0082', // Indigo
  secondary: '#333333', // Dark gray
  accent: '#FF6347', // Tomato for emergency buttons
  text: {
    primary: '#FFFFFF', // White text
    secondary: '#E6E6FA', // Lavender text
    dark: '#E0E0E0', // Light gray text
    light: '#FFFFFF', // White text
  },
  background: {
    primary: '#121212', // Very dark gray
    secondary: '#1E1E1E', // Dark gray
    card: '#2D1F47', // Dark purple
  },
  button: {
    primary: '#8A2BE2', // Medium purple
    secondary: '#4B0082', // Indigo
    danger: '#FF6347', // Tomato
    success: '#66BB6A', // Light green
  },
  status: {
    success: '#66BB6A', // Light green
    warning: '#FFD54F', // Light amber
    error: '#EF5350', // Light red
  },
  tabBar: {
    active: '#E6E6FA', // Lavender
    inactive: '#9370DB', // Medium purple
    background: '#4B0082', // Indigo
  },
  border: '#444444',
};

export const useColors = () => {
  const { isDarkMode } = useThemeStore();
  return isDarkMode ? darkColors : lightColors;
};

export default lightColors; // For backward compatibility