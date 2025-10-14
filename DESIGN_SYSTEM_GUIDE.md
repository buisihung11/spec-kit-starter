# Design System Implementation Guide

## Overview

A comprehensive Material UI design system library has been created and integrated into the monorepo following industry best practices.

## What Was Created

### 1. **Design System Library** (`@spec-kit-demo-v2/design-system`)

Location: `/libs/design-system/`

**Structure:**
```
libs/design-system/
├── src/
│   ├── theme/
│   │   ├── palette.ts         # Light & dark color schemes
│   │   ├── typography.ts      # Font configurations
│   │   ├── components.ts      # Global component overrides
│   │   ├── breakpoints.ts     # Responsive breakpoints
│   │   ├── spacing.ts         # 8px grid system
│   │   ├── shape.ts           # Border radius config
│   │   ├── shadows.ts         # Elevation shadows
│   │   ├── theme.ts           # Theme assembly
│   │   └── AppTheme.tsx       # Theme provider component
│   └── index.ts               # Public API exports
```

### 2. **Key Features**

✅ **Theme Configuration**
- Light and dark mode support with context API
- Material Design 3 principles
- System font stack for performance
- 8px grid spacing system
- Responsive breakpoints (xs, sm, md, lg, xl)
- Soft shadows for modern look

✅ **Component Customizations**
- Buttons with rounded corners and no elevation
- Cards with subtle shadows
- Text fields with rounded inputs
- Custom scrollbar styles
- Optimized AppBar, Drawer, Dialog, and more

✅ **Type Safety**
- Full TypeScript support
- Exported types for Theme, SxProps, and all components

✅ **Module Federation Support**
- Shared as singleton across host and remotes
- Consistent theming across microfrontends

## How to Use

### Basic Usage

```tsx
import { AppTheme, Button, Typography, Box } from '@spec-kit-demo-v2/design-system';

function App() {
  return (
    <AppTheme defaultMode="light">
      <Box p={3}>
        <Typography variant="h4">Hello World</Typography>
        <Button variant="contained" color="primary">
          Click Me
        </Button>
      </Box>
    </AppTheme>
  );
}
```

### Dark Mode Toggle

```tsx
import { useColorMode, IconButton } from '@spec-kit-demo-v2/design-system';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function ThemeToggle() {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <IconButton onClick={toggleColorMode} color="inherit">
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
```

### Custom Theme Extension

```tsx
import { createCustomTheme, AppTheme } from '@spec-kit-demo-v2/design-system';

const myTheme = createCustomTheme({
  palette: {
    primary: {
      main: '#your-brand-color',
    },
  },
  typography: {
    fontFamily: 'Your-Custom-Font, sans-serif',
  },
});

function App() {
  return (
    <AppTheme theme={myTheme}>
      {/* Your app */}
    </AppTheme>
  );
}
```

## Integration Status

### ✅ Shell App (`/apps/shell/`)
- Replaced `@mui/material` imports with `@spec-kit-demo-v2/design-system`
- Wrapped app with `AppTheme` provider
- Removed redundant `CssBaseline` and `ThemeProvider`
- Components updated: App, Navbar, Layout, Home, Login

### ✅ Remote App (`/apps/newInstructionsUi/`)
- Updated to use design system imports
- Consistent theming through Module Federation

### ✅ Module Federation Configuration
- Both apps configured to share design-system as singleton
- Ensures single theme instance across microfrontends

## Theme Colors

### Light Mode
- **Primary**: `#1976d2` (Blue)
- **Secondary**: `#9c27b0` (Purple)
- **Background**: `#f5f5f5`
- **Paper**: `#ffffff`

### Dark Mode
- **Primary**: `#90caf9` (Light Blue)
- **Secondary**: `#ce93d8` (Light Purple)
- **Background**: `#121212`
- **Paper**: `#1e1e1e`

## Component Overrides

All Material UI components have been customized with:
- **Buttons**: 8px border radius, no elevation by default, hover effects
- **Cards**: 12px border radius, soft shadow
- **Text Fields**: 8px border radius, clear focus states
- **AppBar**: No elevation, subtle bottom border
- **Chips**: 8px border radius, medium weight font
- **Tooltips**: Custom background, 6px radius
- **Tables**: Themed borders and bold headers

## Best Practices

1. **Always import from design-system**: 
   ```tsx
   // ✅ Good
   import { Button } from '@spec-kit-demo-v2/design-system';
   
   // ❌ Avoid
   import Button from '@mui/material/Button';
   ```

2. **Use theme spacing**:
   ```tsx
   <Box p={2} m={3} /> // Uses theme.spacing(2) and theme.spacing(3)
   ```

3. **Leverage sx prop for customization**:
   ```tsx
   <Button sx={{ borderRadius: 4, px: 3 }}>Custom</Button>
   ```

4. **Access theme in styled components**:
   ```tsx
   sx={(theme) => ({
     color: theme.palette.primary.main,
     padding: theme.spacing(2),
   })}
   ```

## Running the Application

```bash
# Start shell app with devRemotes
pnpm nx serve shell --devRemotes=newInstructionsUi

# Build all apps
pnpm nx run-many -t build

# Test design system
pnpm nx test design-system
```

## Future Enhancements

Consider adding:
- [ ] Custom component variants (e.g., Button variant="dashed")
- [ ] Animation presets
- [ ] Additional color palettes (success, warning, info variations)
- [ ] CSS-in-JS utilities
- [ ] Storybook integration for component documentation
- [ ] Theme persistence with localStorage
- [ ] System preference detection for auto dark mode

## Troubleshooting

### Build Warnings
The Module Federation source map warnings are expected and can be ignored. They don't affect functionality.

### Type Errors
If you encounter type errors after importing from design-system, ensure:
1. TypeScript is configured to recognize the library path
2. `tsconfig.base.json` includes the design-system path mapping
3. Your IDE/editor has reloaded the TypeScript server

### Theme Not Applied
Ensure:
1. `AppTheme` wraps your entire application
2. You're not wrapping with multiple `ThemeProvider` instances
3. Design system is properly shared in Module Federation config

## Documentation

- **Library README**: `/libs/design-system/README.md`
- **MUI Documentation**: https://mui.com/material-ui/
- **Theme Customization**: https://mui.com/material-ui/customization/theming/

---

**Created**: January 2025
**Maintained by**: Spec Kit Demo Team
**License**: Private
