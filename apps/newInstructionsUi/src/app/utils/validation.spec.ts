/**
 * Unit tests for data validation utilities
 */

import {
  validateQuestionSet,
  validateQuestionSets,
  validateFormData,
  validateSubmissionResponse,
} from './validation';
import type {
  QuestionSet,
  FormData,
  SubmissionResponse,
} from '../types/questionSet.types';

describe('validateQuestionSet', () => {
  const validQuestionSet: QuestionSet = {
    id: 'qs-1',
    name: 'Test Question Set',
    description: 'A test question set',
    isFunctional: true,
    category: 'test',
    lastUpdated: '2025-10-15T00:00:00Z',
    version: '1.0.0',
  };

  it('should validate a valid QuestionSet object', () => {
    const result = validateQuestionSet(validQuestionSet);
    expect(result).toEqual(validQuestionSet);
  });

  it('should throw error if data is not an object', () => {
    expect(() => validateQuestionSet(null)).toThrow('data must be an object');
    expect(() => validateQuestionSet(undefined)).toThrow('data must be an object');
    expect(() => validateQuestionSet('string')).toThrow('data must be an object');
    expect(() => validateQuestionSet(123)).toThrow('data must be an object');
    expect(() => validateQuestionSet([])).toThrow('data must be an object');
  });

  it('should throw error if id is missing', () => {
    const invalid = { ...validQuestionSet };
    delete (invalid as Partial<QuestionSet>).id;
    expect(() => validateQuestionSet(invalid)).toThrow('id must be a non-empty string');
  });

  it('should throw error if id is not a string', () => {
    const invalid = { ...validQuestionSet, id: 123 };
    expect(() => validateQuestionSet(invalid)).toThrow('id must be a non-empty string');
  });

  it('should throw error if id is empty string', () => {
    const invalid = { ...validQuestionSet, id: '' };
    expect(() => validateQuestionSet(invalid)).toThrow('id must be a non-empty string');
  });

  it('should throw error if id is whitespace only', () => {
    const invalid = { ...validQuestionSet, id: '   ' };
    expect(() => validateQuestionSet(invalid)).toThrow('id must be a non-empty string');
  });

  it('should throw error if name is missing', () => {
    const invalid = { ...validQuestionSet };
    delete (invalid as Partial<QuestionSet>).name;
    expect(() => validateQuestionSet(invalid)).toThrow('name must be a non-empty string');
  });

  it('should throw error if name is not a string', () => {
    const invalid = { ...validQuestionSet, name: 123 };
    expect(() => validateQuestionSet(invalid)).toThrow('name must be a non-empty string');
  });

  it('should throw error if name is empty string', () => {
    const invalid = { ...validQuestionSet, name: '' };
    expect(() => validateQuestionSet(invalid)).toThrow('name must be a non-empty string');
  });

  it('should throw error if description is missing', () => {
    const invalid = { ...validQuestionSet };
    delete (invalid as Partial<QuestionSet>).description;
    expect(() => validateQuestionSet(invalid)).toThrow('description must be a string');
  });

  it('should throw error if description is not a string', () => {
    const invalid = { ...validQuestionSet, description: 123 };
    expect(() => validateQuestionSet(invalid)).toThrow('description must be a string');
  });

  it('should throw error if isFunctional is missing', () => {
    const invalid = { ...validQuestionSet };
    delete (invalid as Partial<QuestionSet>).isFunctional;
    expect(() => validateQuestionSet(invalid)).toThrow('isFunctional must be a boolean');
  });

  it('should throw error if isFunctional is not a boolean', () => {
    const invalid = { ...validQuestionSet, isFunctional: 'true' };
    expect(() => validateQuestionSet(invalid)).toThrow('isFunctional must be a boolean');
  });

  it('should throw error if category is missing', () => {
    const invalid = { ...validQuestionSet };
    delete (invalid as Partial<QuestionSet>).category;
    expect(() => validateQuestionSet(invalid)).toThrow('category must be a string');
  });

  it('should throw error if category is not a string', () => {
    const invalid = { ...validQuestionSet, category: 123 };
    expect(() => validateQuestionSet(invalid)).toThrow('category must be a string');
  });

  it('should throw error if lastUpdated is missing', () => {
    const invalid = { ...validQuestionSet };
    delete (invalid as Partial<QuestionSet>).lastUpdated;
    expect(() => validateQuestionSet(invalid)).toThrow('lastUpdated must be a string');
  });

  it('should throw error if lastUpdated is not a string', () => {
    const invalid = { ...validQuestionSet, lastUpdated: 123 };
    expect(() => validateQuestionSet(invalid)).toThrow('lastUpdated must be a string');
  });

  it('should throw error if version is missing', () => {
    const invalid = { ...validQuestionSet };
    delete (invalid as Partial<QuestionSet>).version;
    expect(() => validateQuestionSet(invalid)).toThrow('version must be a string');
  });

  it('should throw error if version is not a string', () => {
    const invalid = { ...validQuestionSet, version: 123 };
    expect(() => validateQuestionSet(invalid)).toThrow('version must be a string');
  });
});

