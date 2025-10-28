import { useState, useCallback, useRef } from 'react';
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
   * Cancels any previous in-flight requests
   */
  fetchForm: (questionSetId: string) => Promise<void>;
  /**
   * Function to reset the hook state and abort any ongoing requests
   */
  reset: () => void;
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
  const [state, setState] = useState<{
    formData: FormData | null;
    loading: boolean;
    error: Error | null;
  }>({
    formData: null,
    loading: false,
    error: null,
  });

  // Track the current abort controller to cancel ongoing requests
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetches form data by question set ID
   * Aborts any previous in-flight request to prevent race conditions
   */
  const fetchForm = useCallback(async (questionSetId: string) => {
    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await formService.getFormById(questionSetId, controller.signal);

      // Only update state if this request wasn't aborted
      if (!controller.signal.aborted) {
        setState({
          formData: data,
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      // Don't set error state if the request was aborted (intentional cancellation)
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, don't update error state
        return;
      }

      // Only update error state if this request wasn't aborted
      if (!controller.signal.aborted) {
        setState({
          formData: null,
          loading: false,
          error: err instanceof Error ? err : new Error('Failed to fetch form data'),
        });
      }
    }
  }, []);

  /**
   * Resets the hook state to initial values and aborts any ongoing request
   */
  const reset = useCallback(() => {
    // Abort ongoing request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setState({
      formData: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    formData: state.formData,
    loading: state.loading,
    error: state.error,
    fetchForm,
    reset,
  };
}
