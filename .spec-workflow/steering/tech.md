# Technology Stack

## Project Type
**Web Application - Microfrontend Module**: The newInstructionsUI is a remotely-loaded React microfrontend that operates as part of a larger claims processing system. It functions as an independent, deployable module that integrates into a host shell application using Module Federation, enabling independent development, deployment, and scaling.

## Core Technologies

### Primary Language(s)
- **Language**: TypeScript 5.9.2
- **Runtime/Compiler**: Babel (configured for React JSX transformation)
- **Language-specific tools**: 
  - pnpm (v10+) for package management
  - TSC for type checking
  - SWC for fast compilation

### Key Dependencies/Libraries

- **React 19.0.0**: UI library for building component-based interfaces
- **React Router v6.29.0 / v7.9.4**: Client-side routing for navigation within the microfrontend
- **Material UI (MUI) v7.3.4**: Component library providing pre-built, accessible UI components following Material Design principles
  - `@mui/material`: Core component library
  - `@mui/icons-material`: Icon set for consistent visual language
- **Emotion v11.14**: CSS-in-JS styling solution (peer dependency of MUI)
  - `@emotion/react`: Core styling runtime
  - `@emotion/styled`: Styled component API
- **Styled Components v5.3.6**: Additional CSS-in-JS library for custom component styling
- **@spec-kit-demo-v2/design-system**: Shared internal design system library providing:
  - Consistent theming (light/dark modes)
  - Custom MUI theme configuration
  - Typography, spacing, and color tokens
  - Reusable component patterns

### Application Architecture
**Microfrontend Architecture with Module Federation**:
- **Pattern**: The application follows a microfrontend pattern where independent applications are composed at runtime
- **Host-Remote Model**: 
  - `shell` application acts as the host, providing the main layout, navigation, and routing
  - `newInstructionsUi` is a remote module that exposes its functionality via Module Federation
- **Runtime Composition**: The remote module is loaded dynamically at runtime, enabling:
  - Independent deployment cycles
  - Version isolation
  - Shared dependency optimization via singleton pattern
- **Component Architecture**: React functional components with hooks for state management and side effects
- **Lazy Loading**: Remote modules are lazy-loaded on demand to optimize initial bundle size

### Data Storage (if applicable)
- **Primary storage**: Backend API integration (details managed by backend team)
- **Local state**: React hooks (useState, useReducer) for component-level state
- **Form state**: To be determined based on form complexity (React Hook Form or similar)
- **Data formats**: JSON for API communication

### External Integrations (if applicable)
- **APIs**: RESTful API endpoints for submitting instructions to the claims processing backend
- **Protocols**: HTTP/REST for synchronous API calls; potential WebSocket integration for real-time status updates
- **Authentication**: Inherited from host shell application (single sign-on pattern)

### Monitoring & Dashboard Technologies (if applicable)
This module itself IS the dashboard/UI for instruction entry. It does not provide its own monitoring infrastructure but may integrate with:
- **Analytics**: Potential integration with enterprise analytics tools for usage tracking
- **Error Monitoring**: Integration with centralized error tracking (e.g., Sentry, DataDog)
- **Performance Monitoring**: Web Vitals tracking for UX metrics

## Development Environment

### Build & Development Tools
- **Build System**: NX v21.6.4 (monorepo build orchestration and task management)
- **Bundler**: Webpack 5 with Module Federation plugin
- **Package Management**: pnpm (workspace-aware, efficient dependency management)
- **Development workflow**: 
  - Hot Module Replacement (HMR) via React Refresh Webpack Plugin
  - Dev server with proxy capabilities for API integration
  - Watch mode for rapid iteration

### Code Quality Tools
- **Static Analysis**: 
  - ESLint v9.8.0 with TypeScript ESLint parser v8.40.0
  - Configured rules for React, hooks, JSX accessibility
- **Formatting**: Prettier v2.6.2 for consistent code style
- **Testing Framework**: 
  - Jest v30.0.2 for unit testing
  - React Testing Library v16.1.0 for component testing
  - Cypress v14.2.1 for end-to-end testing (separate e2e project)
- **Type Checking**: TypeScript compiler with strict mode enabled
- **Documentation**: TSDoc for inline code documentation

### Version Control & Collaboration
- **VCS**: Git
- **Branching Strategy**: Git Flow (feature branches, develop, main)
- **Code Review Process**: Pull request-based reviews with automated CI checks
- **Monorepo Tooling**: NX for managing dependencies between projects and affected project detection

### Dashboard Development (if applicable)
- **Live Reload**: Hot Module Replacement via `@pmmmwh/react-refresh-webpack-plugin`
- **Port Management**: 
  - newInstructionsUi: Port 4201 (configurable in project.json)
  - shell: Port 4200
  - Independent port assignment prevents conflicts
- **Multi-Instance Support**: Module Federation allows multiple remotes to run simultaneously without interference

## Deployment & Distribution

