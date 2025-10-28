import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { FormSection } from './FormSection';
import type { FormSection as FormSectionType } from '../../types/questionSet.types';

// Wrapper component for testing FormSection with React Hook Form
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function TestFormSection(props: { section: FormSectionType }) {
  const { control, formState: { errors } } = useForm();
  return (
    <TestWrapper>
      <FormSection
        section={props.section}
        control={control}
        errors={errors}
      />
    </TestWrapper>
  );
}

describe('FormSection', () => {
  it('renders section title when provided', () => {
    const section: FormSectionType = {
      id: 'personalInfo',
      title: 'Personal Information',
      fields: [],
    };

    render(<TestFormSection section={section} />);

    expect(screen.getByRole('heading', { name: /personal information/i })).toBeInTheDocument();
  });

  it('renders section description when provided', () => {
    const section: FormSectionType = {
      id: 'contact',
      title: 'Contact Details',
      description: 'Please provide your contact information',
      fields: [],
    };

    render(<TestFormSection section={section} />);

    expect(screen.getByText(/please provide your contact information/i)).toBeInTheDocument();
  });

  it('renders without title and description', () => {
    const section: FormSectionType = {
      id: 'fields',
      fields: [
        {
          id: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
      ],
    };

    render(<TestFormSection section={section} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders all fields in the section', () => {
    const section: FormSectionType = {
      id: 'userDetails',
      title: 'User Details',
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
        {
          id: 'email',
          label: 'Email',
          type: 'email',
          required: true,
        },
      ],
    };

    render(<TestFormSection section={section} />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });


  it('renders section with Paper elevation', () => {
    const section: FormSectionType = {
      id: 'styled',
      title: 'Styled Section',
      fields: [
        {
          id: 'field1',
          label: 'Field 1',
          type: 'text',
          required: false,
        },
      ],
    };

    const { container } = render(<TestFormSection section={section} />);

    const paper = container.querySelector('.MuiPaper-root');
    expect(paper).toBeInTheDocument();
    expect(paper).toHaveClass('MuiPaper-elevation2');
  });

  it('renders divider between header and fields when title or description exists', () => {
    const section: FormSectionType = {
      id: 'withDivider',
      title: 'Section Title',
      fields: [
        {
          id: 'field1',
          label: 'Field 1',
          type: 'text',
          required: false,
        },
      ],
    };

    const { container } = render(<TestFormSection section={section} />);

    const divider = container.querySelector('.MuiDivider-root');
    expect(divider).toBeInTheDocument();
  });

  it('does not render divider when no title and description', () => {
    const section: FormSectionType = {
      id: 'noDivider',
      fields: [
        {
          id: 'field1',
          label: 'Field 1',
          type: 'text',
          required: false,
        },
      ],
    };

    const { container } = render(<TestFormSection section={section} />);

    const divider = container.querySelector('.MuiDivider-root');
    expect(divider).not.toBeInTheDocument();
  });

  it('renders empty section with no fields', () => {
    const section: FormSectionType = {
      id: 'empty',
      title: 'Empty Section',
      description: 'This section has no fields',
      fields: [],
    };

    render(<TestFormSection section={section} />);

    expect(screen.getByRole('heading', { name: /empty section/i })).toBeInTheDocument();
    expect(screen.getByText(/this section has no fields/i)).toBeInTheDocument();
  });

  it('applies spacing between fields', () => {
    const section: FormSectionType = {
      id: 'spacing',
      fields: [
        {
          id: 'field1',
          label: 'Field 1',
          type: 'text',
          required: false,
        },
        {
          id: 'field2',
          label: 'Field 2',
          type: 'text',
          required: false,
        },
      ],
    };

    const { container } = render(<TestFormSection section={section} />);

    const stack = container.querySelector('.MuiStack-root');
    expect(stack).toBeInTheDocument();
  });
});
