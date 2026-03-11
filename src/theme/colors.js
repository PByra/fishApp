// Modern Wilderness Color Palette
// Inspired by YETI, Sitka, Simms outdoor brands

export const colors = {
  // Primary Brand Colors - Deep Forest & Lake
  primary: {
    forest: '#3B4B48',      // Narragansett Green - Headers & Primary UI
    darkForest: '#2A3432',  // Darker accent
    lightForest: '#4A5A57', // Lighter variant
  },

  // Secondary Colors
  secondary: {
    slateGray: '#5A6D6A',   // Cards & backgrounds
    lightSlate: '#7A8D8A',  // Secondary text
    paleSilt: '#D4DED9',    // Light backgrounds
  },

  // Action Colors - High Visibility
  accent: {
    persimmon: '#EC5840',   // Primary CTA (Navigate button)
    wasabi: '#A8C69F',      // Secondary CTA
    darkOrange: '#D43F2B',  // Hover state
  },

  // Functional Colors
  functional: {
    success: '#4CAF50',     // In-season fish
    warning: '#FF9800',     // Upcoming season
    danger: '#F44336',      // Off-season
    info: '#2196F3',        // Information
  },

  // Neutral
  neutral: {
    white: '#FFFFFF',
    black: '#1A1A1A',
    gray100: '#F5F5F5',
    gray200: '#E8E8E8',
    gray300: '#D0D0D0',
    gray400: '#9E9E9E',
    gray500: '#757575',
    lightGray: '#F5F1E8',      // Light background
    textSecondary: '#666666',  // Secondary text
  },

  // Water & Environment
  environment: {
    water: '#1B3A52',       // Deep water
    lightWater: '#4A7BA7',  // Light water
    riverBlue: '#2E5F8F',   // River water
    sunset: '#FF6B35',      // Golden hour
  },

  // Glassmorphism
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.1)',
  },
};

// Design Tokens
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,     // Bento cards
  xl: 32,
  full: 9999,
};

export const typography = {
  // Font families
  fontFamily: {
    sans: 'Roboto, Inter, -apple-system, sans-serif',
  },
  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },
  // Font weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  elevated: '0 15px 35px rgba(0, 0, 0, 0.2)',
};

export const touchTargets = {
  small: 40,
  medium: 48,   // Minimum recommended
  large: 56,
  touch: 64,    // Extra large for gloved hands
};
