import type {
  QuestionSet,
  FormData,
  QuestionSetsResponse,
  FormDetailResponse,
  SubmissionResponse,
  ApiErrorResponse,
} from '../types/questionSet.types';
import { mockQuestionSets, mockFormData } from '../mocks/handlers';

/**
 * Interface for the form service client
 */
export interface FormServiceClient {
  getQuestionSets(): Promise<QuestionSet[]>;
  getFormById(id: string, signal?: AbortSignal): Promise<FormData>;
  submitFormData(formId: string, data: unknown): Promise<SubmissionResponse>;
}

/**
 * Service class for handling all HTTP communication with the backend API
 * Currently using mock data instead of real API calls
 */
export class FormService implements FormServiceClient {
  private readonly baseUrl: string;
  private readonly timeoutMs = 30000; // 30 seconds
  private readonly useMockData = true; // Toggle to switch between mock and real API

  constructor() {
    // Use environment variable with fallback to '/api'
    this.baseUrl = process.env.NX_FORM_SERVICE_URL || '/api';
  }

  /**
   * Private method to perform fetch with timeout using AbortController
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    signal?: AbortSignal
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: signal || controller.signal,
        credentials: 'include', // Include auth cookies
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${this.timeoutMs}ms`);
        }
        throw new Error(`Network error: ${error.message}`);
      }

      throw error;
    }
  }

  /**
   * Get all available question sets
   */
  async getQuestionSets(): Promise<QuestionSet[]> {
    // Return mock data directly if useMockData is true
    if (this.useMockData) {
      return Promise.resolve(mockQuestionSets);
    }

    const url = `${this.baseUrl}/question-sets`;

    const response = await this.fetchWithTimeout(url);

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({
        error: 'UnknownError',
        message: 'Failed to parse error response',
        status: response.status,
      }))) as ApiErrorResponse;

      throw new Error(
        `Failed to fetch question sets: ${response.status} ${response.statusText} - ${errorData.message}`
      );
    }

    const data = (await response.json()) as QuestionSetsResponse;
    return data.data;
  }

  /**
   * Get detailed form data by question set ID
   */
  async getFormById(id: string, signal?: AbortSignal): Promise<FormData> {
    // Return mock data directly if useMockData is true
    if (this.useMockData) {
      // Simulate a small delay to mimic network request
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (id === '1') {
        return Promise.resolve(mockFormData);
      }
      
      throw new Error(`Question set with id '${id}' not found`);
    }

    const url = `${this.baseUrl}/question-sets/${encodeURIComponent(id)}`;

    const response = await this.fetchWithTimeout(url, {}, signal);

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({
        error: 'UnknownError',
        message: 'Failed to parse error response',
        status: response.status,
      }))) as ApiErrorResponse;

      throw new Error(
        `Failed to fetch form data: ${response.status} ${response.statusText} - ${errorData.message}`
      );
    }

    const data = (await response.json()) as FormDetailResponse;
    return data.data;
  }

  /**
   * Submit form data for a specific question set
   */
  async submitFormData(formId: string, data: unknown): Promise<SubmissionResponse> {
    // Return mock response directly if useMockData is true
    if (this.useMockData) {
      // Simulate a small delay to mimic network request
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return Promise.resolve({
        submissionId: `sub_${Date.now()}`,
        timestamp: new Date().toISOString(),
      });
    }

    const url = `${this.baseUrl}/question-sets/${encodeURIComponent(formId)}/submit`;

    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({
        error: 'UnknownError',
        message: 'Failed to parse error response',
        status: response.status,
      }))) as ApiErrorResponse;

      throw new Error(
        `Failed to submit form data: ${response.status} ${response.statusText} - ${errorData.message}`
      );
    }

    const result = (await response.json()) as SubmissionResponse;
    return result;
  }
}

// Export singleton instance
export const formService = new FormService();
