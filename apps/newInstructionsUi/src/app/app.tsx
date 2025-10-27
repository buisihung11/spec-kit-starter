import * as React from 'react';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@spec-kit-demo-v2/design-system';
import { QuestionSetListRoute } from './routes/QuestionSetListRoute';
import { FormRoute } from './routes/FormRoute';

/**
 * Main application component with routing configuration
 * Initializes MSW for development and sets up routes
 */
export function App() {
  // Initialize MSW in development mode
  useEffect(() => {
    async function initMSW() {
      console.log('NODE_ENV:', process.env.NODE_ENV);
      if (process.env.NODE_ENV === 'development') {
        try {
          const { worker } = await import('./mocks/browser');
          await worker.start({
            // serviceWorker: {
            //   url: 'https://localhost:4201/mockServiceWorker.js',
            // },
            onUnhandledRequest: 'bypass',
          });
          console.log('[MSW] Mocking enabled');
        } catch (error) {
          console.error('[MSW] Failed to start:', error);
        }
      }
    }

    initMSW();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Routes>
        <Route path="/" element={<QuestionSetListRoute />} />
        <Route path="/form/:formId" element={<FormRoute />} />
      </Routes>
    </Container>
  );
}

export default App;

