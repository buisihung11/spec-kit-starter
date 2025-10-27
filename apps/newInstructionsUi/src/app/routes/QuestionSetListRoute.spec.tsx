import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { QuestionSetListRoute } from './QuestionSetListRoute';
import { server } from '../mocks/server';
import { rest } from 'msw';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

/**
 * Helper function to render route with routing context
 */
function renderWithRouter(component: React.ReactElement) {
  return render(<MemoryRouter>{component}</MemoryRouter>);
}

describe('QuestionSetListRoute', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render successfully', () => {
    const { container } = renderWithRouter(<QuestionSetListRoute />);
    expect(container).toBeTruthy();
  });

  it('should render the page title and description', () => {
    renderWithRouter(<QuestionSetListRoute />);
    expect(screen.getByText('Question Set Management')).toBeInTheDocument();
    expect(
      screen.getByText('Select a question set to view and fill out the form')
    ).toBeInTheDocument();
  });

  it('should render the QuestionSetList component', async () => {
    renderWithRouter(<QuestionSetListRoute />);

    // Wait for the list to load
    await waitFor(() => {
      expect(screen.getByText('Available Question Sets')).toBeInTheDocument();
    });
  });

  it('should navigate to form route when form is selected', async () => {
    renderWithRouter(<QuestionSetListRoute />);

    // Wait for question sets to load
    await waitFor(() => {
      expect(screen.getByText('Available Question Sets')).toBeInTheDocument();
    });

    // Find and click a question set item
    const items = screen.getAllByRole('button');
    const functionalItem = items.find(item =>
      item.textContent?.includes('Customer Onboarding')
    );

    if (functionalItem) {
      fireEvent.click(functionalItem);

      // Wait for navigation to be called
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      }, { timeout: 3000 });

      // Verify navigation parameters
      const navigationCall = mockNavigate.mock.calls[0];
      expect(navigationCall[0]).toMatch(/^\/form\//); // URL pattern
      expect(navigationCall[1]).toEqual(
        expect.objectContaining({
          state: expect.objectContaining({
            formData: expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
            }),
          }),
        })
      );
    }
  });

  it('should display error message in Snackbar when form fetch fails', async () => {
    // Override form fetch to fail
    server.use(
      rest.get('/api/question-sets/:id', (req, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json({ error: 'NotFound', message: 'Form not found', status: 404 })
        );
      })
    );

    renderWithRouter(<QuestionSetListRoute />);

    // Wait for question sets to load
    await waitFor(() => {
      expect(screen.getByText('Available Question Sets')).toBeInTheDocument();
    });

    // Click a question set item
    const items = screen.getAllByRole('button');
    const functionalItem = items.find(item =>
      item.textContent?.includes('Customer Onboarding')
    );

    if (functionalItem) {
      fireEvent.click(functionalItem);

      // Wait for error Snackbar to appear
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verify error message content
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/HTTP 404/i);
    }
  });

  it('should close Snackbar when close button is clicked', async () => {
    // Override form fetch to fail
    server.use(
      rest.get('/api/question-sets/:id', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'ServerError', message: 'Server error', status: 500 })
        );
      })
    );

    renderWithRouter(<QuestionSetListRoute />);

    // Wait for question sets to load
    await waitFor(() => {
      expect(screen.getByText('Available Question Sets')).toBeInTheDocument();
    });

    // Click a question set item to trigger error
    const items = screen.getAllByRole('button');
    const functionalItem = items.find(item =>
      item.textContent?.includes('Customer Onboarding')
    );

    if (functionalItem) {
      fireEvent.click(functionalItem);

      // Wait for error Snackbar to appear
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Find and click close button
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      // Snackbar should be removed
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    }
  });

  it('should not navigate when form fetch fails', async () => {
    // Override form fetch to fail
    server.use(
      rest.get('/api/question-sets/:id', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'ServerError', message: 'Server error', status: 500 })
        );
      })
    );

    renderWithRouter(<QuestionSetListRoute />);

    // Wait for question sets to load
    await waitFor(() => {
      expect(screen.getByText('Available Question Sets')).toBeInTheDocument();
    });

    // Click a question set item
    const items = screen.getAllByRole('button');
    const functionalItem = items.find(item =>
      item.textContent?.includes('Customer Onboarding')
    );

    if (functionalItem) {
      fireEvent.click(functionalItem);

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verify navigate was NOT called
      expect(mockNavigate).not.toHaveBeenCalled();
    }
  });

  it('should handle component unmount gracefully', () => {
    const { unmount } = renderWithRouter(<QuestionSetListRoute />);

    // Should not throw error on unmount
    expect(() => unmount()).not.toThrow();
  });
});
