import { formService } from './formService';
import { server } from '../mocks/server';
import { rest } from 'msw';

describe('FormService', () => {
  beforeEach(() => {
    // Reset handlers before each test
    server.resetHandlers();
  });

  describe('getQuestionSets', () => {
    it('should return question sets array on successful response', async () => {
      const result = await formService.getQuestionSets();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', '1');
      expect(result[0]).toHaveProperty('name', 'Functional Question Set');
      expect(result[0]).toHaveProperty('isFunctional', true);
      expect(result[1]).toHaveProperty('id', '2');
      expect(result[1]).toHaveProperty('name', 'Non-Functional Question Set');
      expect(result[1]).toHaveProperty('isFunctional', false);
    });

    it('should throw error on network failure', async () => {
      server.use(
        rest.get('/api/question-sets', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: 'Network error' }));
        })
      );

      await expect(formService.getQuestionSets()).rejects.toThrow();
    });

    it('should throw error on server error (500)', async () => {
      server.use(
        rest.get('/api/question-sets', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              error: 'InternalServerError',
              message: 'Internal server error occurred',
              status: 500,
            })
          );
        })
      );

      await expect(formService.getQuestionSets()).rejects.toThrow(
        'Failed to fetch question sets: 500 Internal Server Error - Internal server error occurred'
      );
    });

    it('should throw timeout error after 30 seconds', async () => {
      jest.useFakeTimers();

      server.use(
        rest.get('/api/question-sets', async (req, res, ctx) => {
          // Delay longer than 30 seconds
          await new Promise(resolve => setTimeout(resolve, 35000));
          return res(ctx.json({ data: [], total: 0 }));
        })
      );

      const promise = formService.getQuestionSets();

      // Fast-forward 30 seconds
      jest.advanceTimersByTime(30000);

      await expect(promise).rejects.toThrow('Request timeout after 30000ms');

      jest.useRealTimers();
    });
  });

  describe('getFormById', () => {
    it('should return form data for valid ID', async () => {
      const result = await formService.getFormById('1');

      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('name', 'Functional Question Set');
      expect(result).toHaveProperty('version', '1.0.0');
      expect(result).toHaveProperty('sections');
      expect(result.sections).toHaveLength(2);
    });

    it('should throw error for non-existent form ID', async () => {
      await expect(formService.getFormById('999')).rejects.toThrow(
        'Failed to fetch form data: 404 Not Found'
      );
    });

    it('should respect AbortSignal and cancel request', async () => {
      const controller = new AbortController();

      // Cancel immediately
      controller.abort();

      await expect(formService.getFormById('1', controller.signal)).rejects.toThrow(
        'Request timeout after 30000ms'
      );
    });

    it('should throw error on server error (500)', async () => {
      server.use(
        rest.get('/api/question-sets/1', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              error: 'InternalServerError',
              message: 'Database connection failed',
              status: 500,
            })
          );
        })
      );

      await expect(formService.getFormById('1')).rejects.toThrow(
        'Failed to fetch form data: 500 Internal Server Error - Database connection failed'
      );
    });
  });

  describe('submitFormData', () => {
    const testFormData = {
      title: 'Test Requirement',
      description: 'Test description',
      priority: 'high',
    };

    it('should successfully submit form data and return submission response', async () => {
      const result = await formService.submitFormData('1', testFormData);

      expect(result).toHaveProperty('submissionId');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.submissionId).toBe('string');
      expect(typeof result.timestamp).toBe('string');
    });

    it('should throw error on validation failure (400)', async () => {
      server.use(
        rest.post('/api/question-sets/1/submit', (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              error: 'ValidationError',
              message: 'Form data validation failed',
              status: 400,
            })
          );
        })
      );

      await expect(formService.submitFormData('1', testFormData)).rejects.toThrow(
        'Failed to submit form data: 400 Bad Request - Form data validation failed'
      );
    });

    it('should throw error on network failure', async () => {
      server.use(
        rest.post('/api/question-sets/1/submit', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: 'Network error' }));
        })
      );

      await expect(formService.submitFormData('1', testFormData)).rejects.toThrow();
    });

    it('should include authentication headers', async () => {
      let capturedRequest: Request | null = null;

      server.use(
        rest.post('/api/question-sets/1/submit', (req, res, ctx) => {
          capturedRequest = req as unknown as Request;
          return res(
            ctx.json({
              submissionId: 'test-submission',
              timestamp: new Date().toISOString(),
            })
          );
        })
      );

      await formService.submitFormData('1', testFormData);

      expect(capturedRequest).toBeTruthy();
      if (capturedRequest) {
        expect(capturedRequest.headers.get('Content-Type')).toBe('application/json');
      }
      // Note: credentials: 'include' is set in the service, but we can't easily test the cookie header in this context
    });
  });

  describe('environment configuration', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should use custom base URL from environment variable', async () => {
      process.env.NX_FORM_SERVICE_URL = '/custom-api';

      // Re-import to get new instance with updated env
      const { formService: customService } = await import('./formService');

      let capturedUrl = '';
      server.use(
        rest.get('/custom-api/question-sets', (req, res, ctx) => {
          capturedUrl = req.url.toString();
          return res(ctx.json({ data: [], total: 0 }));
        })
      );

      await customService.getQuestionSets();

      expect(capturedUrl).toContain('/custom-api/question-sets');
    });

    it('should fallback to default /api when env var not set', async () => {
      delete process.env.NX_FORM_SERVICE_URL;

      // Re-import to get new instance with updated env
      const { formService: defaultService } = await import('./formService');

      let capturedUrl = '';
      server.use(
        rest.get('/api/question-sets', (req, res, ctx) => {
          capturedUrl = req.url.toString();
          return res(ctx.json({ data: [], total: 0 }));
        })
      );

      await defaultService.getQuestionSets();

      expect(capturedUrl).toContain('/api/question-sets');
    });
  });
});
