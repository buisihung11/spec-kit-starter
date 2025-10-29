import { renderHook, waitFor } from '@testing-library/react';
import { useQuestionSets } from './useQuestionSets';
import { server } from '../mocks/server';
import { rest } from 'msw';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Helper to create a fresh QueryClient for each test and a wrapper
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  return Wrapper;
};

describe('useQuestionSets', () => {
  it('should have initial state with loading=true', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useQuestionSets(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.questionSets).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch and set question sets data on mount', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useQuestionSets(), { wrapper });

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
      rest.get('/api/question-sets', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'ServerError', message: 'Internal server error', status: 500 })
        );
      })
    );

    const wrapper = createWrapper();
    const { result } = renderHook(() => useQuestionSets(), { wrapper });

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
      rest.get('/api/question-sets', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Network error' }));
      })
    );

    const wrapper = createWrapper();
    const { result } = renderHook(() => useQuestionSets(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.questionSets).toEqual([]);
    expect(result.current.error).toBeTruthy();
  });

  it('should refetch data when refetch is called', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useQuestionSets(), { wrapper });

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialData = result.current.questionSets;

    // Override the handler to return different data
    server.use(
      rest.get('/api/question-sets', (req, res, ctx) => {
        return res(
          ctx.json({
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
          })
        );
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
    const wrapper = createWrapper();
    const { result } = renderHook(() => useQuestionSets(), { wrapper });

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Store the initial successful data
    const initialData = result.current.questionSets;
    expect(initialData).toHaveLength(2);

    // Override the handler to return an error for refetch
    server.use(
      rest.get('/api/question-sets', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'ServerError', message: 'Server error on refetch', status: 500 })
        );
      })
    );

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    // TanStack Query keeps previous data on error (due to placeholderData)
    // This is expected behavior to prevent UI flicker
    expect(result.current.questionSets).toEqual(initialData);
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('Failed to fetch question sets');
  });
});
