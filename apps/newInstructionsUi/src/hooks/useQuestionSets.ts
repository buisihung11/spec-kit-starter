import { useQuery } from '@tanstack/react-query';
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
  refetch: () => Promise<{ data: QuestionSet[] | undefined }>;
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
 * Custom hook for fetching and managing question sets data using TanStack Query.
 *
 * Automatically fetches question sets on mount with caching, background refetching,
 * and error handling provided by TanStack Query.
 *
 * @returns {UseQuestionSetsReturn} Object containing question sets data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function QuestionSetsList() {
 *   const { questionSets, loading, error, refetch } = useQuestionSets();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message} <button onClick={() => refetch()}>Retry</button></div>;
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
  const {
    data: questionSets = [],
    isPending: loading,
    isInitialLoading,
    error,
    refetch,
    isStale,
  } = useQuery({
    queryKey: ['questionSets'],
    queryFn: () => formService.getQuestionSets(),
    // Keep previous data while fetching new data
    placeholderData: (previousData) => previousData,
  });

  return {
    questionSets,
    loading,
    error,
    refetch,
    isStale,
    isInitialLoading,
  };
}
