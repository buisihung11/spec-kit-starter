import { StepOrganizer } from './stepOrganizer';
import type { FormData, FormField, FormMetadata } from '../types/questionSet.types';

describe('StepOrganizer', () => {
  let organizer: StepOrganizer;

  beforeEach(() => {
    organizer = new StepOrganizer();
  });

  describe('Strategy 1: Explicit steps', () => {
    it('should use explicit steps when provided', () => {
      const formData: FormData = {
        id: '1',
        name: 'Test Form',
        version: '1.0.0',
        sections: [],
        steps: [
          {
            id: 'step-1',
            title: 'Step 1',
            description: 'First step',
            order: 0,
            questions: [{ id: 'q1', type: 'text', label: 'Question 1', required: true }],
          },
          {
            id: 'step-2',
            title: 'Step 2',
            description: 'Second step',
            order: 1,
            questions: [{ id: 'q2', type: 'text', label: 'Question 2', required: false }],
          },
        ],
        metadata: {} as FormMetadata,
      };

      const result = organizer.organizeIntoSteps(formData);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('step-1');
      expect(result[0].title).toBe('Step 1');
      expect(result[0].order).toBe(0);
      expect(result[1].id).toBe('step-2');
      expect(result[1].order).toBe(1);
    });

    it('should preserve step order', () => {
      const formData: FormData = {
        id: '1',
        name: 'Test Form',
        version: '1.0.0',
        sections: [],
        steps: [
          {
            id: 'step-2',
            title: 'Step 2',
            order: 1,
            questions: [],
          },
          {
            id: 'step-1',
            title: 'Step 1',
            order: 0,
            questions: [],
          },
        ],
        metadata: {} as FormMetadata,
      };

      const result = organizer.organizeIntoSteps(formData);

      expect(result[0].id).toBe('step-1');
      expect(result[1].id).toBe('step-2');
    });
  });

  describe('Strategy 2: Convert sections to steps', () => {
    it('should convert sections to steps when no explicit steps', () => {
      const formData: FormData = {
        id: '1',
        name: 'Test Form',
        version: '1.0.0',
        sections: [
          {
            id: 'section-1',
            title: 'Section 1',
            description: 'First section',
            order: 0,
            fields: [{ id: 'q1', type: 'text', label: 'Question 1', required: true }],
          },
          {
            id: 'section-2',
            title: 'Section 2',
            description: 'Second section',
            order: 1,
            fields: [{ id: 'q2', type: 'email', label: 'Question 2', required: false }],
          },
        ],
        metadata: {} as FormMetadata,
      };

      const result = organizer.organizeIntoSteps(formData);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('section-1');
      expect(result[0].title).toBe('Section 1');
      expect(result[0].description).toBe('First section');
      expect(result[0].questions).toHaveLength(1);
      expect(result[1].id).toBe('section-2');
    });

    it('should sort sections by order', () => {
      const formData: FormData = {
        id: '1',
        name: 'Test Form',
        version: '1.0.0',
        sections: [
          {
            id: 'section-2',
            title: 'Section 2',
            description: 'Second section',
            order: 1,
            fields: [],
          },
          {
            id: 'section-1',
            title: 'Section 1',
            description: 'First section',
            order: 0,
            fields: [],
          },
        ],
        metadata: {} as FormMetadata,
      };

      const result = organizer.organizeIntoSteps(formData);

      expect(result[0].id).toBe('section-1');
      expect(result[1].id).toBe('section-2');
    });
  });

  describe('Strategy 3: Default grouping', () => {
    it('should group flat questions into steps of 6', () => {
      const questions: FormField[] = Array.from({ length: 12 }, (_, i) => ({
        id: `q${i + 1}`,
        type: 'text' as const,
        label: `Question ${i + 1}`,
        required: false,
      }));

      const formData: FormData = {
        id: '1',
        name: 'Test Form',
        version: '1.0.0',
        sections: [],
        questions,
        metadata: {} as FormMetadata,
      };

      const result = organizer.organizeIntoSteps(formData);

      expect(result).toHaveLength(2);
      expect(result[0].questions).toHaveLength(6);
      expect(result[1].questions).toHaveLength(6);
      expect(result[0].title).toBe('Step 1 of 2');
      expect(result[1].title).toBe('Step 2 of 2');
    });

    it('should handle remainder questions in last step', () => {
      const questions: FormField[] = Array.from({ length: 8 }, (_, i) => ({
        id: `q${i + 1}`,
        type: 'text' as const,
        label: `Question ${i + 1}`,
        required: false,
      }));

      const formData: FormData = {
        id: '1',
        name: 'Test Form',
        version: '1.0.0',
        sections: [],
        questions,
        metadata: {} as FormMetadata,
      };

      const result = organizer.organizeIntoSteps(formData);

      expect(result).toHaveLength(2);
      expect(result[0].questions).toHaveLength(6);
      expect(result[1].questions).toHaveLength(2);
    });

    it('should generate appropriate step titles', () => {
      const questions: FormField[] = Array.from({ length: 18 }, (_, i) => ({
        id: `q${i + 1}`,
        type: 'text' as const,
        label: `Question ${i + 1}`,
        required: false,
      }));

      const formData: FormData = {
        id: '1',
        name: 'Test Form',
        version: '1.0.0',
        sections: [],
        questions,
        metadata: {} as FormMetadata,
      };

      const result = organizer.organizeIntoSteps(formData);

      expect(result).toHaveLength(3);
      expect(result[0].title).toBe('Step 1 of 3');
      expect(result[1].title).toBe('Step 2 of 3');
      expect(result[2].title).toBe('Step 3 of 3');
    });
  });

  describe('Edge cases', () => {
    it('should return empty array for empty questions', () => {
      const formData: FormData = {
        id: '1',
        name: 'Test Form',
        version: '1.0.0',
        sections: [],
        questions: [],
        metadata: {} as FormMetadata,
      };

      const result = organizer.organizeIntoSteps(formData);

      expect(result).toEqual([]);
    });

    it('should create one step for single question', () => {
      const formData: FormData = {
        id: '1',
        name: 'Test Form',
        version: '1.0.0',
        sections: [],
        questions: [{ id: 'q1', type: 'text', label: 'Question 1', required: true }],
        metadata: {} as FormMetadata,
      };

      const result = organizer.organizeIntoSteps(formData);

      expect(result).toHaveLength(1);
      expect(result[0].questions).toHaveLength(1);
      expect(result[0].title).toBe('Step 1 of 1');
    });

    it('should handle large number of questions correctly', () => {
      const questions: FormField[] = Array.from({ length: 30 }, (_, i) => ({
        id: `q${i + 1}`,
        type: 'text' as const,
        label: `Question ${i + 1}`,
        required: false,
      }));

      const formData: FormData = {
        id: '1',
        name: 'Test Form',
        version: '1.0.0',
        sections: [],
        questions,
        metadata: {} as FormMetadata,
      };

      const result = organizer.organizeIntoSteps(formData);

      expect(result).toHaveLength(5);
      expect(result[0].questions).toHaveLength(6);
      expect(result[4].questions).toHaveLength(6);
    });

    it('should return empty array when no data provided', () => {
      const formData: FormData = {
        id: '1',
        name: 'Test Form',
        version: '1.0.0',
        sections: [],
        metadata: {} as FormMetadata,
      };

      const result = organizer.organizeIntoSteps(formData);

      expect(result).toEqual([]);
    });
  });

  describe('FormStepData structure', () => {
    it('should return proper FormStepData structure', () => {
      const formData: FormData = {
        id: '1',
        name: 'Test Form',
        version: '1.0.0',
        sections: [],
        questions: [{ id: 'q1', type: 'text', label: 'Question 1', required: true }],
        metadata: {} as FormMetadata,
      };

      const result = organizer.organizeIntoSteps(formData);

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('order');
      expect(result[0]).toHaveProperty('questions');
      expect(Array.isArray(result[0].questions)).toBe(true);
    });
  });
});
