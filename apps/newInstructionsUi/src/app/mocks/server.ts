import { handlers } from './handlers';

// Lazy initialization to ensure globals are available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let serverInstance: any = null;

export const server = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listen: (options?: any) => {
    if (!serverInstance) {
      // Dynamic import to ensure globals are set
      const { setupServer } = require('msw/node');
      serverInstance = setupServer(...handlers);
    }
    return serverInstance.listen(options);
  },
  resetHandlers: () => {
    if (serverInstance) {
      serverInstance.resetHandlers();
    }
  },
  close: () => {
    if (serverInstance) {
      serverInstance.close();
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  use: (...handlers: any[]) => {
    if (serverInstance) {
      serverInstance.use(...handlers);
    }
  },
};
