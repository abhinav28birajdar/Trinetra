import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export interface ThemeColors {
  // Primary brand colors
  primary: string;
  primaryDark: string;
  primaryLight: string;
  
  // Background colors
  background: string;
  surface: string;
  card: string;
  modal: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Emergency colors
  emergency: string;
  emergencyDark: string;
  sos: string;
  
  // UI element colors
  border: string;
  divider: string;
  placeholder: string;
  disabled: string;
  
  // Interactive colors
  pressable: string;
  selected: string;
  ripple: string;
  
  // Shadow colors
  shadowColor: string;
  shadowOpacity: number;
}

export interface Theme {
  colors: ThemeColors;
  isDark: boolean;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    h1: { fontSize: number; fontWeight: string; lineHeight: number };
    h2: { fontSize: number; fontWeight: string; lineHeight: number };
    h3: { fontSize: number; fontWeight: string; lineHeight: number };
    body: { fontSize: number; fontWeight: string; lineHeight: number };
    caption: { fontSize: number; fontWeight: string; lineHeight: number };
    button: { fontSize: number; fontWeight: string; lineHeight: number };
  };
}

const lightColors: ThemeColors = {
  // Primary brand colors (using your specified color #5A189A)
  primary: '#5A189A',
  primaryDark: '#4C1D7A',
  primaryLight: '#7C3AED',
  
  // Background colors
  background: '#FFFFFF',
  surface: '#F8FAFC',
  card: '#FFFFFF',
  modal: '#FFFFFF',
  
  // Text colors
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Emergency colors
  emergency: '#DC2626',
  emergencyDark: '#B91C1C',
  sos: '#FF0000',
  
  // UI element colors
  border: '#E5E7EB',
  divider: '#F3F4F6',
  placeholder: '#9CA3AF',
  disabled: '#D1D5DB',
  
  // Interactive colors
  pressable: 'rgba(90, 24, 154, 0.1)',
  selected: 'rgba(90, 24, 154, 0.2)',
  ripple: 'rgba(90, 24, 154, 0.3)',
  
  // Shadow colors
  shadowColor: '#000000',
  shadowOpacity: 0.1,
};

const darkColors: ThemeColors = {
  // Primary brand colors
  primary: '#7C3AED',
  primaryDark: '#5B21B6',
  primaryLight: '#8B5CF6',
  
  // Background colors
  background: '#111827',
  surface: '#1F2937',
  card: '#374151',
  modal: '#1F2937',
  
  // Text colors
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  textInverse: '#111827',
  
  // Status colors
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',
  
  // Emergency colors
  emergency: '#EF4444',
  emergencyDark: '#DC2626',
  sos: '#FF4444',
  
  // UI element colors
  border: '#4B5563',
  divider: '#374151',
  placeholder: '#6B7280',
  disabled: '#4B5563',
  
  // Interactive colors
  pressable: 'rgba(124, 58, 237, 0.2)',
  selected: 'rgba(124, 58, 237, 0.3)',
  ripple: 'rgba(124, 58, 237, 0.4)',
  
  // Shadow colors
  shadowColor: '#000000',
  shadowOpacity: 0.3,
};

const commonTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' as const, lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: 'bold' as const, lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
    body: { fontSize: 16, fontWeight: 'normal' as const, lineHeight: 24 },
    caption: { fontSize: 14, fontWeight: 'normal' as const, lineHeight: 20 },
    button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  },
};

export const lightTheme: Theme = {
  colors: lightColors,
  isDark: false,
  ...commonTheme,
};

export const darkTheme: Theme = {
  colors: darkColors,
  isDark: true,
  ...commonTheme,
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
  themeMode: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // Determine the current theme
  const isDark = 
    themeMode === 'dark' || 
    (themeMode === 'system' && systemColorScheme === 'dark');
  
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    // Load saved theme preference
    loadThemePreference();
    
    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_mode');
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeMode(savedTheme as 'light' | 'dark' | 'system');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async (mode: 'light' | 'dark' | 'system') => {
    try {
      await AsyncStorage.setItem('theme_mode', mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const setTheme = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    saveThemePreference(mode);
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setTheme(newMode);
  };

  const contextValue: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
    themeMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Utility function to create styles with theme
export const createStyles = (theme: Theme) => ({
  // Common container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Card styles
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.colors.shadowOpacity,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Button styles
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center' as const,
  },
  
  // Text styles
  primaryText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
  },
  
  // Emergency styles
  emergencyButton: {
    backgroundColor: theme.colors.emergency,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center' as const,
    shadowColor: theme.colors.emergency,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  
  // Gradient styles
  primaryGradient: [theme.colors.primary, theme.colors.primaryLight],
  emergencyGradient: [theme.colors.emergency, theme.colors.emergencyDark],
});

export default ThemeProvider;
