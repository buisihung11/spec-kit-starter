import { FormData, FormStepData, FormField, FormSection } from '../types/questionSet.types';

/**
 * Configuration constants for step organization
 * These constants can be used in future enhancements for configurable step sizes
 */
// const MIN_QUESTIONS_PER_STEP = 3;
// const MAX_QUESTIONS_PER_STEP = 8;
const DEFAULT_QUESTIONS_PER_STEP = 6;

/**
 * Interface for the step organizer service
 */
export interface StepOrganizerService {
  /**
   * Organizes form data into a multi-step structure
   * @param formData The form data to organize
   * @returns Array of form steps with organized questions
   */
  organizeIntoSteps(formData: FormData): FormStepData[];
}

/**
 * Service for organizing form data into logical multi-step structures.
 *
 * Implements three strategies for organizing forms into steps:
 * 1. Use explicit steps if provided in formData.steps
 * 2. Convert sections to steps if formData.sections exists
 * 3. Group flat questions array into default-sized steps
 */
export class StepOrganizer implements StepOrganizerService {
  /**
   * Organizes form data into multi-step structure using the most appropriate strategy.
   *
   * Strategy selection:
   * - If formData.steps exists and has items, use them directly
   * - If formData.sections exists and has items, convert each section to a step
   * - Otherwise, group questions into default-sized steps
   *
   * @param formData - The form data to organize
   * @returns Array of FormStepData objects representing the multi-step form
   *
   * @example
   * ```ts
   * const organizer = new StepOrganizer();
   * const steps = organizer.organizeIntoSteps(formData);
   * console.log(`Form has ${steps.length} steps`);
   * ```
   */
  organizeIntoSteps(formData: FormData): FormStepData[] {
    // Strategy 1: Use explicit steps if provided
    if (formData.steps && formData.steps.length > 0) {
      return this.useExplicitSteps(formData.steps);
    }

    // Strategy 2: Convert sections to steps
    if (formData.sections && formData.sections.length > 0) {
      return this.convertSectionsToSteps(formData.sections);
    }

    // Strategy 3: Group flat questions array into steps
    if (formData.questions && formData.questions.length > 0) {
      return this.groupByDefault(formData.questions);
    }

    // No questions or steps found, return empty array
    return [];
  }

  /**
   * Strategy 1: Uses explicitly defined steps from the form data.
   * Maps and ensures proper ordering of steps.
   *
   * @private
   */
  private useExplicitSteps(steps: FormStepData[]): FormStepData[] {
    return steps
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((step, index) => ({
        ...step,
        order: step.order ?? index,
      }));
  }

  /**
   * Strategy 2: Converts form sections into steps.
   * Each section becomes one step in the multi-step form.
   *
   * @private
   */
  private convertSectionsToSteps(sections: FormSection[]): FormStepData[] {
    return sections
      .sort((a, b) => a.order - b.order)
      .map((section, index) => ({
        id: section.id,
        title: section.title,
        description: section.description,
        order: index,
        questions: section.fields,
      }));
  }

  /**
   * Strategy 3: Groups flat questions array into logical steps.
   *
   * Groups questions into steps of approximately DEFAULT_QUESTIONS_PER_STEP questions each.
   * The last step may have fewer questions if there's a remainder.
   *
   * @private
   * @param questions - Flat array of questions to group
   * @returns Array of steps with questions divided among them
   */
  private groupByDefault(questions: FormField[]): FormStepData[] {
    if (questions.length === 0) {
      return [];
    }

    const steps: FormStepData[] = [];
    const totalQuestions = questions.length;
    const questionsPerStep = DEFAULT_QUESTIONS_PER_STEP;
    const totalSteps = Math.ceil(totalQuestions / questionsPerStep);

    for (let stepIndex = 0; stepIndex < totalSteps; stepIndex++) {
      const startIndex = stepIndex * questionsPerStep;
      const endIndex = Math.min(startIndex + questionsPerStep, totalQuestions);
      const stepQuestions = questions.slice(startIndex, endIndex);

      steps.push({
        id: `step-${stepIndex + 1}`,
        title: `Step ${stepIndex + 1} of ${totalSteps}`,
        description: undefined,
        order: stepIndex,
        questions: stepQuestions,
      });
    }

    return steps;
  }
}

/**
 * Singleton instance of the StepOrganizer service
 * Use this instance throughout the application for consistent step organization
 *
 * @example
 * ```ts
 * import { stepOrganizer } from './services/stepOrganizer';
 *
 * const steps = stepOrganizer.organizeIntoSteps(formData);
 * ```
 */
export const stepOrganizer = new StepOrganizer();
