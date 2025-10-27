# GitHub Copilot Instructions

## Priority Guidelines

When generating code for this repository:

1. **Version Compatibility**: Always detect and respect the exact versions of languages, frameworks, and libraries used in this project
2. **Codebase Patterns**: Scan the codebase for established patterns and follow them consistently
3. **Architectural Consistency**: Maintain the NX monorepo microfrontend architecture with Module Federation
4. **Code Quality**: Prioritize maintainability, type safety, testability, and accessibility in all generated code
5. **Testing First**: Write tests for all new functionality using the established Jest and Testing Library patterns

## Technology Version Detection

This project uses the following exact versions:

### Core Technologies
- **Node.js**: 20.19.9 (detected from @types/node)
- **TypeScript**: 5.9.2
- **ECMAScript Target**: ES2015 with ES2020 library
- **NX**: 21.6.4
- **Package Manager**: pnpm
- **Package Management**: Single `package.json` file at the root manages all dependencies for the entire monorepo

### React Ecosystem
- **React**: 19.0.0
- **React DOM**: 19.0.0
- **React Router**: 7.9.4
- **React Router DOM**: 6.29.0
- **React Hook Form**: 7.65.0
- **React Is**: 19.0.0
- **React Testing Library**: 16.1.0

### UI Framework
- **Material UI Core**: 7.3.4
- **Material UI Icons**: 7.3.4
- **Emotion React**: 11.14.0
- **Emotion Styled**: 11.14.1
- **Styled Components**: 5.3.6

### Testing
- **Jest**: 30.0.2
- **Testing Library Jest DOM**: 6.9.1
- **Testing Library DOM**: 10.4.0
- **MSW (Mock Service Worker)**: 2.11.5
- **Cypress**: 14.2.1

### Build Tools
- **Webpack**: Via @nx/webpack 21.6.4
- **Module Federation**: @module-federation/enhanced 0.18.0
- **Vite**: 7.0.0
- **SWC**: 1.5.7

### Important Constraints
- **JSX Transform**: Use `react-jsx` (automatic runtime)
- **Module System**: ESNext with Node resolution
- **Strict Mode**: Enabled in TypeScript
- Never use features beyond TypeScript 5.9.2
- Never use React features beyond React 19.0.0

## Project Architecture

### Monorepo Structure
This is an NX monorepo with a **microfrontend architecture** using Module Federation:

```
apps/
  shell/                    # Host application (main shell)
  newInstructionsUi/       # Remote microfrontend module
  *-e2e/                   # E2E test projects for each app
libs/
  design-system/           # Shared design system library
specs/                     # Specification documents
```

### Module Federation Pattern
- **Shell** is the host application that loads remote modules
- **Remote modules** (like newInstructionsUi) expose components via Module Federation
- Shared dependencies (React, Material UI, design system) are singletons
- Each remote has a `module-federation.config.ts` for configuration
- Remotes expose components through `remote-entry.ts`

### Path Aliases
Always use these configured path aliases:
```typescript
"@spec-kit-demo-v2/design-system" → "libs/design-system/src/index.ts"
"newInstructionsUi/Module" → "apps/newInstructionsUi/src/remote-entry.ts"
```

## Code Patterns and Standards

### File Naming Conventions
- **Components**: PascalCase for files and folders (e.g., `QuestionSetList.tsx`, `FormDisplay.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useFormService.ts`, `useMultiStepForm.ts`)
- **Services**: camelCase with "Service" suffix (e.g., `formService.ts`)
- **Types**: camelCase with ".types.ts" suffix (e.g., `questionSet.types.ts`)
- **Tests**: Same name as source with `.spec.ts` or `.spec.tsx` suffix
- **Mocks**: Place in `mocks/` directory (e.g., `handlers.ts`, `browser.ts`)

### TypeScript Patterns

#### Interface Definitions
Always define interfaces before implementation with JSDoc comments:

```typescript
/**
 * Description of what this interface represents
 */
export interface ComponentProps {
  /** Description of required prop */
  requiredProp: string;
  /** Description of optional prop */
  optionalProp?: boolean;
}
```

