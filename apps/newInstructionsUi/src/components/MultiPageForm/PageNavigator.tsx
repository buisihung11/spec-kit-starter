import { useEffect } from 'react';
import { Box, Button, Stack } from '@spec-kit-demo-v2/design-system';

/**
 * Props for the PageNavigator component
 */
export interface PageNavigatorProps {
  /** Whether currently on the first step */
  isFirstStep: boolean;
  /** Whether currently on the last step */
  isLastStep: boolean;
  /** Callback to navigate to the previous page */
  onPrevious: () => void;
  /** Callback to navigate to the next page */
  onNext: () => void;
  /** Optional callback to submit the form (called on last step) */
  onSubmit?: () => void;
  /** Whether navigation buttons are disabled (e.g., during form validation or submission) */
  disabled?: boolean;
}

/**
 * Page navigator component with keyboard shortcuts for multi-step forms.
 *
 * Provides Previous/Next navigation buttons and keyboard shortcuts:
 * - Alt+Left Arrow: Navigate to previous page (respects isFirstStep)
 * - Alt+Right Arrow: Navigate to next page (respects isLastStep)
 *
 * The keyboard shortcuts respect navigation validation rules and will not
 * navigate beyond the first or last step, or when navigation is disabled.
 *
 * @param props - Component props
 * @returns Rendered page navigator with buttons and keyboard shortcuts
 *
 * @example
 * ```tsx
 * function MultiStepForm() {
 *   const { isFirstStep, isLastStep, goToNext, goToPrevious } = useMultiStepForm(formData);
 *
 *   return (
 *     <div>
 *       <FormContent />
 *       <PageNavigator
 *         isFirstStep={isFirstStep}
 *         isLastStep={isLastStep}
 *         onPrevious={goToPrevious}
 *         onNext={goToNext}
 *         onSubmit={handleSubmit}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function PageNavigator({
  isFirstStep,
  isLastStep,
  onPrevious,
  onNext,
  onSubmit,
  disabled = false,
}: PageNavigatorProps) {
  /**
   * Handle keyboard shortcuts for navigation
   * Alt+Left: Previous page
   * Alt+Right: Next page
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Alt key is pressed
      if (!event.altKey) {
        return;
      }

      // Prevent navigation if disabled
      if (disabled) {
        return;
      }

      // Handle Alt+Left (Previous)
      if (event.key === 'ArrowLeft' && !isFirstStep) {
        event.preventDefault();
        onPrevious();
      }

      // Handle Alt+Right (Next)
      if (event.key === 'ArrowRight' && !isLastStep) {
        event.preventDefault();
        onNext();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFirstStep, isLastStep, onPrevious, onNext, disabled]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 4,
        pt: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          onClick={onPrevious}
          disabled={isFirstStep || disabled}
          aria-label="Previous page"
        >
          Previous
        </Button>
      </Stack>

      <Stack direction="row" spacing={2}>
        {!isLastStep ? (
          <Button
            variant="contained"
            onClick={onNext}
            disabled={disabled}
            aria-label="Next page"
          >
            Next
          </Button>
        ) : (
          onSubmit && (
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={disabled}
              aria-label="Submit form"
            >
              Submit
            </Button>
          )
        )}
      </Stack>
    </Box>
  );
}
