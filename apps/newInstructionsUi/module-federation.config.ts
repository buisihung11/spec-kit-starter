import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'newInstructionsUi',
  exposes: {
    './Module': './src/remote-entry.ts',
  },
  shared: (libraryName, defaultConfig) => {
    // Share all core libraries as singletons
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

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
