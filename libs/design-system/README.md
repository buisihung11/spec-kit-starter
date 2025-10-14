# @spec-kit-demo-v2/design-system

Centralized Material UI design system for the Spec Kit Demo monorepo.

## Features

- 🎨 **Consistent Theming** - Pre-configured light and dark themes following Material Design 3
- 🔧 **Customizable** - Easy to extend and override theme properties
- 🎯 **Type-Safe** - Full TypeScript support
- 📦 **Tree-Shakeable** - Import only what you need
- ♿ **Accessible** - Built on Material UI's accessibility foundations
- 🌓 **Dark Mode** - Built-in light/dark mode support with context API

## Installation

This library is already included in the monorepo. Import from `@spec-kit-demo-v2/design-system`.

## Usage

### Basic Setup

Wrap your application with the `AppTheme` provider:

```tsx
import { AppTheme } from '@spec-kit-demo-v2/design-system';

function App() {
  return (
    <AppTheme defaultMode="light">
      <YourApplication />
    </AppTheme>
  );
}
```

### Using Components

```tsx
import { Button, Typography, Card } from '@spec-kit-demo-v2/design-system';
```

### Dark Mode

```tsx
import { useColorMode } from '@spec-kit-demo-v2/design-system';

const { mode, toggleColorMode } = useColorMode();
```

## Running unit tests

Run `nx test design-system` to execute the unit tests via [Vitest](https://vitest.dev/).
