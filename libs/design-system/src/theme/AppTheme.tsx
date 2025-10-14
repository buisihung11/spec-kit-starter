import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Theme } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';

export type ColorMode = 'light' | 'dark';

interface ColorModeContextValue {
  mode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'light',
  toggleColorMode: () => {
    // Default empty implementation
  },
  setColorMode: () => {
    // Default empty implementation
  },
});

/**
 * Hook to access color mode context
 * Provides mode, toggleColorMode, and setColorMode functions
 */
export const useColorMode = (): ColorModeContextValue => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within AppTheme provider');
  }
  return context;
};

export interface AppThemeProps {
  children: React.ReactNode;
  /**
   * Initial color mode (default: 'light')
   */
  defaultMode?: ColorMode;
  /**
   * Custom theme object to override defaults
   */
  theme?: Theme;
  /**
   * Disable CSS baseline normalization
   */
  disableCssBaseline?: boolean;
}

/**
 * AppTheme - Centralized theme provider component
 *
 * Features:
 * - Light/Dark mode support with context
 * - CSS Baseline normalization
 * - Custom theme overrides support
 * - Persistent theme preference (can be extended with localStorage)
 *
 * @example
 * ```tsx
 * <AppTheme defaultMode="dark">
 *   <YourApp />
 * </AppTheme>
 * ```
 */
export const AppTheme: React.FC<AppThemeProps> = ({
  children,
  defaultMode = 'light',
  theme: customTheme,
  disableCssBaseline = false,
}) => {
  const [mode, setMode] = useState<ColorMode>(defaultMode);

  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const setColorMode = useCallback((newMode: ColorMode) => {
    setMode(newMode);
  }, []);

  const colorModeContextValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
      setColorMode,
    }),
    [mode, toggleColorMode, setColorMode]
  );

  const theme = useMemo(() => {
    if (customTheme) {
      return customTheme;
    }
    return mode === 'light' ? lightTheme : darkTheme;
  }, [mode, customTheme]);

  return (
    <ColorModeContext.Provider value={colorModeContextValue}>
      <MuiThemeProvider theme={theme}>
        {!disableCssBaseline && <CssBaseline />}
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AppTheme;
