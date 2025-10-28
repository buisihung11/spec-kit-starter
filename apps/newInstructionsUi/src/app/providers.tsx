import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time of 5 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Default cache time of 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus in production
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

/**
 * Props for the Providers component
 */
export interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Application providers component that wraps the app with necessary context providers
 * including React Query for data fetching and caching
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools - only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}