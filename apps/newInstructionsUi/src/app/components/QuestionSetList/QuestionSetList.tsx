import React, { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Button,
} from '@spec-kit-demo-v2/design-system';
import { useQuestionSets } from '../../hooks/useQuestionSets';
import { useFormService } from '../../hooks/useFormService';
import { QuestionSetItem } from './QuestionSetItem';
import type { FormData } from '../../types/questionSet.types';

/**
 * Props for the QuestionSetList component
 */
export interface QuestionSetListProps {
  /** Callback invoked when a form is successfully selected and fetched */
  onFormSelected?: (formData: FormData) => void;
  /** Callback invoked when an error occurs during form fetching */
  onError?: (error: Error) => void;
}

/**
 * Container component that orchestrates the display of question sets and form retrieval.
 *
 * Uses useQuestionSets hook to fetch and display available question sets,
 * and useFormService hook to fetch individual forms when selected.
 * Handles all loading, error, and empty states with appropriate UI feedback.
 *
 * @param props - Component props
 * @returns Rendered question set list with all interactive states
 *
 * @example
 * ```tsx
 * <QuestionSetList
 *   onFormSelected={(formData) => {
 *     console.log('Form selected:', formData);
 *   }}
 *   onError={(error) => {
 *     console.error('Error:', error);
 *   }}
 * />
 * ```
 */
export function QuestionSetList({
  onFormSelected,
  onError,
}: QuestionSetListProps): React.ReactElement {
  const { questionSets, loading, error, refetch } = useQuestionSets();
  const {
    formData,
    loading: formLoading,
    error: formError,
    fetchForm,
  } = useFormService();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  /**
   * Handles question set selection
   * Fetches the form data and invokes callbacks based on result
   */
  const handleSelect = async (id: string) => {
    setSelectedId(id);

    try {
      await fetchForm(id);

      // Note: formData will be updated via the hook's state
      // We need to wait for it to be available
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch form');
      if (onError) {
        onError(error);
      }
    }
  };

  // Effect to handle form data updates
  React.useEffect(() => {
    if (formData && onFormSelected) {
      onFormSelected(formData);
    }
  }, [formData, onFormSelected]);

  // Effect to handle form errors
  React.useEffect(() => {
    if (formError && onError) {
      onError(formError);
    }
  }, [formError, onError]);

  // Loading state
  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading question sets...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            {error.message}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => refetch()}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  // Empty state
  if (questionSets.length === 0) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="200px">
        <Typography variant="body1" color="text.secondary">
          No question sets available
        </Typography>
      </Box>
    );
  }

  // List render
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Available Question Sets
      </Typography>
      <Stack spacing={2}>
        {questionSets.map((qs) => (
          <QuestionSetItem
            key={qs.id}
            questionSet={qs}
            isSelected={selectedId === qs.id}
            isLoading={formLoading && selectedId === qs.id}
            onSelect={handleSelect}
            disabled={formLoading}
          />
        ))}
      </Stack>
    </Box>
  );
}
