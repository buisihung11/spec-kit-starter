import { renderHook, waitFor, act } from '@testing-library/react';
import { useFormService } from './useFormService';
import { server } from '../mocks/server';
import { rest } from 'msw';

describe('useFormService', () => {
  it('should have initial state with formData=null, loading=false, error=null', () => {
    const { result } = renderHook(() => useFormService());

    expect(result.current.formData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch form data when fetchForm is called', async () => {
    const { result } = renderHook(() => useFormService());

    await act(async () => {
      await result.current.fetchForm('1');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.formData).toBeTruthy();
    expect(result.current.formData?.id).toBe('1');
    expect(result.current.formData?.name).toBeTruthy();
    expect(result.current.error).toBeNull();
  });

  it('should set loading=true during fetch', async () => {
    const { result } = renderHook(() => useFormService());

    act(() => {
      result.current.fetchForm('1');
    });

    // Check loading state immediately
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle fetch errors and set error state', async () => {
    // Override handler to return 404
    server.use(
      rest.get('/api/question-sets/:id', (req, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json({ error: 'NotFound', message: 'Form not found', status: 404 })
        );
      })
    );

    const { result } = renderHook(() => useFormService());

    await act(async () => {
      await result.current.fetchForm('999');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.formData).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('404');
  });

  it('should reset state when reset is called', async () => {
    const { result } = renderHook(() => useFormService());

    // Fetch some data first
    await act(async () => {
      await result.current.fetchForm('1');
    });

    await waitFor(() => {
      expect(result.current.formData).toBeTruthy();
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.formData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should abort ongoing request when reset is called', async () => {
    const { result } = renderHook(() => useFormService());

    // Start fetch
    act(() => {
      result.current.fetchForm('1');
    });

    // Reset before fetch completes
    act(() => {
      result.current.reset();
    });

    // Wait a bit to ensure fetch would have completed
    await new Promise((resolve) => setTimeout(resolve, 50));

    // State should remain cleared
    expect(result.current.formData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
