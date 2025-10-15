import React from 'react';
import { Control, FieldErrors, FieldError } from 'react-hook-form';
import {
  Paper,
  Typography,
  Stack,
  Divider,
} from '@spec-kit-demo-v2/design-system';
import { FormFieldComponent } from './FormField';
import type { FormSection as FormSectionType } from '../../types/questionSet.types';

/**
 * Props for the FormSection component
 */
export interface FormSectionProps {
  /** The section configuration containing title, description, and fields */
  section: FormSectionType;
  /** React Hook Form control object */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  /** Field errors from React Hook Form */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
}

/**
 * Form section component that groups related form fields together.
 *
 * Renders a Paper container with an optional title and description,
 * followed by all fields in the section. Uses Divider to separate
 * the header from the fields.
 *
 * @param props - Component props
 * @returns Rendered form section
 *
 * @example
 * ```tsx
 * <FormSection
 *   section={sectionConfig}
 *   control={control}
 *   errors={errors}
 * />
 * ```
 */
export function FormSection({
  section,
  control,
  errors,
}: FormSectionProps): React.ReactElement {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
      }}
    >
      {/* Section Header */}
      {(section.title || section.description) && (
        <>
          <Stack spacing={1} mb={2}>
            {section.title && (
              <Typography variant="h6" component="h3">
                {section.title}
              </Typography>
            )}
            {section.description && (
              <Typography variant="body2" color="text.secondary">
                {section.description}
              </Typography>
            )}
          </Stack>
          <Divider sx={{ mb: 3 }} />
        </>
      )}

      {/* Form Fields */}
      <Stack spacing={3}>
        {section.fields.map((field) => (
          <FormFieldComponent
            key={field.id}
            field={field}
            control={control}
            error={errors[field.id] as FieldError | undefined}
          />
        ))}
      </Stack>
    </Paper>
  );
}
