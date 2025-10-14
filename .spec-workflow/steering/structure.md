# Project Structure

## Directory Organization

```
spec-kit-demo-v2/                          # Monorepo root
├── apps/                                   # Application projects
│   ├── newInstructionsUi/                 # Claims instruction entry UI (Remote Module)
│   │   ├── src/
│   │   │   ├── app/                       # Application components
│   │   │   │   ├── app.tsx               # Root component
│   │   │   │   └── app.spec.tsx          # Component tests
│   │   │   ├── assets/                    # Static assets (images, fonts)
│   │   │   ├── bootstrap.tsx              # Application bootstrap logic
│   │   │   ├── main.ts                    # Entry point for standalone mode
│   │   │   ├── remote-entry.ts            # Module Federation export point
│   │   │   ├── index.html                 # HTML template
│   │   │   └── favicon.ico                # Application icon
│   │   ├── module-federation.config.ts    # MF configuration for remote
│   │   ├── webpack.config.ts              # Development webpack config
│   │   ├── webpack.config.prod.ts         # Production webpack config
│   │   ├── project.json                   # NX project configuration
│   │   ├── tsconfig.json                  # TypeScript base config
│   │   ├── tsconfig.app.json              # App-specific TS config
│   │   ├── tsconfig.spec.json             # Test-specific TS config
│   │   ├── jest.config.ts                 # Jest test configuration
│   │   └── eslint.config.mjs              # ESLint configuration
│   │
│   ├── newInstructionsUi-e2e/             # E2E tests for newInstructionsUi
│   │   ├── src/
│   │   │   ├── e2e/                       # Test scenarios
│   │   │   ├── fixtures/                  # Test data
│   │   │   └── support/                   # Test utilities
│   │   ├── cypress.config.ts              # Cypress configuration
│   │   └── project.json                   # NX project configuration
│   │
│   ├── shell/                              # Host application (Shell)
│   │   ├── src/
│   │   │   ├── app/                       # Application components
│   │   │   ├── components/                # Shared layout components
│   │   │   │   ├── Layout.tsx            # Main layout wrapper
│   │   │   │   ├── Navbar.tsx            # Navigation bar
│   │   │   │   ├── Home.tsx              # Home page
│   │   │   │   └── Login.tsx             # Login page
│   │   │   ├── bootstrap.tsx              # Bootstrap with MF setup
│   │   │   ├── main.ts                    # Entry point
│   │   │   └── index.html                 # HTML template
│   │   ├── module-federation.config.ts    # MF configuration for host
│   │   ├── webpack.config.ts              # Webpack configuration
│   │   └── project.json                   # NX project configuration
│   │
│   └── shell-e2e/                          # E2E tests for shell
│
├── libs/                                   # Shared libraries
│   └── design-system/                     # Shared design system
│       ├── src/
│       │   ├── index.ts                   # Public API exports
│       │   └── theme/                     # MUI theme configuration
│       │       ├── theme.ts              # Theme creation
│       │       ├── palette.ts            # Color palette
│       │       ├── typography.ts         # Typography system
│       │       ├── components.ts         # Component overrides
│       │       ├── breakpoints.ts        # Responsive breakpoints
│       │       ├── spacing.ts            # Spacing scale
│       │       ├── shape.ts              # Border radius, etc.
│       │       ├── shadows.ts            # Shadow definitions
│       │       └── AppTheme.tsx          # Theme provider component
│       ├── package.json                   # Library package config
│       ├── project.json                   # NX project configuration
│       ├── vite.config.ts                 # Vite build config
│       └── tsconfig.lib.json              # Library TS config
│
├── .spec-workflow/                         # Spec workflow system
│   ├── templates/                         # Document templates
│   ├── steering/                          # Steering documents
│   └── specs/                             # Feature specifications
│
├── coverage/                               # Test coverage reports
├── dist/                                   # Build output (gitignored)
├── node_modules/                           # Dependencies (gitignored)
│
├── nx.json                                 # NX workspace configuration
├── package.json                            # Root package.json
├── pnpm-lock.yaml                          # Locked dependencies
├── pnpm-workspace.yaml                     # pnpm workspace config
├── tsconfig.base.json                      # Base TypeScript config
├── jest.config.ts                          # Root Jest config
├── jest.preset.js                          # Jest preset
└── eslint.config.mjs                       # Root ESLint config
```

## Naming Conventions

