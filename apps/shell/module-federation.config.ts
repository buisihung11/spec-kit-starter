import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'shell',
  remotes: ['newInstructionsUi'],
  shared: (libraryName, defaultConfig) => {
    // Share all core libraries as singletons
    if (
      libraryName === 'react' ||
      libraryName === 'react-dom' ||
      libraryName === 'react-router' ||
      libraryName === 'react-router-dom' ||
      libraryName.startsWith('@mui/') ||
      libraryName.startsWith('@emotion/')
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
