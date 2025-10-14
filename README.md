# Spec-Kit Demo v2 - Microfrontend Architecture

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A modern microfrontend application built with NX, React, Material UI, and Module Federation.

## 🏗️ Architecture

This project demonstrates a microfrontend architecture with:

- **Shell Application**: The host application that provides the main layout, navigation, and shared components
- **New Instructions UI**: A remote microfrontend module that can be independently developed and deployed

## 🛠️ Tech Stack

- **NX v21.6.4**: Monorepo management and build orchestration
- **React 18**: UI library
- **React Router**: Client-side routing
- **Material UI v6**: Component library for consistent design
- **Module Federation**: Webpack 5 feature for microfrontend architecture
- **TypeScript**: Type safety
- **Styled Components**: CSS-in-JS styling

## 📁 Project Structure

```
spec-kit-demo-v2/
├── apps/
│   ├── shell/                      # Host application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   └── app.tsx        # Main app component
│   │   │   ├── components/
│   │   │   │   ├── Layout.tsx     # Main layout wrapper
│   │   │   │   ├── Navbar.tsx     # Navigation bar
│   │   │   │   ├── Home.tsx       # Home page
│   │   │   │   └── Login.tsx      # Login page
│   │   │   └── main.tsx
│   │   └── module-federation.config.ts
│   │
│   └── newInstructionsUi/         # Remote microfrontend
│       ├── src/
│       │   ├── app/
│       │   │   └── app.tsx        # Remote app component
│       │   └── remote-entry.ts
│       └── module-federation.config.ts
│
├── package.json
└── nx.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- **pnpm** (v10 or higher) - [Install pnpm](https://pnpm.io/installation)

### Installation

Dependencies are already installed. If you need to reinstall:
```bash
pnpm install
```

### Development

#### Run the entire application (shell + remotes):

```bash
pnpm nx serve shell
```

This command will:
- Start the shell application on http://localhost:4200
- Automatically build and serve the remote applications
- Enable hot reload for both shell and remotes

#### Run with dev remotes (recommended for development):

```bash
pnpm nx serve shell --devRemotes=newInstructionsUi
```

This enables hot module replacement for the remote app.

#### Run individual applications:

**Shell only:**
```bash
pnpm nx serve shell
```

**Remote only:**
```bash
pnpm nx serve newInstructionsUi
```

The remote will be available at http://localhost:4201

### Build

#### Build all applications:
```bash
pnpm nx run-many -t build
```

#### Build specific application:
```bash
pnpm nx build shell
pnpm nx build newInstructionsUi
```

## 🎨 Features

### Shell Application

- **Responsive Navigation**: Material UI AppBar with mobile-friendly menu
- **User Menu**: Login and profile options
- **Layout System**: Consistent layout with header, main content, and footer
- **Theme Management**: Centralized Material UI theme configuration
- **Routing**: React Router integration for navigation

### New Instructions UI (Remote)

- **Independent Module**: Loaded dynamically via Module Federation
- **Placeholder UI**: Ready-to-extend interface for instruction management
- **Shared Dependencies**: Uses the same React, Material UI, and routing instances as the host

## 🔧 Module Federation Configuration

Both applications share dependencies to avoid duplication:

- `react` and `react-dom` (singleton)
- `react-router` and `react-router-dom` (singleton)
- All `@mui/*` packages (singleton)
- All `@emotion/*` packages (singleton)

This ensures:
- Consistent versions across all microfrontends
- Reduced bundle size
- Single React instance
- Shared context and state management capabilities

## 📝 Available Scripts

- `pnpm nx serve shell` - Start development server for shell app
- `pnpm nx serve shell --devRemotes=newInstructionsUi` - Serve with hot reload for remote
- `pnpm nx serve newInstructionsUi` - Start development server for remote app
- `pnpm nx build shell` - Build shell for production
- `pnpm nx build newInstructionsUi` - Build remote for production
- `pnpm nx test shell` - Run tests for shell app
- `pnpm nx lint shell` - Lint shell app
- `pnpm nx graph` - View dependency graph

> **Note**: This project uses **pnpm** as the package manager. See [PNPM_GUIDE.md](./PNPM_GUIDE.md) for detailed information.

## 🎯 Next Steps

1. **Add Authentication**: Implement real authentication logic in the Login component
2. **State Management**: Add Redux or Context API for global state
3. **API Integration**: Connect to backend services
4. **Add More Remotes**: Create additional microfrontend modules
5. **Testing**: Add comprehensive unit and E2E tests
6. **CI/CD**: Set up automated deployment pipelines
7. **Performance**: Optimize bundle sizes and loading strategies

## 📚 Learn More

- [NX Documentation](https://nx.dev)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Material UI](https://mui.com/)
- [React Router](https://reactrouter.com/)

## 🤝 Contributing

This is a demo project. Feel free to use it as a starting point for your own microfrontend architecture.

---

**Built with ❤️ using NX, React, and Material UI**

[Learn more about this workspace setup and its capabilities](https://nx.dev/getting-started/intro#learn-nx?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Run tasks

To run tasks with Nx use:

```sh
npx nx <target> <project-name>
```

For example:

```sh
npx nx build myproject
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

To install a new plugin you can use the `nx add` command. Here's an example of adding the React plugin:
```sh
npx nx add @nx/react
```

Use the plugin's generator to create new projects. For example, to create a new React app or library:

```sh
# Generate an app
npx nx g @nx/react:app demo

# Generate a library
npx nx g @nx/react:lib some-lib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/intro#learn-nx?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
