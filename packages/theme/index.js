export const palette = {
  primary: '#ff5a1f',
  'primary-dark': '#ff3d00',
  secondary: '#ffd166',
  surface: '#ffffff',
  background: '#fdf4ef',
  text: '#1f1f1f',
  muted: '#5f5f5f',
};

export const gradients = {
  hero: {
    angle: 120,
    stops: [
      'rgba(31, 31, 31, 0.85)',
      'rgba(255, 90, 31, 0.55)',
    ],
  },
  background: [
    {
      position: 'circle at top left',
      color: 'rgba(255, 218, 185, 0.35)',
      stop: '60%',
    },
    {
      position: 'circle at bottom right',
      color: 'rgba(255, 160, 122, 0.25)',
      stop: '55%',
    },
  ],
};

export const radii = {
  large: 32,
  medium: 24,
  pill: 999,
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  heading: 'Poppins, "Segoe UI", sans-serif',
  body: 'Poppins, "Segoe UI", sans-serif',
};

const theme = {
  palette,
  gradients,
  radii,
  spacing,
  typography,
};

export default theme;
