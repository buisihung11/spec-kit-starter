import React, { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';

// Create a new QueryClient for each test to avoid state pollution
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Disable retries in tests
        retry: false,
        // Disable cache time in tests
        gcTime: 0,
        // Disable stale time in tests
        staleTime: 0,
      },
      mutations: {
        // Disable retries in tests
        retry: false,
      },
    },
  });

/**
 * Props for the TestWrapper component
 */
interface TestWrapperProps {
  children: React.ReactNode;
}

/**
 * Test wrapper component that provides necessary context providers for testing
 */
function TestWrapper({ children }: TestWrapperProps) {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * Custom render function that includes all necessary providers
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: TestWrapper, ...options });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };
