import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  Snackbar,
} from '@spec-kit-demo-v2/design-system';
import { QuestionSetList } from './components/QuestionSetList';
import { FormDisplay } from './components/FormDisplay';
import { FormData } from './types/questionSet.types';
import { formService } from './services/formService';

type ViewType = 'list' | 'form';

export function App() {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleFormSelected = (formData: FormData) => {
    setSelectedForm(formData);
    setCurrentView('form');
  };

  const handleError = (error: Error) => {
    setErrorMessage(error.message);
  };

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    if (!selectedForm) {
      setErrorMessage('No form selected');
      return;
    }

    try {
      const response = await formService.submitFormData(selectedForm.id, data);
      setSuccessMessage(
        `Form submitted successfully! Submission ID: ${response.submissionId}`
      );
      setCurrentView('list');
      setSelectedForm(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to submit form'
      );
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedForm(null);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Question Set Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {currentView === 'list'
            ? 'Select a question set to view and fill out the form'
            : 'Complete the form below and submit'}
        </Typography>
      </Box>

      {currentView === 'list' && (
        <QuestionSetList
          onFormSelected={handleFormSelected}
          onError={handleError}
        />
      )}

      {currentView === 'form' && selectedForm && (
        <FormDisplay
          formData={selectedForm}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;

