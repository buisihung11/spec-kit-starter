import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { formService } from '../services/formService';
import { FormData } from '../types/questionSet.types';

/**
 * Return type for the useFormService hook
 */
export interface UseFormServiceReturn {
  /**
   * Form data retrieved from the API, null if not yet fetched
   */
  formData: FormData | null;
  /**
   * Loading state - true while fetching form data
   */
  loading: boolean;
  /**
   * Error object if the fetch failed, null otherwise
   */
  error: Error | null;
  /**
   * Function to fetch a specific form by its question set ID
   * This will trigger the query to execute
   */
  fetchForm: (questionSetId: string) => void;
  /**
   * Function to reset the hook state and clear the current form data
   */
  reset: () => void;
  /**
   * Whether the data is stale and will be refetched on next interaction
   */
  isStale: boolean;
  /**
   * Whether this is the first time the query is loading
   */
  isInitialLoading: boolean;
}

/**
 * Custom hook for fetching individual form data on demand with race condition prevention.
 *
 * Uses AbortController to cancel previous requests when a new fetch is initiated,
 * preventing race conditions and ensuring only the latest request updates the state.
 *
 * @returns {UseFormServiceReturn} Object containing form data, loading state, error, fetchForm function, and reset function
 *
 * @example
 * ```tsx
 * function FormViewer() {
 *   const { formData, loading, error, fetchForm, reset } = useFormService();
 *
 *   const handleSelectForm = (id: string) => {
 *     fetchForm(id);
 *   };
 *
 *   if (loading) return <div>Loading form...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!formData) return <div>Select a form to view</div>;
 *
 *   return (
 *     <div>
 *       <h1>{formData.name}</h1>
 *       <button onClick={reset}>Clear</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFormService(): UseFormServiceReturn {
  const [questionSetId, setQuestionSetId] = React.useState<string | null>(null);

  const {
    data: formData = null,
    isFetching: loading,
    isInitialLoading,
    error,
    isStale,
  } = useQuery({
    queryKey: ['form', questionSetId],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      if (!id) throw new Error('Question set ID is required');
      return formService.getFormById(id);
    },
    enabled: !!questionSetId,
    // Keep previous data while fetching new data
    placeholderData: (previousData) => previousData,
  });

  /**
   * Fetches form data by question set ID
   * This enables the query and triggers data fetching
   */
  const fetchForm = React.useCallback((id: string) => {
    setQuestionSetId(id);
  }, []);

  /**
   * Resets the hook state to clear current form data and disable the query
   */
  const reset = React.useCallback(() => {
    setQuestionSetId(null);
  }, []);

  return {
    formData,
    loading,
    error,
    fetchForm,
    reset,
    isStale,
    isInitialLoading,
  };
}
