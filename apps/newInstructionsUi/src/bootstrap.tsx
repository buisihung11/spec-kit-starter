import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';

// Start MSW browser worker in development mode
async function enableMocking() {
  console.log('NODE_ENV:', process.env.NODE_ENV);
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.log('Mocking enabled');

  const { worker } = await import('./app/mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests in dev
  });
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
