import { render, screen, waitFor } from '../../test-utils';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { FormRoute } from './FormRoute';

// Mock form service
jest.mock('../../services/formService', () => ({
  formService: {
    getFormById: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Test Form',
      version: '1.0.0',
      questionSetId: '1',
      sections: [
        {
          id: 'section-1',
          title: 'Test Section',
          description: 'Test section description',
          order: 1,
          fields: [
            {
              id: 'field-1',
              type: 'text',
              label: 'Test Field',
              required: true,
              placeholder: 'Enter test value',
            },
          ],
        },
      ],
      metadata: {
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        author: 'Test Author',
      },
    }),
    submitFormData: jest.fn().mockResolvedValue({
      submissionId: 'sub_123',
      timestamp: new Date().toISOString(),
    }),
  },
}));

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUseLocation = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  useLocation: () => mockUseLocation(),
}));

/**
 * Helper function to render route with mocked routing context
 */
function renderWithRouter(formId = '1', state = {}) {
  mockUseParams.mockReturnValue({ formId });
  mockUseLocation.mockReturnValue({ state });
  return render(
    <BrowserRouter>
      <FormRoute />
    </BrowserRouter>
  );
}

describe('FormRoute', () => {
  beforeEach(() => {
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
