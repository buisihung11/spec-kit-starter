import { useState, useEffect, useCallback } from 'react';
import { formService } from '../services/formService';
import { QuestionSet } from '../types/questionSet.types';

/**
 * Return type for the useQuestionSets hook
 */
export interface UseQuestionSetsReturn {
  /**
   * Array of question sets retrieved from the API
   */
  questionSets: QuestionSet[];
  /**
   * Loading state - true while fetching data
   */
  loading: boolean;
  /**
   * Error object if the fetch failed, null otherwise
   */
  error: Error | null;
  /**
   * Function to manually trigger a refetch of question sets
   */
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing question sets data.
 *
 * Automatically fetches question sets on mount and provides a refetch function
 * for manual refreshing. Manages loading and error states.
 *
 * @returns {UseQuestionSetsReturn} Object containing question sets data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function QuestionSetsList() {
 *   const { questionSets, loading, error, refetch } = useQuestionSets();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message} <button onClick={refetch}>Retry</button></div>;
 *
 *   return (
 *     <ul>
 *       {questionSets.map(qs => <li key={qs.id}>{qs.name}</li>)}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useQuestionSets(): UseQuestionSetsReturn {
  const [state, setState] = useState<{
    questionSets: QuestionSet[];
    loading: boolean;
    error: Error | null;
  }>({
    questionSets: [],
    loading: true,
    error: null,
  });

  /**
   * Fetches question sets from the API and updates state
   */
  const fetchQuestionSets = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await formService.getQuestionSets();
      setState({
        questionSets: data,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState({
        questionSets: [],
        loading: false,
        error: err instanceof Error ? err : new Error('Failed to fetch question sets'),
      });
    }
  }, []);

  // Fetch question sets on mount
  useEffect(() => {
    fetchQuestionSets();
  }, [fetchQuestionSets]);

  return {
    questionSets: state.questionSets,
    loading: state.loading,
    error: state.error,
    refetch: fetchQuestionSets,
  };
}
