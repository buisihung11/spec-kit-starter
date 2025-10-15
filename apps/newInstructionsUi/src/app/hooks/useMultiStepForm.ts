import { useState, useMemo, useCallback } from 'react';
import { FormData, FormStepData } from '../types/questionSet.types';
import { stepOrganizer } from '../services/stepOrganizer';

/**
 * Return type for the useMultiStepForm hook
 */
export interface UseMultiStepFormReturn {
  /** Current step index (0-based) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Array of organized form steps */
  steps: FormStepData[];
  /** Form data organized by step index */
  formDataByStep: Record<number, Record<string, unknown>>;
  /** Array of step indices that have been visited/completed */
  completedSteps: number[];
  /** Navigate to the next step, optionally saving current step data */
  goToNext: (stepData?: Record<string, unknown>) => void;
  /** Navigate to the previous step, optionally saving current step data */
  goToPrevious: (stepData?: Record<string, unknown>) => void;
  /** Navigate to a specific step by index */
  goToStep: (stepIndex: number) => void;
  /** Whether currently on the first step */
  isFirstStep: boolean;
  /** Whether currently on the last step */
  isLastStep: boolean;
  /** Save data for a specific step */
  saveStepData: (stepIndex: number, data: Record<string, unknown>) => void;
  /** Get all form data merged from all steps */
  getAllFormData: () => Record<string, unknown>;
}

/**
 * Custom hook for managing multi-step form state and navigation.
 *
 * Handles step organization, navigation between steps, data persistence across steps,
 * and tracking of completed steps. Uses the stepOrganizer service to convert form data
 * into a multi-step structure.
 *
 * @param formData - The form data to organize into steps
 * @returns Object containing step state, navigation functions, and data management
 *
 * @example
 * ```tsx
 * function MultiStepForm({ formData }: { formData: FormData }) {
 *   const {
 *     currentStep,
 *     totalSteps,
 *     steps,
 *     goToNext,
 *     goToPrevious,
 *     isFirstStep,
 *     isLastStep,
 *     saveStepData,
 *     getAllFormData
 *   } = useMultiStepForm(formData);
 *
 *   const handleNext = (data: Record<string, unknown>) => {
 *     saveStepData(currentStep, data);
 *     goToNext();
 *   };
 *
 *   const handleSubmit = () => {
 *     const allData = getAllFormData();
 *     // Submit allData to API
 *   };
 *
 *   return (
 *     <div>
 *       <h2>Step {currentStep + 1} of {totalSteps}</h2>
 *       <button onClick={goToPrevious} disabled={isFirstStep}>Previous</button>
 *       {!isLastStep ? (
 *         <button onClick={() => handleNext({})}>Next</button>
 *       ) : (
 *         <button onClick={handleSubmit}>Submit</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMultiStepForm(formData: FormData): UseMultiStepFormReturn {
  // Organize form data into steps (memoized to avoid recalculation)
  const steps = useMemo(
    () => stepOrganizer.organizeIntoSteps(formData),
    [formData]
  );

  const totalSteps = steps.length;

  // State for current step index
  const [currentStep, setCurrentStep] = useState(0);

  // State for form data by step
  const [formDataByStep, setFormDataByStep] = useState<Record<number, Record<string, unknown>>>({});

  // State for completed steps
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Calculate derived state
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  /**
   * Saves data for a specific step
   */
  const saveStepData = useCallback((stepIndex: number, data: Record<string, unknown>) => {
    setFormDataByStep((prev) => ({
      ...prev,
      [stepIndex]: data,
    }));
  }, []);

  /**
   * Navigates to the next step
   * Saves current step data if provided
   * Adds current step to completed steps if not already present
   */
  const goToNext = useCallback(
    (stepData?: Record<string, unknown>) => {
      if (stepData) {
        saveStepData(currentStep, stepData);
      }

      // Add current step to completed steps if not already there
      setCompletedSteps((prev) => {
        if (!prev.includes(currentStep)) {
          return [...prev, currentStep];
        }
        return prev;
      });

      // Move to next step (max: last step)
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    },
    [currentStep, totalSteps, saveStepData]
  );

  /**
   * Navigates to the previous step
   * Optionally saves current step data before navigating
   */
  const goToPrevious = useCallback(
    (stepData?: Record<string, unknown>) => {
      if (stepData) {
        saveStepData(currentStep, stepData);
      }

      // Move to previous step (min: first step)
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    },
    [currentStep, saveStepData]
  );

  /**
   * Navigates to a specific step by index
   * Validates the step index to ensure it's within bounds
   */
  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < totalSteps) {
        setCurrentStep(stepIndex);
      }
    },
    [totalSteps]
  );

  /**
   * Merges all step data into a single object
   * Returns combined data from all steps
   */
  const getAllFormData = useCallback((): Record<string, unknown> => {
    return Object.values(formDataByStep).reduce(
      (acc, stepData) => ({
        ...acc,
        ...stepData,
      }),
      {}
    );
  }, [formDataByStep]);

  return {
    currentStep,
    totalSteps,
    steps,
    formDataByStep,
    completedSteps,
    goToNext,
    goToPrevious,
    goToStep,
    isFirstStep,
    isLastStep,
    saveStepData,
    getAllFormData,
  };
}
