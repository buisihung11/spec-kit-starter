import { renderHook, act } from '@testing-library/react';
import { useMultiStepForm } from './useMultiStepForm';
import { FormData, FormMetadata } from '../types/questionSet.types';

describe('useMultiStepForm', () => {
  const mockFormData: FormData = {
    id: '1',
    name: 'Test Form',
    version: '1.0.0',
    sections: [],
    questions: [
      { id: 'q1', type: 'text', label: 'Question 1', required: true },
      { id: 'q2', type: 'text', label: 'Question 2', required: false },
      { id: 'q3', type: 'text', label: 'Question 3', required: true },
      { id: 'q4', type: 'text', label: 'Question 4', required: false },
      { id: 'q5', type: 'text', label: 'Question 5', required: true },
      { id: 'q6', type: 'text', label: 'Question 6', required: false },
      { id: 'q7', type: 'text', label: 'Question 7', required: true },
    ],
    metadata: {} as FormMetadata,
  };

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    expect(result.current.currentStep).toBe(0);
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);
    expect(result.current.formDataByStep).toEqual({});
    expect(result.current.completedSteps).toEqual([]);
    expect(result.current.steps.length).toBeGreaterThan(0);
  });

  it('should organize form data into steps', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    expect(result.current.steps.length).toBe(2); // 7 questions / 6 per step = 2 steps
    expect(result.current.totalSteps).toBe(2);
  });

  it('should navigate to next step with goToNext', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    act(() => {
      result.current.goToNext({ q1: 'answer1' });
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.completedSteps).toContain(0);
    expect(result.current.isFirstStep).toBe(false);
  });

  it('should save step data when calling goToNext', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    const stepData = { q1: 'answer1', q2: 'answer2' };

    act(() => {
      result.current.goToNext(stepData);
    });

    expect(result.current.formDataByStep[0]).toEqual(stepData);
  });

  it('should not exceed last step when calling goToNext on last step', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    // Navigate to last step
    act(() => {
      result.current.goToNext();
      result.current.goToNext(); // Try to go beyond
    });

    expect(result.current.currentStep).toBe(1); // Should stay at last step (index 1)
    expect(result.current.isLastStep).toBe(true);
  });

  it('should navigate to previous step with goToPrevious', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    // First go to next step
    act(() => {
      result.current.goToNext();
    });

    expect(result.current.currentStep).toBe(1);

    // Then go back
    act(() => {
      result.current.goToPrevious();
    });

    expect(result.current.currentStep).toBe(0);
    expect(result.current.isFirstStep).toBe(true);
  });

  it('should optionally save data when calling goToPrevious', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    // Navigate to step 2
    act(() => {
      result.current.goToNext();
    });

    const stepData = { q7: 'answer7' };

    // Go back and save data
    act(() => {
      result.current.goToPrevious(stepData);
    });

    expect(result.current.formDataByStep[1]).toEqual(stepData);
  });

  it('should not go below first step when calling goToPrevious on first step', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    expect(result.current.currentStep).toBe(0);

    act(() => {
      result.current.goToPrevious(); // Try to go before first step
    });

    expect(result.current.currentStep).toBe(0); // Should stay at first step
    expect(result.current.isFirstStep).toBe(true);
  });

  it('should jump to specific step with goToStep', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    act(() => {
      result.current.goToStep(1);
    });

    expect(result.current.currentStep).toBe(1);
  });

  it('should validate bounds when calling goToStep', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    // Try to go to invalid step
    act(() => {
      result.current.goToStep(99);
    });

    expect(result.current.currentStep).toBe(0); // Should stay at current step

    // Try negative index
    act(() => {
      result.current.goToStep(-1);
    });

    expect(result.current.currentStep).toBe(0); // Should stay at current step
  });

  it('should save step data with saveStepData', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    const stepData = { q1: 'answer1', q2: 'answer2' };

    act(() => {
      result.current.saveStepData(0, stepData);
    });

    expect(result.current.formDataByStep[0]).toEqual(stepData);
  });

  it('should merge all step data with getAllFormData', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    const step1Data = { q1: 'answer1', q2: 'answer2' };
    const step2Data = { q7: 'answer7' };

    act(() => {
      result.current.saveStepData(0, step1Data);
      result.current.saveStepData(1, step2Data);
    });

    const allData = result.current.getAllFormData();

    expect(allData).toEqual({
      q1: 'answer1',
      q2: 'answer2',
      q7: 'answer7',
    });
  });

  it('should track completed steps', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    expect(result.current.completedSteps).toEqual([]);

    act(() => {
      result.current.goToNext();
    });

    expect(result.current.completedSteps).toContain(0);

    act(() => {
      result.current.goToNext();
    });

    expect(result.current.completedSteps).toContain(1);
  });

  it('should not add duplicate completed steps', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    act(() => {
      result.current.goToNext();
      result.current.goToPrevious();
      result.current.goToNext(); // Go to step 1 again
    });

    const step0Count = result.current.completedSteps.filter(s => s === 0).length;
    expect(step0Count).toBe(1); // Should only appear once
  });

  it('should have correct isFirstStep and isLastStep booleans', () => {
    const { result } = renderHook(() => useMultiStepForm(mockFormData));

    // At first step
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);

    // Navigate to last step
    act(() => {
      result.current.goToStep(1);
    });

    expect(result.current.isFirstStep).toBe(false);
    expect(result.current.isLastStep).toBe(true);
  });

  it('should handle form with single step', () => {
    const singleStepForm: FormData = {
      id: '1',
      name: 'Single Step Form',
      version: '1.0.0',
      sections: [],
      questions: [
        { id: 'q1', type: 'text', label: 'Question 1', required: true },
      ],
      metadata: {} as FormMetadata,
    };

    const { result } = renderHook(() => useMultiStepForm(singleStepForm));

    expect(result.current.totalSteps).toBe(1);
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(true);
  });
});
