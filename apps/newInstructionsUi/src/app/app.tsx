import * as React from 'react';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Typography } from '@spec-kit-demo-v2/design-system';
import { QuestionSetListRoute } from './routes/QuestionSetListRoute';
import { FormRoute } from './routes/FormRoute';

if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start();
}

/**
 * Main application component with routing configuration
 * Initializes MSW for development and sets up routes
 */
export function App() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Routes>
        <Route index element={<QuestionSetListRoute />} />
        <Route path="form/:formId" element={<FormRoute />} />
        <Route
          path="*"
          element={
            <Typography variant="h5" color="error">
              {' '}
              404 - Page Not Found
            </Typography>
          }
        />
      </Routes>
    </Container>
  );
}

export default App;
