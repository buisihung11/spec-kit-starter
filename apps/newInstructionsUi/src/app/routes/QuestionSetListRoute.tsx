import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Snackbar, Alert } from '@spec-kit-demo-v2/design-system';
import { QuestionSetList } from '../components/QuestionSetList';
import { FormData } from '../types/questionSet.types';

/**
 * Route component for displaying the question set list
 * Allows users to browse and select question sets
 */
export function QuestionSetListRoute() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFormSelected = (formData: FormData) => {
    // Navigate to form route with state
    navigate(`/form/${formData.id}`, { state: { formData } });
  };

  const handleError = (error: Error) => {
    setErrorMessage(error.message);
  };

  const handleCloseSnackbar = () => {
    setErrorMessage(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Question Set Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select a question set to view and fill out the form
        </Typography>
      </Box>

      <QuestionSetList
        onFormSelected={handleFormSelected}
        onError={handleError}
      />

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
    </Box>
  );
}

export default QuestionSetListRoute;
