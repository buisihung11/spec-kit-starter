import React from 'react';
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
import type { FormData } from '../../types/questionSet.types';

/**
 * Props for the FormDisplay component
 */
export interface FormDisplayProps {
  /** The form data containing sections and fields */
  formData: FormData | null;
  /** Loading state for the form */
  isLoading?: boolean;
  /** Error state for the form */
  error?: string | null;
  /** Callback fired when form is submitted */
  onSubmit?: (data: Record<string, unknown>) => void;
  /** Callback fired when form is cancelled */
  onCancel?: () => void;
}

/**
 * Form display container component that renders a complete form with sections.
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
 * <FormDisplay
 *   formData={formData}
 *   isLoading={loading}
 *   error={error}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export function FormDisplay({
  formData,
  isLoading = false,
  error = null,
  onSubmit,
  onCancel,
}: FormDisplayProps): React.ReactElement {
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
  if (isLoading) {
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
  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
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
