import { renderHook, waitFor } from '@testing-library/react';
import { useQuestionSets } from './useQuestionSets';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('useQuestionSets', () => {
  it('should have initial state with loading=true', () => {
    const { result } = renderHook(() => useQuestionSets());

    expect(result.current.loading).toBe(true);
    expect(result.current.questionSets).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch and set question sets data on mount', async () => {
    const { result } = renderHook(() => useQuestionSets());

    // Wait for the data to be fetched
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.questionSets).toHaveLength(2);
    expect(result.current.questionSets[0]).toHaveProperty('id');
    expect(result.current.questionSets[0]).toHaveProperty('name');
    expect(result.current.questionSets[0]).toHaveProperty('isFunctional');
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    // Override the handler to return an error
    server.use(
      http.get('/api/question-sets', () => {
        return HttpResponse.json(
          { error: 'ServerError', message: 'Internal server error', status: 500 },
          { status: 500 }
        );
      })
    );

    const { result } = renderHook(() => useQuestionSets());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.questionSets).toEqual([]);
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('Failed to fetch question sets');
  });

  it('should handle network errors', async () => {
    // Override the handler to return a network error
    server.use(
      http.get('/api/question-sets', () => {
        return HttpResponse.error();
      })
    );

    const { result } = renderHook(() => useQuestionSets());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.questionSets).toEqual([]);
    expect(result.current.error).toBeTruthy();
  });

  it('should refetch data when refetch is called', async () => {
    const { result } = renderHook(() => useQuestionSets());

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialData = result.current.questionSets;

    // Override the handler to return different data
    server.use(
      http.get('/api/question-sets', () => {
        return HttpResponse.json({
          data: [
            {
              id: '3',
              name: 'New Question Set',
              description: 'A new question set',
              isFunctional: true,
              category: 'New Category',
              lastUpdated: '2025-10-15T00:00:00Z',
              version: '1.0.0',
            },
          ],
          total: 1,
        });
      })
    );

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.questionSets).toHaveLength(1);
      expect(result.current.questionSets[0].id).toBe('3');
    });

    expect(result.current.questionSets).not.toEqual(initialData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle refetch with error', async () => {
    const { result } = renderHook(() => useQuestionSets());

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Override the handler to return an error for refetch
    server.use(
      http.get('/api/question-sets', () => {
        return HttpResponse.json(
          { error: 'ServerError', message: 'Server error on refetch', status: 500 },
          { status: 500 }
        );
      })
    );

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.questionSets).toEqual([]);
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('Failed to fetch question sets');
  });

  it('should set loading state during refetch', async () => {
    const { result } = renderHook(() => useQuestionSets());

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Trigger refetch (don't await)
    const refetchPromise = result.current.refetch();

    // Check that loading is set to true
    expect(result.current.loading).toBe(true);

    await refetchPromise;

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
