import { Container, Typography } from '@spec-kit-demo-v2/design-system';
import { Route, Routes } from 'react-router-dom';
import { Providers } from './providers';
import { FormRoute } from './routes/FormRoute';
import { QuestionSetListRoute } from './routes/QuestionSetListRoute';

if (process.env.NODE_ENV === 'development') {
  const { worker } = require('../mocks/browser');
  worker.start();
}

/**
 * Main application component with routing configuration
 * Initializes MSW for development and sets up routes
 */
export function App() {
  return (
    <Providers>
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
    </Providers>
  );
}

export default App;