describe('validateQuestionSets', () => {
  const validQuestionSet1: QuestionSet = {
    id: 'qs-1',
    name: 'Test Question Set 1',
    description: 'First test question set',
    isFunctional: true,
    category: 'test',
    lastUpdated: '2025-10-15T00:00:00Z',
    version: '1.0.0',
  };

  const validQuestionSet2: QuestionSet = {
    id: 'qs-2',
    name: 'Test Question Set 2',
    description: 'Second test question set',
    isFunctional: false,
    category: 'test',
    lastUpdated: '2025-10-15T00:00:00Z',
    version: '2.0.0',
  };

  it('should validate an array of valid QuestionSet objects', () => {
    const result = validateQuestionSets([validQuestionSet1, validQuestionSet2]);
    expect(result).toEqual([validQuestionSet1, validQuestionSet2]);
  });

  it('should validate an empty array', () => {
    const result = validateQuestionSets([]);
    expect(result).toEqual([]);
  });

  it('should throw error if data is not an array', () => {
    expect(() => validateQuestionSets(null)).toThrow('data must be an array');
    expect(() => validateQuestionSets(undefined)).toThrow('data must be an array');
    expect(() => validateQuestionSets('string')).toThrow('data must be an array');
    expect(() => validateQuestionSets(123)).toThrow('data must be an array');
    expect(() => validateQuestionSets({})).toThrow('data must be an array');
  });

  it('should throw error with index if an item is invalid', () => {
    const invalidArray = [
      validQuestionSet1,
      { ...validQuestionSet2, id: 123 }, // Invalid id
    ];
    expect(() => validateQuestionSets(invalidArray)).toThrow('at index 1');
    expect(() => validateQuestionSets(invalidArray)).toThrow('id must be a non-empty string');
  });

  it('should throw error for first invalid item in array', () => {
    const invalidArray = [
      { ...validQuestionSet1, name: '' }, // Invalid at index 0
      validQuestionSet2,
    ];
    expect(() => validateQuestionSets(invalidArray)).toThrow('at index 0');
  });
});

