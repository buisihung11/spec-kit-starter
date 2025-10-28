import '@testing-library/jest-dom';
import 'whatwg-fetch'; // Polyfill for fetch APIs
import { server } from './src/mocks/server';

// MSW requires these globals to be available
import { TextEncoder, TextDecoder } from 'util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
Object.assign(global as any, { TextDecoder, TextEncoder });

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
