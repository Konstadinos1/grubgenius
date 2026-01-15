export const Colors = {
  primary: '#E74C3C', // Bellepros red
  primaryDark: '#C0392B',
  primaryLight: '#EC7063',

  secondary: '#3498DB',
  secondaryDark: '#2980B9',

  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',

  background: '#F8F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  textLight: '#95A5A6',

  border: '#E1E8ED',
  divider: '#ECF0F1',

  // Status colors
  statusPending: '#F39C12',
  statusConfirmed: '#3498DB',
  statusPreparing: '#E67E22',
  statusReady: '#27AE60',
  statusCompleted: '#27AE60',
  statusCancelled: '#95A5A6',
};

export const Typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
};

export default Theme;
