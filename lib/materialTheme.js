// Importing Material UI's theming utility to create custom light and dark themes
import { createTheme } from "@mui/material";

// Importing the "Assistant" Google Font using Next.js built-in font optimization
import { Assistant } from "next/font/google";

// ====================================================================
// Load the Assistant font with specific weights and display settings
// ====================================================================
const assistantFont = Assistant({
  weight: ["400", "500", "600", "700", "800"], // Font weights to include
  display: "swap",                             // Improves loading performance (swap fallback font)
  subsets: ["latin"],                          // Include Latin character subset
});

// ====================================================================
// Light Theme Configuration
// Defines colors, typography, and component styles for light mode
// ====================================================================
export const lightTheme = createTheme({
  colorSchemes: {
    light: true, // Indicates this is the light mode configuration
  },
  palette: {
    mode: "light", // Enables light color scheme
    common: {
      black: "#030712",
      white: "#fff",
    },
    primary: {
      main: "#8e51ff", // Main brand color (used for buttons, links, etc.)
    },
    secondary: {
      main: "#8e51ff",
      light: "#f8fafc", // Light shade used for backgrounds or hover states
    },
    background: {
      paper: "#ffffff",  // For surfaces like cards, modals
      default: "#ffffff", // For the main app background
    },
    text: {
      primary: "#030712", // Main text color
      secondary: "#6B7280", // Subtext or disabled text color
    },
    success: {
      main: "#22c55e", // Success / positive action color
      light: "#4caf50",
      dark: "#1b5e20",
      contrastText: "#fff", // Text color on success background
    },
  },
  typography: {
    fontFamily: assistantFont.style.fontFamily, // Apply Assistant font globally
  },
  shadows: {
    // Custom shadow definitions for elevation levels
    0: "none",
    1: "0px 2px 1px -1px rgba(0,0,0,0.150),0px 1px 1px 0px rgba(0,0,0,0.150),0px 1px 3px 0px rgba(0,0,0,0.150)",
    2: "none",
    8: "0 5px 5px rgba(0, 0,0,0.15)", // Used for elevated cards or popups
  },
});

// ====================================================================
// Dark Theme Configuration
// Defines colors, typography, and styles for dark mode
// ====================================================================
export const darkTheme = createTheme({
  colorSchemes: {
    dark: true, // Indicates this is the dark mode configuration
  },
  palette: {
    mode: "dark", // Enables dark color scheme
    common: {
      black: "#030712",
      white: "#fff",
    },
    primary: {
      main: "#8e51ff", // Same primary brand color as light mode
    },
    background: {
      paper: "#0b0a10",   // For surfaces like cards
      default: "#0b0a10", // Main dark background color
    },
    text: {
      primary: "#d4d4d4",   // Light text color for readability on dark backgrounds
      secondary: "#9ca3af", // Muted subtext color
    },
    action: {
      active: "#9ca3af", // Default color for icons and active states
    },
  },
  typography: {
    fontFamily: assistantFont.style.fontFamily, // Use the same Assistant font
  },
  shadows: {
    // Custom shadow definitions suitable for dark mode
    0: "none",
    1: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    2: "none",
    8: "0 5px 5px rgba(0, 0,0,0.15)",
  },
});