### Files
- **Components**: `PascalCase.tsx` (e.g., `Layout.tsx`, `Navbar.tsx`)
- **Utilities/Helpers**: `camelCase.ts` (e.g., `formatDate.ts`, `apiClient.ts`)
- **Tests**: `[filename].spec.tsx` or `[filename].test.tsx` (e.g., `app.spec.tsx`)
- **Config Files**: `kebab-case.ts` or `kebab-case.mjs` (e.g., `jest.config.ts`, `eslint.config.mjs`)
- **Barrel Exports**: `index.ts` for re-exporting module contents

### Code
- **React Components**: `PascalCase` (e.g., `InstructionForm`, `SubmitButton`)
- **Functions/Methods**: `camelCase` (e.g., `handleSubmit`, `validateForm`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_FILE_SIZE`, `API_ENDPOINT`)
- **Interfaces/Types**: `PascalCase` with `I` prefix for interfaces optional (e.g., `InstructionData`, `FormState`)
- **Variables**: `camelCase` (e.g., `instructionId`, `isSubmitting`)

### Directories
- **Feature Modules**: `camelCase` (e.g., `components`, `services`, `hooks`)
- **Application Projects**: `camelCase` (e.g., `newInstructionsUi`, `shell`)
- **Library Projects**: `kebab-case` (e.g., `design-system`, `shared-utils`)

## Import Patterns

### Import Order
1. **External dependencies** (React, third-party libraries)
2. **NX workspace libraries** (using path aliases)
3. **Relative imports** (within the same project)
4. **Style imports** (CSS/styled-components)

Example:
```typescript
// 1. External dependencies
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

// 2. Workspace libraries
import { lightTheme } from '@spec-kit-demo-v2/design-system';

// 3. Relative imports
import { InstructionForm } from './components/InstructionForm';
import { validateInstruction } from '../utils/validation';

// 4. Style imports (if needed)
import './styles.css';
```

### Module/Package Organization
- **Path Aliases**: Defined in `tsconfig.base.json` for workspace libraries
  - `@spec-kit-demo-v2/design-system` → `libs/design-system/src/index.ts`
  - `newInstructionsUi/Module` → `apps/newInstructionsUi/src/remote-entry.ts`
- **Absolute Imports**: Use path aliases for cross-project imports
- **Relative Imports**: Use for intra-project imports (`./ ../`)
- **Barrel Exports**: Each module has an `index.ts` that exports its public API

## Code Structure Patterns

### React Component File Organization
```typescript
// 1. Imports (external, workspace, relative)
import React, { useState, useEffect } from 'react';
import { Button, Box } from '@spec-kit-demo-v2/design-system';
import { formatDate } from '../utils/dateUtils';

// 2. Type/Interface definitions
interface InstructionFormProps {
  onSubmit: (data: InstructionData) => void;
  initialData?: InstructionData;
}

// 3. Constants
const MAX_DESCRIPTION_LENGTH = 500;

// 4. Main component
export function InstructionForm({ onSubmit, initialData }: InstructionFormProps) {
  // Component logic
}

// 5. Helper functions (if small and component-specific)
function validateFormData(data: InstructionData): boolean {
  // Validation logic
}

// 6. Styled components (if using styled-components)
const StyledContainer = styled(Box)`
  padding: 16px;
`;

// 7. Default export (if needed)
export default InstructionForm;
```

### Function/Method Organization
- **Input validation** first (guard clauses)
- **Core logic** in the middle
- **Error handling** throughout (try-catch where appropriate)
- **Clear return points** (early returns for edge cases)

### File Organization Principles
- **Single Responsibility**: Each file exports one primary component/utility
- **Public API at Top**: Main exports near the top of the file
- **Implementation Details Below**: Helper functions and styled components at bottom
- **Colocation**: Related files grouped together (component + test + styles)

## Code Organization Principles

1. **Single Responsibility**: Each file/component should have one clear purpose
   - Components focus on presentation or a single feature
   - Utilities handle one type of operation (e.g., date formatting, API calls)

2. **Modularity**: Code organized into reusable, independent modules
   - Shared libraries (design-system) for cross-cutting concerns
   - Feature-based organization within apps

3. **Testability**: Structure code to be easily testable
   - Pure functions for business logic
   - Separation of concerns (UI vs logic)
   - Dependency injection for services

4. **Consistency**: Follow patterns established in the codebase
   - Consistent component structure across the app
   - Uniform naming conventions
   - Predictable directory layouts

## Module Boundaries

### Workspace Library Boundaries
- **design-system** → Apps: Shared UI components, theme, and styling utilities
  - Apps depend on design-system
  - design-system has no dependencies on apps
  - Maintains visual consistency across all microfrontends

### Application Boundaries
- **shell** (Host) → **newInstructionsUi** (Remote): 
  - Shell loads newInstructionsUi via Module Federation at runtime
  - newInstructionsUi can be developed/deployed independently
  - Both share dependencies (React, MUI) via singleton pattern
  - Communication via props and routing

### Dependency Direction
```
Apps (shell, newInstructionsUi)
    ↓ (depends on)
Shared Libraries (design-system)
    ↓ (depends on)
External Dependencies (React, MUI, etc.)
```

**Rules**:
- Libraries cannot import from apps
- Apps can import from libraries via path aliases
- Circular dependencies are forbidden (enforced by NX)
- Remote modules expose functionality via `remote-entry.ts`

### Module Federation Boundaries
- **Exposed Modules**: Only components explicitly exported in `module-federation.config.ts` are accessible
- **Shared Dependencies**: Defined in MF config to prevent duplication
- **Singleton Pattern**: React, React Router, MUI enforced as singletons
- **Version Alignment**: Host and remotes must agree on major versions of shared deps

## Code Size Guidelines

### File Size
- **Component Files**: Aim for <300 lines; refactor into smaller components if exceeded
- **Utility Files**: <200 lines; split into multiple utilities if needed
- **Test Files**: No strict limit, but group related tests logically

### Function/Method Size
- **Functions**: Aim for <50 lines; extract helper functions if needed
- **React Components**: <100 lines for component body; extract sub-components or hooks

### Class/Module Complexity
- **Cyclomatic Complexity**: Keep below 10 per function (enforced by ESLint)
- **Nesting Depth**: Maximum 4 levels of nesting; use early returns

### NX Project Organization
- **Apps**: Entry points for deployable applications
- **Libraries**: Reusable code shared across apps
- **E2E Projects**: Separate projects for end-to-end tests

## Microfrontend Structure

### Remote Module Structure (newInstructionsUi)
```
newInstructionsUi/
├── src/
│   ├── app/                  # Main application components
│   │   └── app.tsx          # Root component exported via remote-entry
│   ├── components/           # Feature components (to be added)
│   ├── hooks/                # Custom React hooks (to be added)
│   ├── services/             # API clients, business logic (to be added)
│   ├── types/                # TypeScript type definitions (to be added)
│   ├── utils/                # Utility functions (to be added)
│   ├── remote-entry.ts       # Module Federation export point
│   ├── bootstrap.tsx         # Lazy-loaded application initialization
│   └── main.ts               # Entry point (loads bootstrap)
```

### Host Application Structure (shell)
```
shell/
├── src/
│   ├── app/                  # Main app component
│   ├── components/           # Shared layout components
│   │   ├── Layout.tsx       # Wraps all pages
│   │   ├── Navbar.tsx       # Navigation
│   │   ├── Home.tsx         # Home page
│   │   └── Login.tsx        # Login page
│   ├── routes/               # Route definitions (to be added)
│   ├── bootstrap.tsx         # MF-aware bootstrap
│   └── main.ts               # Entry point
```

### Separation of Concerns
- **Remote Module** (newInstructionsUi): Self-contained instruction entry functionality
  - Independent development and deployment
  - Own routing within the module
  - Minimal coupling to host shell
  - Can be loaded into multiple hosts

- **Host Shell**: Application container and navigation
  - Provides authentication context
  - Manages global layout and navigation
  - Lazy-loads remote modules on demand
  - Coordinates shared state (if needed)

## Documentation Standards

- **Component Documentation**: Use JSDoc comments for all public components
  - Describe component purpose
  - Document props with types and descriptions
  - Include usage examples for complex components

- **Complex Logic**: Inline comments for non-obvious business logic
  - Explain "why" not "what"
  - Document edge cases and assumptions

- **README Files**: Each major module/library should have a README
  - Purpose and overview
  - Setup instructions
  - Usage examples
  - Development guidelines

- **Type Documentation**: TypeScript types serve as documentation
  - Use descriptive type names
  - Add JSDoc comments for complex types
  - Export public interfaces from `index.ts`

## Testing Structure

### Unit Tests
- **Location**: Colocated with source files (e.g., `app.spec.tsx` next to `app.tsx`)
- **Naming**: `[filename].spec.tsx` or `[filename].test.tsx`
- **Coverage Target**: 80%+ for critical business logic

### Integration Tests
- **Location**: Within app's `src` directory, in `__tests__` folder (if needed)
- **Focus**: Testing component interactions, form submissions, API integration

### E2E Tests
- **Location**: Separate `-e2e` projects (e.g., `newInstructionsUi-e2e`)
- **Structure**: 
  - `src/e2e/` - Test scenarios
  - `src/fixtures/` - Test data
  - `src/support/` - Page objects and utilities
- **Focus**: User workflows, cross-module interactions, Module Federation integration
