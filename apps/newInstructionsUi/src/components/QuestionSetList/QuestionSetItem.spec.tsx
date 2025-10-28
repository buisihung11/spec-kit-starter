import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionSetItem } from './QuestionSetItem';
import type { QuestionSet } from '../../types/questionSet.types';

describe('QuestionSetItem', () => {
  const mockQuestionSet: QuestionSet = {
    id: '1',
    name: 'Test Question Set',
    description: 'Test description',
    isFunctional: true,
    category: 'Test Category',
    lastUpdated: '2025-10-15T00:00:00Z',
    version: '1.0.0',
  };

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('should render question set name', () => {
    render(
      <QuestionSetItem
        questionSet={mockQuestionSet}
        isSelected={false}
        isLoading={false}
        onSelect={mockOnSelect}
        disabled={false}
      />
    );

    expect(screen.getByText('Test Question Set')).toBeInTheDocument();
  });

  it('should display "Functional" badge when isFunctional=true', () => {
    render(
      <QuestionSetItem
        questionSet={mockQuestionSet}
        isSelected={false}
        isLoading={false}
        onSelect={mockOnSelect}
        disabled={false}
      />
    );

    expect(screen.getByText('Functional')).toBeInTheDocument();
  });

  it('should display "Not Available" badge when isFunctional=false', () => {
    const nonFunctionalSet: QuestionSet = {
      ...mockQuestionSet,
      isFunctional: false,
    };

    render(
      <QuestionSetItem
        questionSet={nonFunctionalSet}
        isSelected={false}
        isLoading={false}
        onSelect={mockOnSelect}
        disabled={false}
      />
    );

    expect(screen.getByText('Not Available')).toBeInTheDocument();
  });

  it('should show loading indicator when isLoading=true', () => {
    render(
      <QuestionSetItem
        questionSet={mockQuestionSet}
        isSelected={false}
        isLoading={true}
        onSelect={mockOnSelect}
        disabled={false}
      />
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('should call onSelect with correct ID when clicked', () => {
    render(
      <QuestionSetItem
        questionSet={mockQuestionSet}
        isSelected={false}
        isLoading={false}
        onSelect={mockOnSelect}
        disabled={false}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnSelect).toHaveBeenCalledWith('1');
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled=true', () => {
    render(
      <QuestionSetItem
        questionSet={mockQuestionSet}
        isSelected={false}
        isLoading={false}
        onSelect={mockOnSelect}
        disabled={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should be disabled when isFunctional=false', () => {
    const nonFunctionalSet: QuestionSet = {
      ...mockQuestionSet,
      isFunctional: false,
    };

    render(
      <QuestionSetItem
        questionSet={nonFunctionalSet}
        isSelected={false}
        isLoading={false}
        onSelect={mockOnSelect}
        disabled={false}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should show selected visual state when isSelected=true', () => {
    const { container } = render(
      <QuestionSetItem
        questionSet={mockQuestionSet}
        isSelected={true}
        isLoading={false}
        onSelect={mockOnSelect}
        disabled={false}
      />
    );

    // Check if card has the selected border styling
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('should not call onSelect when disabled', () => {
    render(
      <QuestionSetItem
        questionSet={mockQuestionSet}
        isSelected={false}
        isLoading={false}
        onSelect={mockOnSelect}
        disabled={true}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('should render description', () => {
    render(
      <QuestionSetItem
        questionSet={mockQuestionSet}
        isSelected={false}
        isLoading={false}
        onSelect={mockOnSelect}
        disabled={false}
      />
    );

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
});
