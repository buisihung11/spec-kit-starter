import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { FormFieldComponent, buildValidationRules } from './FormField';
import type { FormField } from '../../types/questionSet.types';

// Wrapper component for testing FormField with React Hook Form
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function TestFormField(props: { field: FormField }) {
  const { control, formState: { errors } } = useForm();
  return (
    <TestWrapper>
      <FormFieldComponent
        field={props.field}
        control={control}
        error={errors[props.field.id]}
      />
    </TestWrapper>
  );
}

describe('FormFieldComponent', () => {
  describe('Text Input', () => {
    it('renders text field with label and placeholder', () => {
      const field: FormField = {
        id: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'Enter your first name',
        required: true,
      };

      render(<TestFormField field={field} />);

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your first name/i)).toBeInTheDocument();
    });

    it('renders required asterisk when field is required', () => {
      const field: FormField = {
        id: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
      };

      render(<TestFormField field={field} />);

      const input = screen.getByLabelText(/last name/i);
      expect(input).toBeRequired();
    });
  });

  describe('Email Input', () => {
    it('renders email field with correct type', () => {
      const field: FormField = {
        id: 'email',
        label: 'Email',
        type: 'email',
        required: true,
      };

      render(<TestFormField field={field} />);

      const input = screen.getByLabelText(/email/i);
      expect(input).toHaveAttribute('type', 'email');
    });
  });

  describe('Phone Input', () => {
    it('renders phone field with tel type', () => {
      const field: FormField = {
        id: 'phone',
        label: 'Phone Number',
        type: 'phone',
        required: false,
      };

      render(<TestFormField field={field} />);

      const input = screen.getByLabelText(/phone number/i);
      expect(input).toHaveAttribute('type', 'tel');
    });
  });

  describe('Textarea', () => {
    it('renders multiline textarea', () => {
      const field: FormField = {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Enter description',
        required: false,
      };

      render(<TestFormField field={field} />);

      const textarea = screen.getByLabelText(/description/i);
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });
  });

  describe('Number Input', () => {
    it('renders number field with correct type', () => {
      const field: FormField = {
        id: 'age',
        label: 'Age',
        type: 'number',
        required: true,
      };

      render(<TestFormField field={field} />);

      const input = screen.getByLabelText(/age/i);
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Date Input', () => {
    it('renders date field with correct type', () => {
      const field: FormField = {
        id: 'birthdate',
        label: 'Birth Date',
        type: 'date',
        required: false,
      };

      render(<TestFormField field={field} />);

      const input = screen.getByLabelText(/birth date/i);
      expect(input).toHaveAttribute('type', 'date');
    });
  });

  describe('Select Dropdown', () => {
    it('renders select with options', () => {
      const field: FormField = {
        id: 'country',
        label: 'Country',
        type: 'select',
        required: true,
        options: [
          { label: 'United States', value: 'us' },
          { label: 'Canada', value: 'ca' },
          { label: 'Mexico', value: 'mx' },
        ],
      };

      render(<TestFormField field={field} />);

      // Check for the label text (MUI renders it twice)
      const labels = screen.getAllByText(/country/i);
      expect(labels.length).toBeGreaterThan(0);
      // Check for the combobox role
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Radio Buttons', () => {
    it('renders radio group with options', () => {
      const field: FormField = {
        id: 'gender',
        label: 'Gender',
        type: 'radio',
        required: true,
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ],
      };

      render(<TestFormField field={field} />);

      expect(screen.getByText(/gender/i)).toBeInTheDocument();

      // Get all radio inputs and verify count
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);

      // Verify the labels are present
      expect(screen.getByText('Male')).toBeInTheDocument();
      expect(screen.getByText('Female')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
    });
  });

  describe('Checkbox', () => {
    it('renders checkbox field', () => {
      const field: FormField = {
        id: 'terms',
        label: 'I agree to terms and conditions',
        type: 'checkbox',
        required: true,
      };

      render(<TestFormField field={field} />);

      const checkbox = screen.getByLabelText(/i agree to terms/i);
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });
  });

  describe('Default Value', () => {
    it('uses default value when provided', () => {
      const field: FormField = {
        id: 'username',
        label: 'Username',
        type: 'text',
        defaultValue: 'john_doe',
        required: false,
      };

      render(<TestFormField field={field} />);

      const input = screen.getByLabelText(/username/i) as HTMLInputElement;
      expect(input.value).toBe('john_doe');
    });
  });
});

describe('buildValidationRules', () => {
  it('builds required rule', () => {
    const field: FormField = {
      id: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    };

    const rules = buildValidationRules(field);
    expect(rules.required).toBe('Name is required');
  });

  it('builds minLength rule', () => {
    const field: FormField = {
      id: 'password',
      label: 'Password',
      type: 'text',
      required: true,
      validation: [
        {
          type: 'minLength',
          value: 8,
          message: 'Password must be at least 8 characters',
        },
      ],
    };

    const rules = buildValidationRules(field);
    expect(rules.minLength).toEqual({
      value: 8,
      message: 'Password must be at least 8 characters',
    });
  });

  it('builds maxLength rule', () => {
    const field: FormField = {
      id: 'bio',
      label: 'Bio',
      type: 'textarea',
      required: false,
      validation: [
        {
          type: 'maxLength',
          value: 500,
          message: 'Bio cannot exceed 500 characters',
        },
      ],
    };

    const rules = buildValidationRules(field);
    expect(rules.maxLength).toEqual({
      value: 500,
      message: 'Bio cannot exceed 500 characters',
    });
  });

  it('builds min rule for numbers', () => {
    const field: FormField = {
      id: 'age',
      label: 'Age',
      type: 'number',
      required: true,
      validation: [
        {
          type: 'min',
          value: 18,
          message: 'Must be at least 18 years old',
        },
      ],
    };

    const rules = buildValidationRules(field);
    expect(rules.min).toEqual({
      value: 18,
      message: 'Must be at least 18 years old',
    });
  });

  it('builds max rule for numbers', () => {
    const field: FormField = {
      id: 'score',
      label: 'Score',
      type: 'number',
      required: true,
      validation: [
        {
          type: 'max',
          value: 100,
          message: 'Score cannot exceed 100',
        },
      ],
    };

    const rules = buildValidationRules(field);
    expect(rules.max).toEqual({
      value: 100,
      message: 'Score cannot exceed 100',
    });
  });

  it('builds pattern rule', () => {
    const field: FormField = {
      id: 'zipCode',
      label: 'ZIP Code',
      type: 'text',
      required: true,
      validation: [
        {
          type: 'pattern',
          value: '^\\d{5}$',
          message: 'ZIP code must be 5 digits',
        },
      ],
    };

    const rules = buildValidationRules(field);
    expect(rules.pattern).toEqual({
      value: /^\d{5}$/,
      message: 'ZIP code must be 5 digits',
    });
  });

  it('builds email validation rule', () => {
    const field: FormField = {
      id: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validation: [
        {
          type: 'email',
          message: 'Please enter a valid email',
        },
      ],
    };

    const rules = buildValidationRules(field);
    expect(rules.pattern).toEqual({
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid email',
    });
  });

  it('builds multiple validation rules', () => {
    const field: FormField = {
      id: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      validation: [
        {
          type: 'minLength',
          value: 3,
          message: 'Username must be at least 3 characters',
        },
        {
          type: 'maxLength',
          value: 20,
          message: 'Username cannot exceed 20 characters',
        },
        {
          type: 'pattern',
          value: '^[a-zA-Z0-9_]+$',
          message: 'Username can only contain letters, numbers, and underscores',
        },
      ],
    };

    const rules = buildValidationRules(field);
    expect(rules.required).toBe('Username is required');
    expect(rules.minLength).toEqual({
      value: 3,
      message: 'Username must be at least 3 characters',
    });
    expect(rules.maxLength).toEqual({
      value: 20,
      message: 'Username cannot exceed 20 characters',
    });
    expect(rules.pattern).toEqual({
      value: /^[a-zA-Z0-9_]+$/,
      message: 'Username can only contain letters, numbers, and underscores',
    });
  });

  it('returns empty rules object when no validation is specified', () => {
    const field: FormField = {
      id: 'optional',
      label: 'Optional Field',
      type: 'text',
      required: false,
    };

    const rules = buildValidationRules(field);
    expect(rules).toEqual({});
  });
});
