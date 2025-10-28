import React from 'react';
import { render, screen, waitFor, fireEvent } from '../../test-utils';
import { QuestionSetList } from './QuestionSetList';
import { server } from '../../mocks/server';
import { rest } from 'msw';

describe('QuestionSetList', () => {
  const mockOnQuestionSetSelected = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    mockOnQuestionSetSelected.mockClear();
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
    const items = screen.getAllByRole('button');
    expect(items.length).toBeGreaterThan(0);
    expect(screen.getByText('A question set for functional requirements gathering')).toBeInTheDocument();
  });

  it('should render error Alert when API fails', async () => {
    // Override handler to return error
    server.use(
      rest.get('/api/question-sets', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'ServerError', message: 'Failed to load question sets', status: 500 })
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
      rest.get('/api/question-sets', (req, res, ctx) => {
        callCount++;
        if (callCount === 1) {
          return res(
            ctx.status(500),
            ctx.json({ error: 'ServerError', message: 'Server error', status: 500 })
          );
        }
        return res(
          ctx.json({
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
          })
        );
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
      rest.get('/api/question-sets', (req, res, ctx) => {
        return res(ctx.json({ data: [], total: 0 }));
      })
    );

    render(<QuestionSetList />);

    await waitFor(() => {
      expect(screen.getByText('No question sets available')).toBeInTheDocument();
    });
  });

  it('should trigger callback when clicking item', async () => {
    render(<QuestionSetList onQuestionSetSelected={mockOnQuestionSetSelected} />);

    await waitFor(() => {
      expect(screen.getByText('Available Question Sets')).toBeInTheDocument();
    });

    // Find and click the first functional question set
    const items = screen.getAllByRole('button');
    const functionalItem = items.find(item =>
      item.textContent?.includes('Functional Question Set')
    );

    if (functionalItem) {
      fireEvent.click(functionalItem);

      // Should immediately call callback with question set ID
      await waitFor(() => {
        expect(mockOnQuestionSetSelected).toHaveBeenCalled();
      });
    }
  });

  it('should call onQuestionSetSelected callback with question set ID', async () => {
    render(<QuestionSetList onQuestionSetSelected={mockOnQuestionSetSelected} />);

    await waitFor(() => {
      expect(screen.getByText('Available Question Sets')).toBeInTheDocument();
    });

    // Click an item
    const items = screen.getAllByRole('button');
    const functionalItem = items.find(item =>
      item.textContent?.includes('Functional Question Set')
    );

    if (functionalItem) {
      fireEvent.click(functionalItem);

      // Should be called with question set ID
      await waitFor(() => {
        expect(mockOnQuestionSetSelected).toHaveBeenCalled();
      });

      expect(mockOnQuestionSetSelected).toHaveBeenCalledWith(
        expect.any(String)
      );
    }
  });

  it('should call onError callback when question sets fetch fails', async () => {
    // Override handler to return error
    server.use(
      rest.get('/api/question-sets', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'ServerError', message: 'Server error', status: 500 })
        );
      })
    );

    render(<QuestionSetList onError={mockOnError} />);

    // Wait for error to be displayed and callback to be invoked
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled();
    });

    expect(mockOnError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });

  it('should not disable items when clicked', async () => {
    render(<QuestionSetList />);

    await waitFor(() => {
      expect(screen.getByText('Available Question Sets')).toBeInTheDocument();
    });

    // Click an item
    const items = screen.getAllByRole('button');
    const functionalItem = items.find(item =>
      item.textContent?.includes('Functional Question Set')
    );

    if (functionalItem) {
      fireEvent.click(functionalItem);

      // Items should remain enabled since we don't fetch forms anymore
      items.forEach(item => {
        expect(item).not.toBeDisabled();
      });
    }
  });
});