describe('validateFormData', () => {
  const validFormData: FormData = {
    id: 'form-1',
    name: 'Test Form',
    version: '1.0.0',
    title: 'Test Form Title',
    description: 'A test form',
    sections: [
      {
        id: 'section-1',
        title: 'Section 1',
        description: 'First section',
        order: 1,
        fields: [
          {
            id: 'field-1',
            type: 'text',
            label: 'Text Field',
            required: true,
            placeholder: 'Enter text',
            validation: [
              {
                type: 'minLength',
                value: 5,
                message: 'Minimum 5 characters',
              },
            ],
          },
          {
            id: 'field-2',
            type: 'select',
            label: 'Select Field',
            required: false,
            options: [
              { label: 'Option 1', value: 'opt1' },
              { label: 'Option 2', value: 'opt2' },
            ],
          },
        ],
      },
    ],
    metadata: {
      createdAt: '2025-10-15T00:00:00Z',
      updatedAt: '2025-10-15T00:00:00Z',
      author: 'Test Author',
    },
    questionSetId: 'qs-1',
  };

  it('should validate a valid FormData object', () => {
    const result = validateFormData(validFormData);
    expect(result).toEqual(validFormData);
  });

  it('should validate FormData with optional questions array', () => {
    const withQuestions = {
      ...validFormData,
      questions: [
        {
          id: 'q-1',
          type: 'text' as const,
          label: 'Question 1',
          required: true,
        },
      ],
    };
    const result = validateFormData(withQuestions);
    expect(result).toEqual(withQuestions);
  });

  it('should validate FormData with optional steps array', () => {
    const withSteps = {
      ...validFormData,
      steps: [
        {
          id: 'step-1',
          title: 'Step 1',
          description: 'First step',
          order: 1,
          questions: [
            {
              id: 'q-1',
              type: 'text' as const,
              label: 'Question 1',
              required: true,
            },
          ],
        },
      ],
    };
    const result = validateFormData(withSteps);
    expect(result).toEqual(withSteps);
  });

  it('should throw error if data is not an object', () => {
    expect(() => validateFormData(null)).toThrow('data must be an object');
    expect(() => validateFormData(undefined)).toThrow('data must be an object');
    expect(() => validateFormData('string')).toThrow('data must be an object');
    expect(() => validateFormData([])).toThrow('data must be an object');
  });

  it('should throw error if id is missing or invalid', () => {
    const invalid = { ...validFormData };
    delete (invalid as Partial<FormData>).id;
    expect(() => validateFormData(invalid)).toThrow('id must be a non-empty string');
  });

  it('should throw error if id is empty string', () => {
    const invalid = { ...validFormData, id: '' };
    expect(() => validateFormData(invalid)).toThrow('id must be a non-empty string');
  });

  it('should throw error if name is missing or invalid', () => {
    const invalid = { ...validFormData };
    delete (invalid as Partial<FormData>).name;
    expect(() => validateFormData(invalid)).toThrow('name must be a non-empty string');
  });

  it('should throw error if version is missing', () => {
    const invalid = { ...validFormData };
    delete (invalid as Partial<FormData>).version;
    expect(() => validateFormData(invalid)).toThrow('version must be a string');
  });

  it('should throw error if questionSetId is missing', () => {
    const invalid = { ...validFormData };
    delete (invalid as Partial<FormData>).questionSetId;
    expect(() => validateFormData(invalid)).toThrow('questionSetId must be a string');
  });

  it('should throw error if title is invalid type', () => {
    const invalid = { ...validFormData, title: 123 };
    expect(() => validateFormData(invalid)).toThrow('title must be a string if provided');
  });

  it('should throw error if description is invalid type', () => {
    const invalid = { ...validFormData, description: 123 };
    expect(() => validateFormData(invalid)).toThrow('description must be a string if provided');
  });

  it('should throw error if sections is missing', () => {
    const invalid = { ...validFormData };
    delete (invalid as Partial<FormData>).sections;
    expect(() => validateFormData(invalid)).toThrow('sections must be an array');
  });

  it('should throw error if sections is not an array', () => {
    const invalid = { ...validFormData, sections: 'not-array' };
    expect(() => validateFormData(invalid)).toThrow('sections must be an array');
  });

  it('should throw error if section is invalid', () => {
    const invalid = {
      ...validFormData,
      sections: [{ ...validFormData.sections[0], id: 123 }],
    };
    expect(() => validateFormData(invalid)).toThrow('id must be a non-empty string');
  });

  it('should throw error if field type is invalid', () => {
    const invalid = {
      ...validFormData,
      sections: [
        {
          ...validFormData.sections[0],
          fields: [
            {
              ...validFormData.sections[0].fields[0],
              type: 'invalid-type',
            },
          ],
        },
      ],
    };
    expect(() => validateFormData(invalid)).toThrow('field type must be one of:');
  });

  it('should throw error if field option is invalid', () => {
    const invalid = {
      ...validFormData,
      sections: [
        {
          ...validFormData.sections[0],
          fields: [
            {
              ...validFormData.sections[0].fields[1],
              options: [{ label: 'Test', value: null }],
            },
          ],
        },
      ],
    };
    expect(() => validateFormData(invalid)).toThrow('option value must be');
  });

  it('should throw error if validation rule is invalid', () => {
    const invalid = {
      ...validFormData,
      sections: [
        {
          ...validFormData.sections[0],
          fields: [
            {
              ...validFormData.sections[0].fields[0],
              validation: [{ type: 'minLength' }], // Missing message
            },
          ],
        },
      ],
    };
    expect(() => validateFormData(invalid)).toThrow('validation rule message must be a string');
  });

  it('should throw error if metadata is missing', () => {
    const invalid = { ...validFormData };
    delete (invalid as Partial<FormData>).metadata;
    expect(() => validateFormData(invalid)).toThrow('metadata must be an object');
  });

  it('should throw error if metadata.createdAt is missing', () => {
    const invalid = {
      ...validFormData,
      metadata: { ...validFormData.metadata },
    };
    delete (invalid.metadata as Partial<typeof validFormData.metadata>).createdAt;
    expect(() => validateFormData(invalid)).toThrow('metadata.createdAt must be a string');
  });

  it('should throw error if metadata.updatedAt is missing', () => {
    const invalid = {
      ...validFormData,
      metadata: { ...validFormData.metadata },
    };
    delete (invalid.metadata as Partial<typeof validFormData.metadata>).updatedAt;
    expect(() => validateFormData(invalid)).toThrow('metadata.updatedAt must be a string');
  });

  it('should throw error if metadata.author is missing', () => {
    const invalid = {
      ...validFormData,
      metadata: { ...validFormData.metadata },
    };
    delete (invalid.metadata as Partial<typeof validFormData.metadata>).author;
    expect(() => validateFormData(invalid)).toThrow('metadata.author must be a string');
  });

  it('should throw error if questions is not an array', () => {
    const invalid = { ...validFormData, questions: 'not-array' };
    expect(() => validateFormData(invalid)).toThrow('questions must be an array if provided');
  });

  it('should throw error if steps is not an array', () => {
    const invalid = { ...validFormData, steps: 'not-array' };
    expect(() => validateFormData(invalid)).toThrow('steps must be an array if provided');
  });

  it('should throw error if step is invalid', () => {
    const invalid = {
      ...validFormData,
      steps: [
        {
          id: 123, // Invalid
          title: 'Step 1',
          questions: [],
        },
      ],
    };
    expect(() => validateFormData(invalid)).toThrow('id must be a non-empty string');
  });
});

