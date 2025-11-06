import { render, screen, fireEvent } from '@testing-library/react';
import { PageNavigator } from './PageNavigator';

describe('PageNavigator', () => {
  const mockOnPrevious = jest.fn();
  const mockOnNext = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnPrevious.mockClear();
    mockOnNext.mockClear();
    mockOnSubmit.mockClear();
  });

  describe('Button rendering', () => {
    it('should render Previous and Next buttons when not on first or last step', () => {
      render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={false}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Submit form' })).not.toBeInTheDocument();
    });

    it('should render Submit button instead of Next when on last step', () => {
      render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={true}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit form' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
    });

    it('should not render Submit button on last step if onSubmit is not provided', () => {
      render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={true}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Submit form' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
    });
  });

  describe('Button states', () => {
    it('should disable Previous button when on first step', () => {
      render(
        <PageNavigator
          isFirstStep={true}
          isLastStep={false}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      );

      const previousButton = screen.getByRole('button', { name: 'Previous page' });
      expect(previousButton).toBeDisabled();
    });

    it('should enable Previous button when not on first step', () => {
      render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={false}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      );

      const previousButton = screen.getByRole('button', { name: 'Previous page' });
      expect(previousButton).not.toBeDisabled();
    });

    it('should disable all buttons when disabled prop is true', () => {
      render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={false}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
          disabled={true}
        />
      );

      expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    });
  });

  describe('Button click handlers', () => {
    it('should call onPrevious when Previous button is clicked', () => {
      render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={false}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      );

      const previousButton = screen.getByRole('button', { name: 'Previous page' });
      fireEvent.click(previousButton);

      expect(mockOnPrevious).toHaveBeenCalledTimes(1);
    });

    it('should call onNext when Next button is clicked', () => {
      render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={false}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      );

      const nextButton = screen.getByRole('button', { name: 'Next page' });
      fireEvent.click(nextButton);

      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it('should call onSubmit when Submit button is clicked', () => {
      render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={true}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: 'Submit form' });
      fireEvent.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard shortcuts', () => {
    it('should call onPrevious when Alt+Left is pressed and not on first step', () => {
      render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={false}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      );

      fireEvent.keyDown(window, { key: 'ArrowLeft', altKey: true });

      expect(mockOnPrevious).toHaveBeenCalledTimes(1);
    });

    it('should not call onPrevious when Alt+Left is pressed on first step', () => {
      render(
        <PageNavigator
          isFirstStep={true}
          isLastStep={false}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      );

      fireEvent.keyDown(window, { key: 'ArrowLeft', altKey: true });

      expect(mockOnPrevious).not.toHaveBeenCalled();
    });

    it('should call onNext when Alt+Right is pressed and not on last step', () => {
      render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={false}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      );

      fireEvent.keyDown(window, { key: 'ArrowRight', altKey: true });

      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it('should not call onNext when Alt+Right is pressed on last step', () => {
      render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={true}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      );

      fireEvent.keyDown(window, { key: 'ArrowRight', altKey: true });

      expect(mockOnNext).not.toHaveBeenCalled();
    });

    it('should not navigate when arrow keys are pressed without Alt modifier', () => {
      render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={false}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      );

      fireEvent.keyDown(window, { key: 'ArrowLeft', altKey: false });
      fireEvent.keyDown(window, { key: 'ArrowRight', altKey: false });

      expect(mockOnPrevious).not.toHaveBeenCalled();
      expect(mockOnNext).not.toHaveBeenCalled();
    });

    it('should not navigate when disabled prop is true', () => {
      render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={false}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
          disabled={true}
        />
      );

      fireEvent.keyDown(window, { key: 'ArrowLeft', altKey: true });
      fireEvent.keyDown(window, { key: 'ArrowRight', altKey: true });

      expect(mockOnPrevious).not.toHaveBeenCalled();
      expect(mockOnNext).not.toHaveBeenCalled();
    });

    it('should prevent default browser behavior for keyboard shortcuts', () => {
      render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={false}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      );

      const leftEvent = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        altKey: true,
        bubbles: true,
      });
      const preventDefaultSpy = jest.spyOn(leftEvent, 'preventDefault');

      window.dispatchEvent(leftEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Event listener cleanup', () => {
    it('should cleanup event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = render(
        <PageNavigator
          isFirstStep={false}
          isLastStep={false}
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});
