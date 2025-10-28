import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Box,
  Typography,
  Stack,
  Button,
  Alert,
  CircularProgress,
} from '@spec-kit-demo-v2/design-system';
import { FormSection } from './FormSection';
import { useFormService } from '../../hooks/useFormService';
import type { FormData } from '../../types/questionSet.types';

/**
 * Props for the FormDisplay component
 */
export interface FormDisplayProps {
  /** The form ID to fetch and display. If provided, will fetch form data automatically */
  formId?: string;
  /** The form data containing sections and fields. If provided, will use this instead of fetching */
  formData?: FormData | null;
  /** Loading state for the form submission (not for fetching) */
  isLoading?: boolean;
  /** Error state for the form submission (not for fetching) */
  error?: string | null;
  /** Callback fired when form is submitted */
  onSubmit?: (data: Record<string, unknown>) => void;
  /** Callback fired when form is cancelled */
  onCancel?: () => void;
  /** Callback fired when form data is successfully fetched */
  onFormFetched?: (formData: FormData) => void;
  /** Callback fired when form fetching fails */
  onFetchError?: (error: Error) => void;
}

/**
 * Form display container component that renders a complete form with sections.
 *
 * Can operate in two modes:
 * 1. Controlled mode: Pass formData prop directly (skips fetching)
 * 2. Fetch mode: Pass formId prop to fetch form data automatically
 *
 * Uses React Hook Form for form state management and validation.
 * Renders loading and error states, and handles form submission.
 * Wraps the form in a FormProvider for nested field access.
 *
 * @param props - Component props
 * @returns Rendered form display
 *
 * @example
 * ```tsx
 * // Controlled mode
 * <FormDisplay
 *   formData={formData}
 *   isLoading={loading}
 *   error={error}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 *
 * // Fetch mode
 * <FormDisplay
 *   formId="123"
 *   onFormFetched={handleFormFetched}
 *   onFetchError={handleFetchError}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export function FormDisplay({
  formId,
  formData: formDataProp,
  isLoading = false,
  error = null,
  onSubmit,
  onCancel,
  onFormFetched,
  onFetchError,
}: FormDisplayProps): React.ReactElement {
  const {
    formData: fetchedFormData,
    loading: fetchLoading,
    error: fetchError,
    fetchForm,
  } = useFormService();

  // Fetch form data if formId is provided and no formData prop
  useEffect(() => {
    if (formId && !formDataProp) {
      fetchForm(formId);
    }
  }, [formId, formDataProp, fetchForm]);

  // Notify parent when form data is fetched
  useEffect(() => {
    if (fetchedFormData && onFormFetched) {
      onFormFetched(fetchedFormData);
    }
  }, [fetchedFormData, onFormFetched]);

  // Notify parent when fetch error occurs
  useEffect(() => {
    if (fetchError && onFetchError) {
      onFetchError(fetchError);
    }
  }, [fetchError, onFetchError]);

  // Use prop formData if provided, otherwise use fetched data
  const formData = formDataProp || fetchedFormData;
  const isLoadingData = fetchLoading || isLoading;
  const displayError = error || (fetchError?.message);

  const methods = useForm({
    mode: 'onBlur',
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmitForm = handleSubmit((data) => {
    if (onSubmit) {
      onSubmit(data);
    }
  });

  // Loading state
  if (isLoadingData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">
            Loading form...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // Error state
  if (displayError) {
    return (
      <Box p={3}>
        <Alert severity="error">{displayError}</Alert>
      </Box>
    );
  }

  // No form data state
  if (!formData) {
    return (
      <Box p={3}>
        <Alert severity="info">No form data available</Alert>
      </Box>
    );
  }

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={onSubmitForm}
        noValidate
        sx={{
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          p: 3,
        }}
      >
        {/* Form Title and Description */}
        {(formData.title || formData.description) && (
          <Box mb={4}>
            {formData.title && (
              <Typography variant="h4" component="h2" gutterBottom>
                {formData.title}
              </Typography>
            )}
            {formData.description && (
              <Typography variant="body1" color="text.secondary">
                {formData.description}
              </Typography>
            )}
          </Box>
        )}

        {/* Form Sections */}
        {formData.sections?.map((section) => (
          <FormSection
            key={section.id}
            section={section}
            control={control}
            errors={errors}
          />
        ))}

        {/* Form Actions */}
        <Box
          mt={4}
          display="flex"
          justifyContent="flex-end"
          gap={2}
        >
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
}
