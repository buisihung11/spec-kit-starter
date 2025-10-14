import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palette';
import { typography } from './typography';
import { components } from './components';
import { breakpoints } from './breakpoints';
import { spacing } from './spacing';
import { shape } from './shape';
import { shadows } from './shadows';

/**
 * Base theme configuration shared between light and dark modes
 */
const baseThemeOptions: ThemeOptions = {
  typography,
  breakpoints,
  spacing,
  shape,
  shadows,
  components,
};

/**
 * Light theme configuration
 * Following Material Design 3 principles with custom branding
 */
export const lightTheme: Theme = createTheme({
  ...baseThemeOptions,
  palette: lightPalette,
});

/**
 * Dark theme configuration
 * Optimized for OLED displays with deep backgrounds
 */
export const darkTheme: Theme = createTheme({
  ...baseThemeOptions,
  palette: darkPalette,
});

/**
 * Create custom theme with overrides
 * Allows apps to extend the base theme
 */
export const createCustomTheme = (options?: ThemeOptions): Theme => {
  return createTheme({
    ...baseThemeOptions,
    palette: lightPalette,
    ...options,
  });
};
