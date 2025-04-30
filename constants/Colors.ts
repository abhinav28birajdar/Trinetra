// constants/colors.ts

const Colors = {
  primary: "#FF6B8B",       // Soft pink
  secondary: "#8A56AC",     // Purple
  tertiary: "#FFD3DA",      // Light pink
  accent: "#FF4081",        // Bright pink for important actions

  // UI colors
  background: "#FFFFFF",
  card: "#F9F5F9",          // Used this for gray[100] fallback before
  surface: "#FFFFFF",

  // Text colors
  text: "#333333",
  textSecondary: "#666666",
  textLight: "#999999",
  subtext: "#666666", // Alias for textSecondary

  // Status colors
  success: "#4CAF50",
  warning: "#FFC107",
  danger: "#F44336",
  info: "#2196F3",

  // Common colors
  white: "#FFFFFF",
  black: "#000000",

  // Grayscale - Matches Material Design naming, good for consistency
  gray: {
    50: "#FAFAFA",
    100: "#F5F5F5",   // Used this for gray[100]/card fallback before
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",   // Used this for gray[400] fallback before
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },

  // Transparent
  transparent: "transparent",

  // Gradients (Keep if used, otherwise optional)
  gradients: {
    primary: ["#FF6B8B", "#FF8E8E"],
    secondary: ["#8A56AC", "#6A5ACD"],
  }
};

export default Colors;