- **Target Platform(s)**: Web browsers (modern evergreen browsers: Chrome, Firefox, Safari, Edge)
- **Distribution Method**: 
  - Remote module deployed to CDN or static hosting
  - Host shell loads remote via URL at runtime
  - Enables independent deployment without redeploying host
- **Installation Requirements**: None for end users (web-based); requires authenticated access to claims processing portal
- **Update Mechanism**: 
  - Remote modules can be updated independently
  - Host shell checks for latest version on page load
  - Cache busting via content-based hashing (outputHashing: 'all' in production)

## Technical Requirements & Constraints

### Performance Requirements
- **Initial Load Time**: Remote bundle should load in <2 seconds on typical enterprise networks
- **Time to Interactive**: <3 seconds after initial paint
- **Bundle Size**: Production bundle optimized to <500KB (gzipped) for the remote entry
- **Memory Usage**: Minimal memory footprint; shared dependencies reduce duplication

### Compatibility Requirements  
- **Platform Support**: Modern web browsers (last 2 versions of Chrome, Firefox, Safari, Edge)
- **Dependency Versions**: 
  - React 19.x (singleton shared with host)
  - MUI v7.x (singleton shared with host)
  - TypeScript ~5.9.2
- **Module Federation Compatibility**: Compatible with Webpack 5 Module Federation v2 specification
- **Standards Compliance**: 
  - WCAG 2.1 Level AA for accessibility (MUI provides baseline compliance)
  - ES2020+ JavaScript standards

### Security & Compliance
- **Security Requirements**: 
  - CSP (Content Security Policy) compliance for script loading
  - XSS prevention via React's built-in escaping
  - Authentication tokens managed by host shell
  - HTTPS-only deployment for production
- **Compliance Standards**: 
  - HIPAA compliance for handling PHI (Protected Health Information) in claims data
  - SOC2 requirements for audit logging
- **Threat Model**: 
  - Input validation to prevent injection attacks
  - Rate limiting at API layer
  - Session management via host application

### Scalability & Reliability
- **Expected Load**: 500-1000 concurrent internal users during peak hours
- **Availability Requirements**: 99.9% uptime during business hours (8am-6pm EST)
- **Growth Projections**: Scale to support 5000+ users as system is adopted enterprise-wide

## Technical Decisions & Rationale

### Decision Log

1. **Module Federation for Microfrontend Architecture**: 
   - **Rationale**: Enables independent deployment of UI modules without redeploying the entire portal. Allows the newInstructionsUI team to iterate quickly without coordination overhead with other teams.
   - **Alternatives Considered**: iframes (rejected due to styling and communication complexity), monolithic SPA (rejected due to deployment coupling)
   - **Trade-offs**: Increased complexity in shared dependency management; requires coordination on breaking changes to shared libraries

2. **Material UI v7 as Component Library**: 
   - **Rationale**: Enterprise-grade component library with excellent accessibility, theming, and documentation. Reduces development time by 40-60% compared to building custom components. Already adopted across the organization.
   - **Alternatives Considered**: Ant Design (less familiar to team), custom components (too time-consuming)
   - **Trade-offs**: Larger bundle size; learning curve for advanced customization

3. **TypeScript with Strict Mode**: 
   - **Rationale**: Type safety reduces runtime errors and improves code maintainability. Strict mode catches potential bugs at compile time, particularly important for data entry forms where validation is critical.
   - **Alternatives Considered**: JavaScript (rejected for lack of type safety), Flow (less ecosystem support)
   - **Trade-offs**: Slightly slower development for type annotations; requires team TypeScript proficiency

4. **NX Monorepo**: 
   - **Rationale**: Unified build system for shell and remote modules. Dependency graph management ensures consistent builds. Affected project detection optimizes CI/CD pipelines.
   - **Alternatives Considered**: Lerna (less modern), separate repos (coordination overhead)
   - **Trade-offs**: Learning curve for NX CLI; some configuration complexity

5. **Shared Design System Library**: 
   - **Rationale**: Ensures visual consistency across all microfrontends. Centralizes theme configuration and common component patterns. Singleton sharing reduces bundle duplication.
   - **Alternatives Considered**: Duplicated styling per module (inconsistency risk), external package (slower iteration)
   - **Trade-offs**: Breaking changes to design system require coordinated updates across modules

## Known Limitations

- **Module Federation Version Compatibility**: Breaking changes in shared dependencies (React, MUI) require coordinated upgrades across all microfrontends. Mitigated by semantic versioning and communication protocols.

- **Runtime Dependency Resolution**: If the host and remote have conflicting dependency versions, runtime errors can occur. Mitigated by enforcing singleton pattern and version alignment in CI/CD.

- **Initial Setup Complexity**: Configuring webpack and Module Federation requires expertise. Once configured, changes are minimal. Mitigated by NX's abstractions and generator schematics.

- **Testing Isolation**: Unit tests don't fully validate Module Federation integration. Addressed by dedicated integration tests in the e2e project that test the composed application.

- **Performance Monitoring Gaps**: Limited visibility into remote module performance in production. Future enhancement: integrate with RUM (Real User Monitoring) tools for microfrontend-specific metrics.
