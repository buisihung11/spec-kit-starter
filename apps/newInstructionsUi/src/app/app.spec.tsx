import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import App from './app';

// Create a test QueryClient
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

/**
 * Helper function to render App with routing context
 */
function renderWithRouter(initialRoute = '/') {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe('App', () => {
  it('should render successfully', () => {
    const { container } = renderWithRouter();
    expect(container).toBeTruthy();
  });

  describe('Root Route', () => {
    it('should render the question set list route by default', () => {
      renderWithRouter('/');
      expect(screen.getByText('Question Set Management')).toBeInTheDocument();
      expect(
        screen.getByText('Select a question set to view and fill out the form')
      ).toBeInTheDocument();
    });
  });
});