#### Type Exports
Use named exports for all types:
```typescript
export interface QuestionSet { /* ... */ }
export type FormFieldType = 'text' | 'select' | 'radio';
```

#### Prop Interfaces
Define props interface separately before component:
```typescript
export interface MyComponentProps {
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
}

export function MyComponent({ onSubmit, initialData }: MyComponentProps) {
  // implementation
}
```

### React Component Patterns

#### Function Components
Use function declarations (not arrow functions) for components:
```typescript
export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // implementation
}
```

#### Imports
Group and order imports as follows:
1. React imports
2. Third-party library imports (Material UI, hooks, etc.)
3. Local imports (hooks, services, types, components)

```typescript
import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@spec-kit-demo-v2/design-system';
import { useFormService } from '../../hooks/useFormService';
import { FormData } from '../../types/questionSet.types';
```

#### State Management
Use React hooks following these patterns:
```typescript
const [state, setState] = useState<Type>(initialValue);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);
```

#### Effects
Use useEffect with proper dependencies:
```typescript
useEffect(() => {
  async function fetchData() {
    // async operations
  }
  fetchData();
}, [dependency1, dependency2]);
```

### Custom Hooks Pattern

Follow this structure for custom hooks:

```typescript
/**
 * Return type for the useHookName hook
 */
export interface UseHookNameReturn {
  /** Description of return value */
  data: DataType | null;
  loading: boolean;
  error: Error | null;
  /** Description of function */
  fetchData: () => Promise<void>;
}

/**
 * Custom hook description with purpose and usage
 *
 * @returns {UseHookNameReturn} Object containing state and functions
 *
 * @example
 * ```tsx
 * function Component() {
 *   const { data, loading, error, fetchData } = useHookName();
 *   // usage
 * }
 * ```
 */
export function useHookName(): UseHookNameReturn {
  // implementation with useState, useCallback, useRef, etc.
}
```

Key patterns:
- Define return type interface
- Export interface and hook
- Use JSDoc with @example
- Use useCallback for functions returned from hooks
- Use useRef for AbortController and other imperative operations
- Return object with named properties

### Service Layer Pattern

Services use class-based structure:

```typescript
/**
 * Interface for the service client
 */
export interface ServiceClient {
  methodName(param: Type): Promise<ReturnType>;
}

/**
 * Service class for handling specific domain operations
 */
export class ServiceName implements ServiceClient {
  private readonly baseUrl: string;
  private readonly timeoutMs = 30000;

  constructor() {
    this.baseUrl = process.env.NX_SERVICE_URL || '/api';
  }

  /**
   * Private helper methods
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    signal?: AbortSignal
  ): Promise<Response> {
    // implementation
  }

  /**
   * Public API methods
   */
  async methodName(param: Type, signal?: AbortSignal): Promise<ReturnType> {
    // implementation
  }
}

// Export singleton instance
export const serviceName = new ServiceName();
```

Key patterns:
- Define interface first
- Use class implementing interface
- Private methods for internal logic
- Support AbortSignal for cancellable requests
- Include timeout handling
- Export singleton instance
- Use environment variables for configuration

### Type Definitions

Organize types in dedicated `.types.ts` files:

```typescript
/**
 * Type definitions for [domain]
 * This file contains all TypeScript interfaces and types used throughout [feature]
 */

/**
 * Description of the type
 */
export interface TypeName {
  /** Description of each property */
  id: string;
  name: string;
  optional?: boolean;
}
```

### Error Handling

Follow consistent error handling patterns:

```typescript
try {
  const response = await service.method();
  setSuccessMessage('Operation successful');
} catch (error) {
  setErrorMessage(
    error instanceof Error ? error.message : 'Operation failed'
  );
}
```

For services, throw descriptive errors:
```typescript
if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${errorData.message || 'Request failed'}`);
}
```

### Material UI Usage

Import components from the design system library:
```typescript
import {
  Box,
  Typography,
  Button,
  TextField,
} from '@spec-kit-demo-v2/design-system';
```

Use the `sx` prop for styling:
```typescript
<Box sx={{ py: 4, mb: 2 }}>
  <Typography variant="h3" component="h1" gutterBottom>
    Title
  </Typography>
</Box>
```

Common patterns:
- Use semantic HTML mapping: `<Typography variant="h3" component="h1">`
- Use spacing system: `sx={{ py: 4, px: 2, mb: 3 }}`
- Use theme values: `color="text.secondary"`, `maxWidth="lg"`

## Testing Standards

### Test File Structure

All tests use Jest with React Testing Library:

```typescript
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render initial state correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    render(<ComponentName />);
    
    const button = screen.getByRole('button', { name: 'Click Me' });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Result')).toBeInTheDocument();
    });
  });
});
```

### Hook Testing Pattern

```typescript
import { renderHook, waitFor, act } from '@testing-library/react';
import { useHookName } from './useHookName';

describe('useHookName', () => {
  it('should have initial state with expected values', () => {
    const { result } = renderHook(() => useHookName());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update state when action is performed', async () => {
    const { result } = renderHook(() => useHookName());

    await act(async () => {
      await result.current.fetchData();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeTruthy();
  });
});
```

### MSW Mock Patterns

Use Mock Service Worker for API mocking:

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/endpoint', () => {
    return HttpResponse.json(mockData);
  }),
  
  http.post('/api/endpoint', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, data: body });
  }),
];

// mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

Setup MSW in tests:
```typescript
import { server } from '../mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

Override handlers in specific tests:
```typescript
server.use(
  http.get('/api/endpoint', () => {
    return HttpResponse.json(
      { error: 'NotFound', message: 'Not found', status: 404 },
      { status: 404 }
    );
  })
);
```

### Test Naming Conventions

- Use `describe` for component/hook/service name
- Use nested `describe` for method grouping
- Use `it` or `test` for test cases (prefer `it`)
- Use descriptive test names: "should [expected behavior] when [condition]"

### Assertions

Use Testing Library queries:
- `getByRole`: Preferred for accessibility
- `getByText`: For text content
- `getByLabelText`: For form inputs
- `queryBy*`: When element might not exist
- `findBy*`: For async elements

Use Jest matchers:
- `expect(value).toBe(expected)` for primitives
- `expect(value).toEqual(expected)` for objects/arrays
- `expect(element).toBeInTheDocument()`
- `expect(element).toHaveProperty('key', value)`
- `expect(fn).toThrow(errorMessage)`
- `expect(promise).rejects.toThrow()`

## Documentation Standards

### JSDoc Comments

All exported functions, hooks, interfaces, and types must have JSDoc:

```typescript
/**
 * Brief description of what this does
 *
 * More detailed explanation if needed. Can span multiple lines.
 * Explain the purpose, not the implementation.
 *
 * @param paramName - Description of the parameter
 * @returns Description of return value
 *
 * @example
 * ```tsx
 * const result = functionName('input');
 * console.log(result); // outputs: expected value
 * ```
 */
```

### Interface Documentation

Document all interface properties:

```typescript
/**
 * Represents a form field in the question set system
 */
export interface FormField {
  /** Unique identifier for the field */
  id: string;
  /** Type of form field */
  type: FormFieldType;
  /** Display label for the field */
  label: string;
  /** Whether this field is required for form submission */
  required: boolean;
}
```

### File Headers

Type definition files should have a header comment:

```typescript
/**
 * Type definitions for [domain]
 * This file contains all TypeScript interfaces and types used throughout [feature]
 */
```

## Module Federation Guidelines

### Remote Module Configuration

Each remote must have `module-federation.config.ts`:

```typescript
import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'remoteName',
  exposes: {
    './Module': './src/remote-entry.ts',
  },
  shared: (libraryName, defaultConfig) => {
    // Share core libraries as singletons
    if (
      libraryName === 'react' ||
      libraryName === 'react-dom' ||
      libraryName === 'react-router' ||
      libraryName === 'react-router-dom' ||
      libraryName.startsWith('@mui/') ||
      libraryName.startsWith('@emotion/') ||
      libraryName.startsWith('@spec-kit-demo-v2/design-system')
    ) {
      return {
        ...defaultConfig,
        singleton: true,
        requiredVersion: false,
        eager: false,
      };
    }

    return defaultConfig;
  },
};

export default config;
```

### Remote Entry Pattern

Remote modules expose components through `remote-entry.ts`:

```typescript
export { App } from './app/app';
```

### Host Integration Pattern

Load remote modules using React.lazy in the shell:

```typescript
const RemoteModule = React.lazy(() => import('remoteName/Module'));

// In routes:
<React.Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/route" element={<RemoteModule />} />
  </Routes>
</React.Suspense>
```

## Project-Specific Patterns

### Design System Usage

Always import UI components from the shared design system:

```typescript
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Alert,
} from '@spec-kit-demo-v2/design-system';
```

The design system exports:
- Material UI components
- Custom theme (lightTheme, darkTheme)
- AppTheme provider with color mode support
- Theme configuration (typography, spacing, breakpoints, etc.)

### Theme Provider Pattern

Wrap applications in AppTheme:

```typescript
import { AppTheme } from '@spec-kit-demo-v2/design-system';

function App() {
  return (
    <AppTheme defaultMode="light">
      {/* app content */}
    </AppTheme>
  );
}
```

### Environment Variables

Use NX environment variables with `NX_` prefix:
```typescript
const apiUrl = process.env.NX_API_URL || '/api';
```

### NX Project Configuration

Each project has:
- `project.json`: NX project configuration
- `tsconfig.json`: TypeScript references to app and spec configs
- `tsconfig.app.json`: Application TypeScript config
- `tsconfig.spec.json`: Test TypeScript config
- `jest.config.ts`: Jest configuration
- `eslint.config.mjs`: ESLint configuration

## Code Quality Standards

### TypeScript Strict Mode

Always follow these strict TypeScript rules:
- Enable `strict: true` in tsconfig
- Explicit return types for functions
- No implicit any
- Null checks for optional values
- Proper type narrowing with type guards

### Async/Await Patterns

Always use async/await with proper error handling:

```typescript
async function fetchData() {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch: ${error.message}`);
    }
    throw new Error('Failed to fetch: Unknown error');
  }
}
```

### AbortController for Cancellation

Use AbortController for cancellable operations:

```typescript
const abortControllerRef = useRef<AbortController | null>(null);

