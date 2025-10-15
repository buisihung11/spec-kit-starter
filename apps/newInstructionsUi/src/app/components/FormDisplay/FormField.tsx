import React from 'react';
import { Controller, Control, FieldError } from 'react-hook-form';
import {
  TextField,
  Select,
  Radio,
  RadioGroup,
  Checkbox,
  FormControl,
  FormLabel,
  FormHelperText,
  MenuItem,
  InputLabel,
  FormControlLabel,
} from '@spec-kit-demo-v2/design-system';
import type { FormField, ValidationRule } from '../../types/questionSet.types';

/**
 * Props for the FormFieldComponent
 */
export interface FormFieldProps {
  /** The field configuration to render */
  field: FormField;
  /** React Hook Form control object */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  /** Optional field error from React Hook Form */
  error?: FieldError;
}

/**
 * Builds validation rules for React Hook Form from field configuration.
 *
 * @param field - The form field configuration
 * @returns Validation rules object for React Hook Form
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildValidationRules(field: FormField): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rules: Record<string, any> = {};

  if (field.required) {
    rules.required = `${field.label} is required`;
  }

  if (field.validation) {
    field.validation.forEach((rule: ValidationRule) => {
      switch (rule.type) {
        case 'minLength':
          rules.minLength = {
            value: rule.value as number,
            message: rule.message || `Minimum length is ${rule.value}`,
          };
          break;
        case 'maxLength':
          rules.maxLength = {
            value: rule.value as number,
            message: rule.message || `Maximum length is ${rule.value}`,
          };
          break;
        case 'min':
          rules.min = {
            value: rule.value as number,
            message: rule.message || `Minimum value is ${rule.value}`,
          };
          break;
        case 'max':
          rules.max = {
            value: rule.value as number,
            message: rule.message || `Maximum value is ${rule.value}`,
          };
          break;
        case 'pattern':
          rules.pattern = {
            value: new RegExp(rule.value as string),
            message: rule.message || 'Invalid format',
          };
          break;
        case 'email':
          rules.pattern = {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: rule.message || 'Invalid email address',
          };
          break;
      }
    });
  }

  return rules;
}

/**
 * Form field component that renders appropriate input based on field type.
 *
 * Uses React Hook Form Controller for integration with form state management.
 * Supports various field types including text, email, select, radio, checkbox, etc.
 *
 * @param props - Component props
 * @returns Rendered form field
 *
 * @example
 * ```tsx
 * <FormFieldComponent
 *   field={fieldConfig}
 *   control={control}
 *   error={errors.fieldName}
 * />
 * ```
 */
export function FormFieldComponent({
  field,
  control,
  error,
}: FormFieldProps): React.ReactElement {
  const rules = buildValidationRules(field);

  return (
    <Controller
      name={field.id}
      control={control}
      rules={rules}
      defaultValue={field.defaultValue || ''}
      render={({ field: controllerField }) => {
        // Text, Email, Phone fields
        if (['text', 'email', 'phone'].includes(field.type)) {
          return (
            <TextField
              {...controllerField}
              label={field.label}
              placeholder={field.placeholder}
              required={field.required}
              fullWidth
              error={!!error}
              helperText={error?.message}
              type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            />
          );
        }

        // Textarea
        if (field.type === 'textarea') {
          return (
            <TextField
              {...controllerField}
              label={field.label}
              placeholder={field.placeholder}
              required={field.required}
              fullWidth
              multiline
              rows={4}
              error={!!error}
              helperText={error?.message}
            />
          );
        }

        // Number field
        if (field.type === 'number') {
          return (
            <TextField
              {...controllerField}
              label={field.label}
              placeholder={field.placeholder}
              required={field.required}
              fullWidth
              type="number"
              error={!!error}
              helperText={error?.message}
            />
          );
        }

        // Date field
        if (field.type === 'date') {
          return (
            <TextField
              {...controllerField}
              label={field.label}
              placeholder={field.placeholder}
              required={field.required}
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!error}
              helperText={error?.message}
            />
          );
        }

        // Select dropdown
        if (field.type === 'select') {
          return (
            <FormControl fullWidth error={!!error} required={field.required}>
              <InputLabel>{field.label}</InputLabel>
              <Select
                {...controllerField}
                label={field.label}
              >
                {field.options?.map((option) => (
                  <MenuItem key={String(option.value)} value={String(option.value)}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          );
        }

        // Radio buttons
        if (field.type === 'radio') {
          return (
            <FormControl component="fieldset" error={!!error} required={field.required}>
              <FormLabel component="legend">{field.label}</FormLabel>
              <RadioGroup {...controllerField}>
                {field.options?.map((option) => (
                  <FormControlLabel
                    key={String(option.value)}
                    value={String(option.value)}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          );
        }

        // Checkbox
        if (field.type === 'checkbox') {
          return (
            <FormControl error={!!error}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...controllerField}
                    checked={controllerField.value || false}
                  />
                }
                label={field.label}
              />
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          );
        }

        // Fallback for unknown types
        return (
          <TextField
            {...controllerField}
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            fullWidth
            error={!!error}
            helperText={error?.message}
          />
        );
      }}
    />
  );
}