describe('validateSubmissionResponse', () => {
  const validSubmissionResponse: SubmissionResponse = {
    submissionId: 'sub-123',
    timestamp: '2025-10-15T00:00:00Z',
  };

  it('should validate a valid SubmissionResponse object', () => {
    const result = validateSubmissionResponse(validSubmissionResponse);
    expect(result).toEqual(validSubmissionResponse);
  });

  it('should throw error if data is not an object', () => {
    expect(() => validateSubmissionResponse(null)).toThrow('data must be an object');
    expect(() => validateSubmissionResponse(undefined)).toThrow('data must be an object');
    expect(() => validateSubmissionResponse('string')).toThrow('data must be an object');
    expect(() => validateSubmissionResponse([])).toThrow('data must be an object');
  });

  it('should throw error if submissionId is missing', () => {
    const invalid = { ...validSubmissionResponse };
    delete (invalid as Partial<SubmissionResponse>).submissionId;
    expect(() => validateSubmissionResponse(invalid)).toThrow(
      'submissionId must be a non-empty string'
    );
  });

  it('should throw error if submissionId is not a string', () => {
    const invalid = { ...validSubmissionResponse, submissionId: 123 };
    expect(() => validateSubmissionResponse(invalid)).toThrow(
      'submissionId must be a non-empty string'
    );
  });

  it('should throw error if submissionId is empty string', () => {
    const invalid = { ...validSubmissionResponse, submissionId: '' };
    expect(() => validateSubmissionResponse(invalid)).toThrow(
      'submissionId must be a non-empty string'
    );
  });

  it('should throw error if timestamp is missing', () => {
    const invalid = { ...validSubmissionResponse };
    delete (invalid as Partial<SubmissionResponse>).timestamp;
    expect(() => validateSubmissionResponse(invalid)).toThrow('timestamp must be a string');
  });

  it('should throw error if timestamp is not a string', () => {
    const invalid = { ...validSubmissionResponse, timestamp: 123 };
    expect(() => validateSubmissionResponse(invalid)).toThrow('timestamp must be a string');
  });
});

describe('Edge cases', () => {
  it('should handle null vs undefined consistently', () => {
    expect(() => validateQuestionSet(null)).toThrow('data must be an object');
    expect(() => validateQuestionSet(undefined)).toThrow('data must be an object');
    expect(() => validateQuestionSets(null)).toThrow('data must be an array');
    expect(() => validateQuestionSets(undefined)).toThrow('data must be an array');
    expect(() => validateFormData(null)).toThrow('data must be an object');
    expect(() => validateFormData(undefined)).toThrow('data must be an object');
    expect(() => validateSubmissionResponse(null)).toThrow('data must be an object');
    expect(() => validateSubmissionResponse(undefined)).toThrow('data must be an object');
  });

  it('should handle empty strings appropriately', () => {
    const questionSet = {
      id: '',
      name: 'Test',
      description: '',
      isFunctional: true,
      category: '',
      lastUpdated: '',
      version: '',
    };

    // Empty id should fail
    expect(() => validateQuestionSet(questionSet)).toThrow('id must be a non-empty string');

    // Empty description, category, etc. should pass (they just need to be strings)
    const validWithEmptyFields = {
      ...questionSet,
      id: 'qs-1',
      name: 'Test',
    };
    expect(() => validateQuestionSet(validWithEmptyFields)).not.toThrow();
  });

  it('should handle arrays vs non-arrays properly', () => {
    expect(() => validateQuestionSets({})).toThrow('data must be an array');
    expect(() => validateQuestionSets('not-array')).toThrow('data must be an array');
    expect(() => validateQuestionSets(123)).toThrow('data must be an array');
  });
});
