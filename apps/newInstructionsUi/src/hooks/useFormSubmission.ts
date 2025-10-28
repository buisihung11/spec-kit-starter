import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formService } from '../services/formService';
import { SubmissionResponse } from '../types/questionSet.types';

/**
 * Return type for the useFormSubmission hook
 */
export interface UseFormSubmissionReturn {
  /**
   * Function to submit form data
   */
  submitForm: (formId: string, data: Record<string, unknown>) => Promise<SubmissionResponse>;
  /**
   * Whether the mutation is currently loading
   */
  isSubmitting: boolean;
  /**
   * Error from the last submission attempt, if any
   */
  submissionError: Error | null;
  /**
   * Whether the last submission was successful
   */
  isSuccess: boolean;
  /**
   * Reset the mutation state
   */
  reset: () => void;
}

/**
 * Custom hook for submitting form data using TanStack Query mutations.
 *
 * Provides optimistic updates, error handling, and loading states for form submission.
 * Automatically invalidates related queries on successful submission.
 *
 * @returns {UseFormSubmissionReturn} Object containing submit function and mutation state
 *
 * @example
 * ```tsx
 * function FormComponent() {
 *   const { submitForm, isSubmitting, submissionError, isSuccess } = useFormSubmission();
 *
 *   const handleSubmit = async (data: Record<string, unknown>) => {
 *     try {
 *       await submitForm('form-id', data);
 *       // Handle success
 *     } catch (error) {
 *       // Error is already handled by the hook
 *     }
 *   };
 *
 *   if (isSubmitting) return <div>Submitting...</div>;
 *   if (submissionError) return <div>Error: {submissionError.message}</div>;
 *   if (isSuccess) return <div>Success!</div>;
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useFormSubmission(): UseFormSubmissionReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ formId, data }: { formId: string; data: Record<string, unknown> }) =>
      formService.submitFormData(formId, data),
    onSuccess: (data, variables) => {
      // Invalidate related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['questionSets'] });
      // Could also invalidate form data if needed
      queryClient.invalidateQueries({ queryKey: ['form', variables.formId] });
    },
    // Retry failed submissions once
    retry: 1,
    // Retry delay for submissions
    retryDelay: 1000,
  });

  const submitForm = async (formId: string, data: Record<string, unknown>): Promise<SubmissionResponse> => {
    return mutation.mutateAsync({ formId, data });
  };

  return {
    submitForm,
    isSubmitting: mutation.isPending,
    submissionError: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}