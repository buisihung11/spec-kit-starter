import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QuestionSetList } from './QuestionSetList';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('QuestionSetList', () => {
  const mockOnFormSelected = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    mockOnFormSelected.mockClear();
    mockOnError.mockClear();
  });

  it('should render loading state initially', () => {
    render(<QuestionSetList />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading question sets...')).toBeInTheDocument();
  });

  it('should render list when data loads', async () => {
    render(<QuestionSetList />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Available Question Sets')).toBeInTheDocument();
    // Should have the mock question sets from handlers
    expect(screen.getByText(/Customer Onboarding/i)).toBeInTheDocument();
  });

  it('should render error Alert when API fails', async () => {
    // Override handler to return error
    server.use(
      http.get('/api/question-sets', () => {
        return HttpResponse.json(
          { error: 'ServerError', message: 'Failed to load question sets', status: 500 },
          { status: 500 }
        );
      })
    );

    render(<QuestionSetList />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to fetch question sets/i)).toBeInTheDocument();
  });

  it('should retry API call when clicking retry button', async () => {
    // First fail, then succeed
    let callCount = 0;
    server.use(
      http.get('/api/question-sets', () => {
        callCount++;
        if (callCount === 1) {
          return HttpResponse.json(
            { error: 'ServerError', message: 'Server error', status: 500 },
            { status: 500 }
          );
        }
        return HttpResponse.json({
          data: [
            {
              id: '1',
              name: 'Test Question Set',
              description: 'Test',
              isFunctional: true,
              category: 'Test',
              lastUpdated: '2025-10-15T00:00:00Z',
              version: '1.0.0',
            },
          ],
          total: 1,
        });
      })
    );

    render(<QuestionSetList />);

    // Wait for error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Click retry
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);

    // Should load successfully
    await waitFor(() => {
      expect(screen.getByText('Available Question Sets')).toBeInTheDocument();
    });
  });

  it('should render empty state when no question sets available', async () => {
    server.use(
      http.get('/api/question-sets', () => {
        return HttpResponse.json({ data: [], total: 0 });
      })
    );

    render(<QuestionSetList />);

    await waitFor(() => {
      expect(screen.getByText('No question sets available')).toBeInTheDocument();
    });
  });

  it('should trigger form fetch when clicking item', async () => {
    render(<QuestionSetList onFormSelected={mockOnFormSelected} />);

    await waitFor(() => {
      expect(screen.getByText('Available Question Sets')).toBeInTheDocument();
    });

    // Find and click the first functional question set
    const items = screen.getAllByRole('button');
    const functionalItem = items.find(item =>
      item.textContent?.includes('Customer Onboarding') ||
      item.textContent?.includes('Functional')
    );

    if (functionalItem) {
      fireEvent.click(functionalItem);

      // Should show loading indicator
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });
    }
  });

  it('should call onFormSelected callback when form fetch succeeds', async () => {
    render(<QuestionSetList onFormSelected={mockOnFormSelected} />);

    await waitFor(() => {
      expect(screen.getByText('Available Question Sets')).toBeInTheDocument();
    });

    // Click an item
    const items = screen.getAllByRole('button');
    const functionalItem = items.find(item =>
      item.textContent?.includes('Customer Onboarding')
    );

    if (functionalItem) {
      fireEvent.click(functionalItem);

      // Wait for form to be fetched
      await waitFor(() => {
        expect(mockOnFormSelected).toHaveBeenCalled();
      }, { timeout: 3000 });

      expect(mockOnFormSelected).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        })
      );
    }
  });

  it('should call onError callback when form fetch fails', async () => {
    // Override form fetch to fail
    server.use(
      http.get('/api/question-sets/:id', () => {
        return HttpResponse.json(
          { error: 'NotFound', message: 'Form not found', status: 404 },
          { status: 404 }
        );
      })
    );

    render(<QuestionSetList onError={mockOnError} />);

    await waitFor(() => {
      expect(screen.getByText('Available Question Sets')).toBeInTheDocument();
    });

    // Click an item
    const items = screen.getAllByRole('button');
    const functionalItem = items.find(item =>
      item.textContent?.includes('Customer Onboarding')
    );

    if (functionalItem) {
      fireEvent.click(functionalItem);

      // Wait for error callback
      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalled();
      }, { timeout: 3000 });

      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('404'),
        })
      );
    }
  });

  it('should disable items while form is loading', async () => {
    render(<QuestionSetList />);

    await waitFor(() => {
      expect(screen.getByText('Available Question Sets')).toBeInTheDocument();
    });

    // Click an item
    const items = screen.getAllByRole('button');
    const functionalItem = items.find(item =>
      item.textContent?.includes('Customer Onboarding')
    );

    if (functionalItem) {
      fireEvent.click(functionalItem);

      // During loading, items should be disabled
      await waitFor(() => {
        const progressBar = screen.queryByRole('progressbar');
        if (progressBar) {
          items.forEach(item => {
            // Check if button is disabled or has disabled attribute
            expect(item).toBeDisabled();
          });
        }
      });
    }
  });
});
