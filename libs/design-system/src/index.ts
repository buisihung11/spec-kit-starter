// Theme exports
export { lightTheme, darkTheme, createCustomTheme } from './theme/theme';
export { lightPalette, darkPalette } from './theme/palette';
export { typography } from './theme/typography';
export { components } from './theme/components';
export { breakpoints } from './theme/breakpoints';
export { spacing } from './theme/spacing';
export { shape } from './theme/shape';
export { shadows } from './theme/shadows';

// Theme provider exports
export { AppTheme, useColorMode } from './theme/AppTheme';
export type { ColorMode, AppThemeProps } from './theme/AppTheme';

// Re-export commonly used MUI components for convenience
export { default as Box } from '@mui/material/Box';
export { default as Button } from '@mui/material/Button';
export { default as Card } from '@mui/material/Card';
export { default as CardContent } from '@mui/material/CardContent';
export { default as CardActions } from '@mui/material/CardActions';
export { default as Container } from '@mui/material/Container';
export { default as Grid } from '@mui/material/Grid';
export { default as Paper } from '@mui/material/Paper';
export { default as Typography } from '@mui/material/Typography';
export { default as TextField } from '@mui/material/TextField';
export { default as IconButton } from '@mui/material/IconButton';
export { default as AppBar } from '@mui/material/AppBar';
export { default as Toolbar } from '@mui/material/Toolbar';
export { default as Drawer } from '@mui/material/Drawer';
export { default as Menu } from '@mui/material/Menu';
export { default as MenuItem } from '@mui/material/MenuItem';
export { default as Divider } from '@mui/material/Divider';
export { default as Stack } from '@mui/material/Stack';
export { default as Chip } from '@mui/material/Chip';
export { default as Alert } from '@mui/material/Alert';
export { default as CircularProgress } from '@mui/material/CircularProgress';

// Export types
export type { Theme, ThemeOptions } from '@mui/material/styles';
export type { SxProps } from '@mui/material/styles';
export type { ButtonProps } from '@mui/material/Button';
export type { TypographyProps } from '@mui/material/Typography';
export type { BoxProps } from '@mui/material/Box';
