import { rest } from 'msw';
import type { QuestionSet, FormData } from '../types/questionSet.types';

// Mock question sets data
export const mockQuestionSets: QuestionSet[] = [
  {
    id: '1',
    name: 'Functional Question Set',
    description: 'A question set for functional requirements gathering',
    isFunctional: true,
    category: 'functional',
    lastUpdated: '2024-01-15T10:30:00Z',
    version: '1.0.0',
  },
  {
    id: '2',
    name: 'Non-Functional Question Set',
    description: 'A question set for non-functional requirements gathering',
    isFunctional: false,
    category: 'non-functional',
    lastUpdated: '2024-01-14T15:45:00Z',
    version: '1.1.0',
  },
];

// Mock form data
export const mockFormData: FormData = {
  id: '1',
  name: 'Functional Question Set',
  version: '1.0.0',
  questionSetId: '1',
  sections: [
    {
      id: 'section-1',
      title: 'Basic Information',
      description: 'Basic information about the requirement',
      order: 1,
      fields: [
        {
          id: 'field-1',
          type: 'text',
          label: 'Requirement Title',
          required: true,
          placeholder: 'Enter requirement title',
          validation: [
            {
              type: 'minLength',
              value: 3,
              message: 'Title must be at least 3 characters long',
            },
          ],
        },
        {
          id: 'field-2',
          type: 'textarea',
          label: 'Description',
          required: true,
          placeholder: 'Describe the requirement in detail',
          validation: [
            {
              type: 'minLength',
              value: 10,
              message: 'Description must be at least 10 characters long',
            },
          ],
        },
        {
          id: 'field-3',
          type: 'select',
          label: 'Priority',
          required: true,
          options: [
            { label: 'High', value: 'high' },
            { label: 'Medium', value: 'medium' },
            { label: 'Low', value: 'low' },
          ],
          defaultValue: 'medium',
        },
      ],
    },
    {
      id: 'section-2',
      title: 'Technical Details',
      description: 'Technical specifications and constraints',
      order: 2,
      fields: [
        {
          id: 'field-4',
          type: 'checkbox',
          label: 'Technologies',
          required: false,
          options: [
            { label: 'React', value: 'react' },
            { label: 'TypeScript', value: 'typescript' },
            { label: 'Node.js', value: 'nodejs' },
            { label: 'Python', value: 'python' },
          ],
        },
        {
          id: 'field-5',
          type: 'date',
          label: 'Target Completion Date',
          required: false,
        },
      ],
    },
  ],
  metadata: {
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    author: 'System Admin',
  },
};

// Success handlers
export const handlers = [
  // GET /api/question-sets
  rest.get('http://localhost:4200/api/question-sets', (req, res, ctx) => {
    return res(
      ctx.json({
        data: mockQuestionSets,
        total: mockQuestionSets.length,
      })
    );
  }),

  // GET /api/question-sets/:id
  rest.get('/api/question-sets/:id', (req, res, ctx) => {
    const { id } = req.params;

    if (id === '1') {
      return res(ctx.json({ data: mockFormData }));
    }

    return res(
      ctx.status(404),
      ctx.json({
        error: 'NotFound',
        message: `Question set with id '${id}' not found`,
        status: 404,
      })
    );
  }),

  // POST /api/question-sets/:id/submit
  rest.post('/api/question-sets/:id/submit', (req, res, ctx) => {
    const { id } = req.params; // eslint-disable-line @typescript-eslint/no-unused-vars

    // Simulate successful submission
    return res(
      ctx.json({
        submissionId: `sub_${Date.now()}`,
        timestamp: new Date().toISOString(),
      })
    );
  }),
];

// Error handlers for testing
export const errorHandlers = {
  // Network error
  networkError: rest.get('/api/question-sets', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ message: 'Network error' }));
  }),

  // Timeout error (simulate slow response)
  timeout: rest.get('/api/question-sets', async (req, res, ctx) => {
    await new Promise(resolve => setTimeout(resolve, 35000)); // Longer than 30s timeout
    return res(ctx.json({ data: mockQuestionSets, total: mockQuestionSets.length }));
  }),

  // Server error
  serverError: rest.get('/api/question-sets', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        error: 'InternalServerError',
        message: 'Internal server error occurred',
        status: 500,
      })
    );
  }),

  // Invalid data error
  invalidData: rest.get('/api/question-sets', (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        error: 'ValidationError',
        message: 'Invalid request data',
        status: 400,
      })
    );
  }),
};
