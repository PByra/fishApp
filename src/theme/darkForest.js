/**
 * Dark Forest Theme for Search-to-Navigate Feature
 * Optimized for Samsung Galaxy Flip 3 (22:9 aspect ratio)
 * Color Palette: Deep Forest Dark Mode
 */

export const darkForestTheme = {
  // Dark Forest Background Palette
  background: {
    primary: '#1A2421',      // Deep forest base
    secondary: '#2A3632',    // Card background
    tertiary: '#3A4A42',     // Hover/active states
    overlay: 'rgba(26, 36, 33, 0.95)', // Overlay with slight transparency
  },

  // Accent Colors
  accent: {
    burnt_orange: '#E67E22', // Primary action button
    burnt_orange_light: '#EC8C3A',
    burnt_orange_dark: '#D67A1E',
    highlight: '#FF9F43',    // Hover state
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',      // Main text
    secondary: '#B0B8B5',    // Secondary text
    tertiary: '#7A8A87',     // Disabled or hint text
    accent: '#E67E22',       // Accent text
  },

  // Status Colors
  status: {
    active: '#27AE60',       // In-season/active
    inactive: '#7A8A87',     // Off-season
    warning: '#F39C12',      // Caution
    error: '#E74C3C',        // Error
  },

  // Shadows
  shadow: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 5,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  // Spacing Scale (8px base)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },

  // Border Radius
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20,
    circle: 50,
  },

  // Typography
  typography: {
    heading: {
      size: 28,
      weight: '700',
      lineHeight: 32,
    },
    subheading: {
      size: 20,
      weight: '700',
      lineHeight: 24,
    },
    body: {
      size: 14,
      weight: '500',
      lineHeight: 20,
    },
    caption: {
      size: 12,
      weight: '500',
      lineHeight: 16,
    },
    button: {
      size: 16,
      weight: '700',
      lineHeight: 20,
    },
  },

  // Touch Targets (for Flip 3 optimization)
  touchTarget: {
    minimum: 48,  // Field standard
    comfortable: 56,
    large: 64,    // For gloved hands
  },
};

export default darkForestTheme;
