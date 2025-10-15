/**
 * Data validation utilities for API response data
 * These functions ensure data integrity from API responses using TypeScript type guards
 */

import type {
  QuestionSet,
  FormData,
  FormSection,
  FormField,
  FormFieldType,
  ValidationRule,
  FieldOption,
  FormMetadata,
  SubmissionResponse,
  FormStepData,
} from '../types/questionSet.types';

/**
 * Valid form field types
 */
const VALID_FIELD_TYPES: FormFieldType[] = [
  'text',
  'textarea',
  'select',
  'multiselect',
  'radio',
  'checkbox',
  'date',
  'number',
  'email',
  'phone',
];

/**
 * Type guard to check if value is a non-null object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if value is a string
 */
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard to check if value is a boolean
 */
function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard to check if value is a number
 */
function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Validates a single QuestionSet object
 * @param data - The data to validate
 * @returns The validated QuestionSet object
 * @throws Error if validation fails with descriptive message
 */
export function validateQuestionSet(data: unknown): QuestionSet {
  if (!isObject(data)) {
    throw new Error('QuestionSet validation failed: data must be an object');
  }

  // Validate required string fields
  if (!isString(data.id) || data.id.trim() === '') {
    throw new Error('QuestionSet validation failed: id must be a non-empty string');
  }

  if (!isString(data.name) || data.name.trim() === '') {
    throw new Error('QuestionSet validation failed: name must be a non-empty string');
  }

  if (!isString(data.description)) {
    throw new Error('QuestionSet validation failed: description must be a string');
  }

  if (!isBoolean(data.isFunctional)) {
    throw new Error('QuestionSet validation failed: isFunctional must be a boolean');
  }

  if (!isString(data.category)) {
    throw new Error('QuestionSet validation failed: category must be a string');
  }

  if (!isString(data.lastUpdated)) {
    throw new Error('QuestionSet validation failed: lastUpdated must be a string');
  }

  if (!isString(data.version)) {
    throw new Error('QuestionSet validation failed: version must be a string');
  }

  return data as unknown as QuestionSet;
}

/**
 * Validates an array of QuestionSet objects
 * @param data - The data to validate
 * @returns The validated array of QuestionSet objects
 * @throws Error if validation fails with descriptive message
 */
