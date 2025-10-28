import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { FormDisplay } from './FormDisplay';
import type { FormData } from '../../types/questionSet.types';

describe('FormDisplay', () => {
  describe('Loading State', () => {
    it('displays loading indicator when isLoading is true', () => {
      render(
        <FormDisplay
          formData={null}
          isLoading={true}
        />
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText(/loading form/i)).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('displays error message when error is provided', () => {
      render(
        <FormDisplay
          formData={null}
          error="Failed to load form"
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/failed to load form/i)).toBeInTheDocument();
    });
  });

  describe('No Data State', () => {
    it('displays info message when formData is null', () => {
      render(<FormDisplay formData={null} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/no form data available/i)).toBeInTheDocument();
    });
  });

  describe('Form Rendering', () => {
    const mockFormData: FormData = {
      id: 'form1',
      questionSetId: 'qs1',
      title: 'User Registration',
      description: 'Please fill out the registration form',
      sections: [
        {
          id: 'section1',
          title: 'Personal Information',
          description: 'Enter your personal details',
          fields: [
            {
              id: 'firstName',
              label: 'First Name',
              type: 'text',
              required: true,
            },
            {
              id: 'lastName',
              label: 'Last Name',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    };

    it('renders form title and description', () => {
      render(<FormDisplay formData={mockFormData} />);

      expect(screen.getByRole('heading', { name: /user registration/i })).toBeInTheDocument();
      expect(screen.getByText(/please fill out the registration form/i)).toBeInTheDocument();
    });

    it('renders all sections', () => {
      render(<FormDisplay formData={mockFormData} />);

      expect(screen.getByRole('heading', { name: /personal information/i })).toBeInTheDocument();
      expect(screen.getByText(/enter your personal details/i)).toBeInTheDocument();
    });

    it('renders all fields in sections', () => {
      render(<FormDisplay formData={mockFormData} />);

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    });

    it('renders submit button', () => {
      render(<FormDisplay formData={mockFormData} />);

      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('renders cancel button when onCancel is provided', () => {
      const onCancel = jest.fn();

      render(
        <FormDisplay
          formData={mockFormData}
          onCancel={onCancel}
        />
      );

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('does not render cancel button when onCancel is not provided', () => {
      render(<FormDisplay formData={mockFormData} />);

      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    const mockFormData: FormData = {
      id: 'form1',
      questionSetId: 'qs1',
      title: 'Contact Form',
      sections: [
        {
          id: 'section1',
          fields: [
            {
              id: 'email',
              label: 'Email',
              type: 'email',
              required: true,
            },
          ],
        },
      ],
    };

    it('calls onSubmit with form data when submit button is clicked', async () => {
      const onSubmit = jest.fn();

      render(
        <FormDisplay
          formData={mockFormData}
          onSubmit={onSubmit}
        />
      );

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'test@example.com',
          })
        );
      });
    });

    it('does not call onSubmit when form is invalid', async () => {
      const onSubmit = jest.fn();

      render(
        <FormDisplay
          formData={mockFormData}
          onSubmit={onSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });

    it('disables submit button during submission', async () => {
      const onSubmit = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(
        <FormDisplay
          formData={mockFormData}
          onSubmit={onSubmit}
        />
      );

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('shows submitting text during submission', async () => {
      const onSubmit = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(
        <FormDisplay
          formData={mockFormData}
          onSubmit={onSubmit}
        />
      );

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /submitting/i })).toBeInTheDocument();
      });
    });
  });

  describe('Cancel Action', () => {
    const mockFormData: FormData = {
      id: 'form1',
      questionSetId: 'qs1',
      sections: [
        {
          id: 'section1',
          fields: [
            {
              id: 'name',
              label: 'Name',
              type: 'text',
              required: false,
            },
          ],
        },
      ],
    };

    it('calls onCancel when cancel button is clicked', () => {
      const onCancel = jest.fn();

      render(
        <FormDisplay
          formData={mockFormData}
          onCancel={onCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('disables cancel button during submission', async () => {
      const onSubmit = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
      const onCancel = jest.fn();

      render(
        <FormDisplay
          formData={mockFormData}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        expect(cancelButton).toBeDisabled();
      });
    });
  });

  describe('Multiple Sections', () => {
    it('renders multiple sections correctly', () => {
      const formData: FormData = {
        id: 'form1',
        questionSetId: 'qs1',
        title: 'Multi-Section Form',
        sections: [
          {
            id: 'section1',
            title: 'Section 1',
            fields: [
              {
                id: 'field1',
                label: 'Field 1',
                type: 'text',
                required: false,
              },
            ],
          },
          {
            id: 'section2',
            title: 'Section 2',
            fields: [
              {
                id: 'field2',
                label: 'Field 2',
                type: 'text',
                required: false,
              },
            ],
          },
          {
            id: 'section3',
            title: 'Section 3',
            fields: [
              {
                id: 'field3',
                label: 'Field 3',
                type: 'text',
                required: false,
              },
            ],
          },
        ],
      };

      render(<FormDisplay formData={formData} />);

      expect(screen.getByRole('heading', { name: /section 1/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /section 2/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /section 3/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/field 1/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/field 2/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/field 3/i)).toBeInTheDocument();
    });
  });

  describe('Form without Title and Description', () => {
    it('renders form without title and description', () => {
      const formData: FormData = {
        id: 'form1',
        questionSetId: 'qs1',
        sections: [
          {
            id: 'section1',
            fields: [
              {
                id: 'field1',
                label: 'Field 1',
                type: 'text',
                required: false,
              },
            ],
          },
        ],
      };

      render(<FormDisplay formData={formData} />);

      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
      expect(screen.getByLabelText(/field 1/i)).toBeInTheDocument();
    });
  });

  describe('Fetch Mode', () => {
    it('should fetch form data when formId is provided', async () => {
      const mockOnFormFetched = jest.fn();

      render(
        <FormDisplay
          formId="1"
          onFormFetched={mockOnFormFetched}
        />
      );

      // Should show loading initially
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      // Wait for form to load
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // Should call callback with form data
      expect(mockOnFormFetched).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        })
      );
    });

    it('should call onFetchError when form fetch fails', async () => {
      const mockOnFetchError = jest.fn();

      render(
        <FormDisplay
          formId="non-existent-id"
          onFetchError={mockOnFetchError}
        />
      );

      // Wait for error
      await waitFor(() => {
        expect(mockOnFetchError).toHaveBeenCalled();
      });

      expect(mockOnFetchError).toHaveBeenCalledWith(
        expect.any(Error)
      );
    });

    it('should prefer formData prop over formId', () => {
      const mockFormData: FormData = {
        id: 'form1',
        questionSetId: 'qs1',
        name: 'Test Form',
        version: '1.0.0',
        title: 'Test Title',
        sections: [
          {
            id: 'section1',
            title: 'Test Section',
            description: 'Test section description',
            order: 1,
            fields: [
              {
                id: 'field1',
                label: 'Test Field',
                type: 'text',
                required: false,
              },
            ],
          },
        ],
        metadata: {
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
          author: 'test',
        },
      };

      render(
        <FormDisplay
          formId="some-id"
          formData={mockFormData}
        />
      );

      // Should use formData prop, not fetch
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
  });
});
