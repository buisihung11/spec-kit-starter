import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { QuestionSetListRoute } from './QuestionSetListRoute';

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

  it('should render the QuestionSetList component', () => {
    renderWithRouter(<QuestionSetListRoute />);
    // The QuestionSetList component should be rendered
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});
