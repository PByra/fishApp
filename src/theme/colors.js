// Lodge & Lake Color Palette
// Inspired by Bass Pro Shops, Cabela's, Sitka, YETI — Wisconsin wilderness aesthetic

export const colors = {
  // Primary Brand Colors — Deep Lodge Green
  primary: {
    forest: '#1E3A22',      // Deep lodge green — headers & primary UI
    darkForest: '#122015',  // Near-black green — dark accents
    lightForest: '#2D5232', // Mid forest — lighter variant
  },

  // Secondary Colors — Earth & Bark
  secondary: {
    slateGray: '#4A5A4C',   // Muted forest mid-tone
    lightSlate: '#6A7A6C',  // Secondary text
    paleSilt: '#C8C0A8',    // Light warm neutral
  },

  // Action Colors — Aged Brass & Burnt Copper
  accent: {
    persimmon: '#C84B18',   // Burnt copper/ember — primary CTA
    wasabi: '#C4A054',      // Aged brass/honey gold — secondary CTA
    darkOrange: '#A33A12',  // Deep ember — hover state
  },

  // Functional Colors
  functional: {
    success: '#4CAF50',     // In-season fish
    warning: '#FF9800',     // Upcoming season
    danger: '#F44336',      // Off-season
    info: '#2196F3',        // Information
  },

  // Neutral — Warm Parchment & Leather
  neutral: {
    white: '#FFFFFF',
    black: '#1A1201',
    gray100: '#F5F0E6',     // Warm cream
    gray200: '#EDE5D6',     // Kraft paper
    gray300: '#D6CBBA',     // Warm mid-tone
    gray400: '#9E8E7A',     // Warm gray
    gray500: '#6E5E4A',     // Leather brown-gray
    lightGray: '#F0E8D6',   // Warm parchment — list backgrounds
    textSecondary: '#6B5A44', // Warm leather text
    borderLight: '#D6CAB0', // Warm tan border
  },

  // Status Colors
  status: {
    inSeason: '#4CAF50',    // In-season fish
    offSeason: '#9E9E9E',   // Off-season fish
    upcoming: '#FF9800',    // Upcoming season
  },

  // Water & Environment
  environment: {
    water: '#152840',       // Deep lake water
    lightWater: '#2A5C8A',  // Lake surface blue
    riverBlue: '#1E4D7A',   // River water
    sunset: '#D4641A',      // Golden hour
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
  lg: 24,
  xl: 32,
  full: 9999,
};

export const typography = {
  fontFamily: {
    sans: 'Roboto, Inter, -apple-system, sans-serif',
  },
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
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  heading: {
    fontSize: 24,
    size: 24,
    small: 18,
    fontWeight: '700',
    lineHeight: 28,
  },
  subheading: {
    fontSize: 18,
    size: 18,
    fontWeight: '600',
    lineHeight: 22,
  },
  body: {
    fontSize: 16,
    size: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    size: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    size: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#1A1201',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1A1201',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 8,
  },
  xl: {
    shadowColor: '#1A1201',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 12,
  },
  elevated: {
    shadowColor: '#1A1201',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.22,
    shadowRadius: 38,
    elevation: 16,
  },
};

export const touchTargets = {
  small: 40,
  medium: 48,
  large: 56,
  touch: 64,
};
