import { Alert, Box, Snackbar, Typography } from '@spec-kit-demo-v2/design-system';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormDisplay } from '../../components/FormDisplay';
import { useFormSubmission } from '../../hooks/useFormSubmission';
import { FormData } from '../../types/questionSet.types';

/**
 * Route component for displaying and submitting a form
 * Handles form submission and navigation back to the list
 */
export function FormRoute() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();

  // Use TanStack Query hook for form submission
  const { submitForm, isSubmitting, submissionError, isSuccess, reset: resetSubmission } = useFormSubmission();

  // State for tracking fetch errors
  const [fetchError, setFetchError] = useState<Error | null>(null);

  const handleFormFetched = (formData: FormData) => {
    // Form data successfully fetched
    console.log('Form fetched:', formData.id);
  };

  const handleFetchError = (error: Error) => {
    setFetchError(error);
  };

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    if (!formId) {
      console.error('No form ID provided');
      return;
    }

    try {
      await submitForm(formId, data);
      // Navigation will be handled by useEffect watching isSuccess
    } catch (error) {
      // Error is handled by the hook
      console.error('Form submission failed:', error);
    }
  };

  // Handle successful submission
  useEffect(() => {
    if (isSuccess) {
      // Navigate back to list after successful submission
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const handleCancel = () => {
    navigate('/');
  };

  const handleCloseSnackbar = () => {
    resetSubmission();
  };

  const handleCloseFetchError = () => {
    setFetchError(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Question Set Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete the form below and submit
        </Typography>
      </Box>

      <FormDisplay
        formId={formId}
        isLoading={isSubmitting}
        error={submissionError?.message || null}
        onFormFetched={handleFormFetched}
        onFetchError={handleFetchError}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />

      <Snackbar
        open={isSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Form submitted successfully! Redirecting...
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!submissionError}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {submissionError?.message || 'Failed to submit form'}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!fetchError}
        autoHideDuration={6000}
        onClose={handleCloseFetchError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseFetchError} severity="error" sx={{ width: '100%' }}>
          {fetchError?.message || 'Failed to load form'}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default FormRoute;