useEffect(() => {
  return () => {
    abortControllerRef.current?.abort();
  };
}, []);

const fetchData = useCallback(async (id: string) => {
  // Abort previous request
  abortControllerRef.current?.abort();
  
  const controller = new AbortController();
  abortControllerRef.current = controller;
  
  try {
    const data = await service.getData(id, controller.signal);
    // handle success
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return; // Ignore abort errors
    }
    // handle other errors
  }
}, []);
```

### Accessibility

Follow these accessibility patterns:
- Use semantic HTML elements
- Include proper ARIA labels
- Support keyboard navigation
- Use Material UI's built-in accessibility features
- Test with screen readers

```typescript
<Button
  onClick={handleClick}
  aria-label="Descriptive action"
>
  Click Me
</Button>
```

## General Best Practices

1. **Consistency**: Follow existing patterns exactly as they appear in the codebase
2. **Type Safety**: Never use `any`; use proper TypeScript types
3. **Immutability**: Use const by default, prefer immutable operations
4. **Single Responsibility**: Keep functions and components focused
5. **DRY**: Extract reusable logic into hooks or utility functions
6. **Testing**: Write tests for all new code following established patterns
7. **Documentation**: Document all public APIs with JSDoc
8. **Error Handling**: Always handle errors gracefully with user-friendly messages
9. **Performance**: Use React.memo, useMemo, and useCallback when appropriate
10. **Code Review Ready**: Write self-documenting code that's easy to review

## When in Doubt

1. Search for similar patterns in the existing codebase
2. Prioritize consistency with existing code over external best practices
3. Follow the architectural boundaries defined by NX
4. Test your changes with the established testing patterns
5. Ensure type safety - TypeScript should have no errors
