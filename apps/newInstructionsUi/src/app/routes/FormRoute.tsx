import { Alert, Box, Snackbar, Typography } from '@spec-kit-demo-v2/design-system';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FormDisplay } from '../../components/FormDisplay';
import { useFormService } from '../../hooks/useFormService';
import { useFormSubmission } from '../../hooks/useFormSubmission';
import { FormData } from '../../types/questionSet.types';

/**
 * Route component for displaying and submitting a form
 * Handles form submission and navigation back to the list
 */
export function FormRoute() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Use TanStack Query hooks for data fetching and mutations
  const { formData, loading, error, fetchForm } = useFormService();
  const { submitForm, isSubmitting, submissionError, isSuccess, reset: resetSubmission } = useFormSubmission();

  // Fetch form data on mount if we have a formId and no formData from navigation state
  useEffect(() => {
    const formDataFromState = location.state?.formData;
    if (formId && !formDataFromState && !formData) {
      fetchForm(formId);
    }
  }, [formId, location.state?.formData, formData, fetchForm]);

  // Use form data from navigation state or fetched data
  const currentFormData = location.state?.formData || formData;

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

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="body1">Loading form...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="body1" color="error">
          Error loading form: {error.message}
        </Typography>
      </Box>
    );
  }

  if (!currentFormData) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="body1" color="error">
          Form not found
        </Typography>
      </Box>
    );
  }

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
        formData={currentFormData}
        isLoading={isSubmitting}
        error={submissionError?.message || null}
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
    </Box>
  );
}

export default FormRoute;
