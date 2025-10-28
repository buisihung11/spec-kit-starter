import { Alert, Box, Snackbar, Typography } from '@spec-kit-demo-v2/design-system';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FormDisplay } from '../../components/FormDisplay';
import { formService } from '../../services/formService';
import { FormData } from '../../types/questionSet.types';

/**
 * Route component for displaying and submitting a form
 * Handles form submission and navigation back to the list
 */
export function FormRoute() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Location state:', location.state);

  const [formData, setFormData] = useState<FormData | null>(
    location.state?.formData || null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(!formData);

  // Fetch form data if not passed via navigation state
  useEffect(() => {
    async function fetchFormData() {
      if (!formId || formData) return;

      const abortController = new AbortController();

      try {
        setLoading(true);
        const data = await formService.getFormById(formId, abortController.signal);
        setFormData(data);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to load form data'
        );
      } finally {
        setLoading(false);
      }

      return () => {
        abortController.abort();
      };
    }

    fetchFormData();
  }, [formId, formData]);

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    if (!formId) {
      setErrorMessage('No form ID provided');
      return;
    }

    try {
      const response = await formService.submitFormData(formId, data);
      setSuccessMessage(
        `Form submitted successfully! Submission ID: ${response.submissionId}`
      );

      // Navigate back to list after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to submit form'
      );
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="body1">Loading form...</Typography>
      </Box>
    );
  }

  if (!formData) {
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
        formData={formData}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />

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
    </Box>
  );
}

export default FormRoute;
