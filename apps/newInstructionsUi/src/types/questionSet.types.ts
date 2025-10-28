/**
 * Type definitions for question sets and forms
 * This file contains all TypeScript interfaces and types used throughout the question set list UI
 */

/**
 * Represents a question set in the system
 */
export interface QuestionSet {
  /** Unique identifier for the question set */
  id: string;
  /** Display name of the question set */
  name: string;
  /** Detailed description of what this question set is for */
  description: string;
  /** Whether this is a functional question set (vs informational) */
  isFunctional: boolean;
  /** Category classification for organization */
  category: string;
  /** ISO timestamp of last update */
  lastUpdated: string;
  /** Version string for tracking changes */
  version: string;
}

/**
 * Complete form data structure
 */
export interface FormData {
  /** Unique identifier for the form */
  id: string;
  /** Display name of the form */
  name: string;
  /** Version string for the form */
  version: string;
  /** Optional display title for the form */
  title?: string;
  /** Optional description of the form */
  description?: string;
  /** Ordered array of form sections */
  sections: FormSection[];
  /** Optional flat array of questions for backward compatibility */
  questions?: FormField[];
  /** Optional array of pre-organized steps for multi-step forms */
  steps?: FormStepData[];
  /** Additional metadata about the form */
  metadata: FormMetadata;
  /** Reference to the question set this form belongs to */
  questionSetId: string;
}

/**
 * Represents a step in a multi-step form workflow
 */
export interface FormStepData {
  /** Unique identifier for the step */
  id: string;
  /** Display title for the step */
  title: string;
  /** Optional description of what this step contains */
  description?: string;
  /** Order position within the multi-step form (lower numbers appear first) */
  order?: number;
  /** Array of questions/fields belonging to this step */
  questions: FormField[];
}

/**
 * A section within a form containing multiple fields
 */
export interface FormSection {
  /** Unique identifier for the section */
  id: string;
  /** Display title for the section */
  title: string;
  /** Description of what this section contains */
  description: string;
  /** Order position within the form (lower numbers appear first) */
  order: number;
  /** Array of fields within this section */
  fields: FormField[];
}

/**
 * Individual field within a form section
 */
export interface FormField {
  /** Unique identifier for the field */
  id: string;
  /** Type of form field */
  type: FormFieldType;
  /** Display label for the field */
  label: string;
  /** Whether this field is required for form submission */
  required: boolean;
  /** Placeholder text shown when field is empty */
  placeholder?: string;
  /** Validation rules for this field */
  validation?: ValidationRule[];
  /** Available options for select/radio fields */
  options?: FieldOption[];
  /** Default value for the field */
  defaultValue?: unknown;
  /** Optional category for grouping or filtering fields */
  category?: string;
}

/**
 * Union type for all supported form field types
 */
export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'number'
  | 'email'
  | 'phone';

/**
 * Validation rule for form fields
 */
export interface ValidationRule {
  /** Type of validation (required, minLength, maxLength, pattern, etc.) */
  type: string;
  /** Value for validation (e.g., minimum length, regex pattern) */
  value?: unknown;
  /** Error message to display when validation fails */
  message: string;
}

/**
 * Option for select/radio/checkbox fields
 */
export interface FieldOption {
  /** Display label for the option */
  label: string;
  /** Value stored when this option is selected */
  value: string | number | boolean;
}

/**
 * Metadata associated with a form
 */
export interface FormMetadata {
  /** ISO timestamp when the form was created */
  createdAt: string;
  /** ISO timestamp when the form was last updated */
  updatedAt: string;
  /** Author/creator of the form */
  author: string;
}

/**
 * Response from the question sets API endpoint
 */
export interface QuestionSetsResponse {
  /** Array of question sets */
  data: QuestionSet[];
  /** Total number of question sets available */
  total: number;
}

/**
 * Response from the form detail API endpoint
 */
export interface FormDetailResponse {
  /** Complete form data */
  data: FormData;
}

/**
 * Response from the form submission API endpoint
 */
export interface SubmissionResponse {
  /** Unique identifier for the submission */
  submissionId: string;
  /** ISO timestamp of when the submission was processed */
  timestamp: string;
}

/**
 * Error response from API endpoints
 */
export interface ApiErrorResponse {
  /** Error type identifier */
  error: string;
  /** Human-readable error message */
  message: string;
  /** HTTP status code */
  status: number;
}
