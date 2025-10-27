import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import { FormRoute } from './FormRoute';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock form service
jest.mock('../services/formService', () => ({
  formService: {
    getFormById: jest.fn().mockResolvedValue({
      id: '1',
      title: 'Test Form',
      description: 'Test Description',
      fields: [],
    }),
    submitFormData: jest.fn().mockResolvedValue({
      submissionId: 'sub_123',
      timestamp: new Date().toISOString(),
    }),
  },
}));

/**
 * Helper function to render route with routing context and params
 */
function renderWithRouter(formId = '1', state = {}) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: `/form/${formId}`, state }]}>
      <Routes>
        <Route path="/form/:formId" element={<FormRoute />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('FormRoute', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { container } = renderWithRouter();
    expect(container).toBeTruthy();
  });

  it('should render the page title and description', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Question Set Management')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Complete the form below and submit')
    ).toBeInTheDocument();
  });

  it('should show loading state initially when no form data in state', () => {
    renderWithRouter();
    expect(screen.getByText('Loading form...')).toBeInTheDocument();
  });

  it('should render form when data is provided via state', () => {
    const formData = {
      id: '1',
      title: 'Test Form',
      description: 'Test Description',
      fields: [],
    };

    renderWithRouter('1', { formData });

    expect(screen.getByText('Question Set Management')).toBeInTheDocument();
  });
});