export function validateQuestionSets(data: unknown): QuestionSet[] {
  if (!Array.isArray(data)) {
    throw new Error('QuestionSets validation failed: data must be an array');
  }

  return data.map((item, index) => {
    try {
      return validateQuestionSet(item);
    } catch (error) {
      throw new Error(
        `QuestionSets validation failed at index ${index}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });
}

/**
 * Validates a FieldOption object
 */
function validateFieldOption(data: unknown, fieldId: string): FieldOption {
  if (!isObject(data)) {
    throw new Error(`Field ${fieldId}: option must be an object`);
  }

  if (!isString(data.label)) {
    throw new Error(`Field ${fieldId}: option label must be a string`);
  }

  if (
    !isString(data.value) &&
    !isNumber(data.value) &&
    !isBoolean(data.value)
  ) {
    throw new Error(`Field ${fieldId}: option value must be a string, number, or boolean`);
  }

  return data as unknown as FieldOption;
}

/**
 * Validates a ValidationRule object
 */
function validateValidationRule(data: unknown, fieldId: string): ValidationRule {
  if (!isObject(data)) {
    throw new Error(`Field ${fieldId}: validation rule must be an object`);
  }

  if (!isString(data.type)) {
    throw new Error(`Field ${fieldId}: validation rule type must be a string`);
  }

  if (!isString(data.message)) {
    throw new Error(`Field ${fieldId}: validation rule message must be a string`);
  }

  return data as unknown as ValidationRule;
}

/**
 * Validates a FormField object
 */
function validateFormField(data: unknown, context: string): FormField {
  if (!isObject(data)) {
    throw new Error(`${context}: field must be an object`);
  }

  if (!isString(data.id) || data.id.trim() === '') {
    throw new Error(`${context}: field id must be a non-empty string`);
  }

  if (!isString(data.type) || !VALID_FIELD_TYPES.includes(data.type as FormFieldType)) {
    throw new Error(
      `${context}: field type must be one of: ${VALID_FIELD_TYPES.join(', ')}`
    );
  }

  if (!isString(data.label)) {
    throw new Error(`${context}: field label must be a string`);
  }

  if (!isBoolean(data.required)) {
    throw new Error(`${context}: field required must be a boolean`);
  }

  // Validate optional fields
  if (data.placeholder !== undefined && !isString(data.placeholder)) {
    throw new Error(`${context}: field placeholder must be a string if provided`);
  }

  if (data.category !== undefined && !isString(data.category)) {
    throw new Error(`${context}: field category must be a string if provided`);
  }

  if (data.validation !== undefined) {
    if (!Array.isArray(data.validation)) {
      throw new Error(`${context}: field validation must be an array if provided`);
    }
    data.validation.forEach((rule: unknown) => validateValidationRule(rule, data.id as string));
  }

  if (data.options !== undefined) {
    if (!Array.isArray(data.options)) {
      throw new Error(`${context}: field options must be an array if provided`);
    }
    data.options.forEach((option: unknown) => validateFieldOption(option, data.id as string));
  }

  return data as unknown as FormField;
}

/**
 * Validates a FormSection object
 */
function validateFormSection(data: unknown, index: number): FormSection {
  if (!isObject(data)) {
    throw new Error(`FormSection at index ${index} must be an object`);
  }

  if (!isString(data.id) || data.id.trim() === '') {
    throw new Error(`FormSection at index ${index}: id must be a non-empty string`);
  }

  if (!isString(data.title)) {
    throw new Error(`FormSection at index ${index}: title must be a string`);
  }

  if (!isString(data.description)) {
    throw new Error(`FormSection at index ${index}: description must be a string`);
  }

  if (!isNumber(data.order)) {
    throw new Error(`FormSection at index ${index}: order must be a number`);
  }

  if (!Array.isArray(data.fields)) {
    throw new Error(`FormSection at index ${index}: fields must be an array`);
  }

  data.fields.forEach((field: unknown, fieldIndex: number) => {
    validateFormField(field, `FormSection ${data.id} field at index ${fieldIndex}`);
  });

  return data as unknown as FormSection;
}

/**
 * Validates a FormStepData object
 */
function validateFormStepData(data: unknown, index: number): FormStepData {
  if (!isObject(data)) {
    throw new Error(`FormStepData at index ${index} must be an object`);
  }

  if (!isString(data.id) || data.id.trim() === '') {
    throw new Error(`FormStepData at index ${index}: id must be a non-empty string`);
  }

  if (!isString(data.title)) {
    throw new Error(`FormStepData at index ${index}: title must be a string`);
  }

  if (data.description !== undefined && !isString(data.description)) {
    throw new Error(`FormStepData at index ${index}: description must be a string if provided`);
  }

  if (data.order !== undefined && !isNumber(data.order)) {
    throw new Error(`FormStepData at index ${index}: order must be a number if provided`);
  }

  if (!Array.isArray(data.questions)) {
    throw new Error(`FormStepData at index ${index}: questions must be an array`);
  }

  data.questions.forEach((field: unknown, fieldIndex: number) => {
    validateFormField(field, `FormStepData ${data.id} question at index ${fieldIndex}`);
  });

  return data as unknown as FormStepData;
}

/**
 * Validates a FormMetadata object
 */
function validateFormMetadata(data: unknown): FormMetadata {
  if (!isObject(data)) {
    throw new Error('FormData validation failed: metadata must be an object');
  }

  if (!isString(data.createdAt)) {
    throw new Error('FormData validation failed: metadata.createdAt must be a string');
  }

  if (!isString(data.updatedAt)) {
    throw new Error('FormData validation failed: metadata.updatedAt must be a string');
  }

  if (!isString(data.author)) {
    throw new Error('FormData validation failed: metadata.author must be a string');
  }

  return data as unknown as FormMetadata;
}

/**
 * Validates a complete FormData object
 * @param data - The data to validate
 * @returns The validated FormData object
 * @throws Error if validation fails with descriptive message
 */
export function validateFormData(data: unknown): FormData {
  if (!isObject(data)) {
    throw new Error('FormData validation failed: data must be an object');
  }

  // Validate required string fields
  if (!isString(data.id) || data.id.trim() === '') {
    throw new Error('FormData validation failed: id must be a non-empty string');
  }

  if (!isString(data.name) || data.name.trim() === '') {
    throw new Error('FormData validation failed: name must be a non-empty string');
  }

  if (!isString(data.version)) {
    throw new Error('FormData validation failed: version must be a string');
  }

  if (!isString(data.questionSetId)) {
    throw new Error('FormData validation failed: questionSetId must be a string');
  }

  // Validate optional string fields
  if (data.title !== undefined && !isString(data.title)) {
    throw new Error('FormData validation failed: title must be a string if provided');
  }

  if (data.description !== undefined && !isString(data.description)) {
    throw new Error('FormData validation failed: description must be a string if provided');
  }

  // Validate sections array (required)
  if (!Array.isArray(data.sections)) {
    throw new Error('FormData validation failed: sections must be an array');
  }

  data.sections.forEach((section: unknown, index: number) => {
    validateFormSection(section, index);
  });

  // Validate optional questions array
  if (data.questions !== undefined) {
    if (!Array.isArray(data.questions)) {
      throw new Error('FormData validation failed: questions must be an array if provided');
    }
    data.questions.forEach((field: unknown, index: number) => {
      validateFormField(field, `questions array at index ${index}`);
    });
  }

  // Validate optional steps array
  if (data.steps !== undefined) {
    if (!Array.isArray(data.steps)) {
      throw new Error('FormData validation failed: steps must be an array if provided');
    }
    data.steps.forEach((step: unknown, index: number) => {
      validateFormStepData(step, index);
    });
  }

  // Validate metadata
  validateFormMetadata(data.metadata);

  return data as unknown as FormData;
}

/**
 * Validates a SubmissionResponse object
 * @param data - The data to validate
 * @returns The validated SubmissionResponse object
 * @throws Error if validation fails with descriptive message
 */
export function validateSubmissionResponse(data: unknown): SubmissionResponse {
  if (!isObject(data)) {
    throw new Error('SubmissionResponse validation failed: data must be an object');
  }

  if (!isString(data.submissionId) || data.submissionId.trim() === '') {
    throw new Error(
      'SubmissionResponse validation failed: submissionId must be a non-empty string'
    );
  }

  if (!isString(data.timestamp)) {
    throw new Error('SubmissionResponse validation failed: timestamp must be a string');
  }

  return data as unknown as SubmissionResponse;
}
