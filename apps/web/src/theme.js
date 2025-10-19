import { palette } from '@cong/theme';

const applyPaletteToCssVariables = () => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;

  Object.entries(palette).forEach(([token, value]) => {
    root.style.setProperty(`--${token}`, value);
  });
};

applyPaletteToCssVariables();

export default palette;
