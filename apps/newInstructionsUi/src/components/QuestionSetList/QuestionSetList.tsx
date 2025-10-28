import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Grid,
} from '@spec-kit-demo-v2/design-system';
import { useQuestionSets } from '../../hooks/useQuestionSets';
import { QuestionSetItem } from './QuestionSetItem';

/**
 * Props for the QuestionSetList component
 */
export interface QuestionSetListProps {
  /** Callback invoked when a question set is selected */
  onQuestionSetSelected?: (questionSetId: string) => void;
  /** Callback invoked when an error occurs */
  onError?: (error: Error) => void;
}

/**
 * Container component that displays available question sets.
 *
 * Uses useQuestionSets hook to fetch and display available question sets.
 * Handles all loading, error, and empty states with appropriate UI feedback.
 * When a question set is selected, it calls the onQuestionSetSelected callback
 * with the question set ID, allowing parent components to handle navigation or form fetching.
 *
 * @param props - Component props
 * @returns Rendered question set list with all interactive states
 *
 * @example
 * ```tsx
 * <QuestionSetList
 *   onQuestionSetSelected={(id) => {
 *     navigate(`/form/${id}`);
 *   }}
 *   onError={(error) => {
 *     console.error('Error:', error);
 *   }}
 * />
 * ```
 */
export function QuestionSetList({
  onQuestionSetSelected,
  onError,
}: QuestionSetListProps): React.ReactElement {
  const { questionSets, loading, error, refetch } = useQuestionSets();

  /**
   * Handles question set selection
   * Invokes the callback with the selected question set ID
   */
  const handleSelect = (id: string) => {
    if (onQuestionSetSelected) {
      onQuestionSetSelected(id);
    }
  };

  // Effect to handle errors from the hook
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Loading state
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="200px"
      >
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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="200px"
      >
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
      <Grid container spacing={2}>
        {questionSets.map((qs) => (
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
            key={qs.id}
          >
            <QuestionSetItem
              questionSet={qs}
              isSelected={false}
              isLoading={false}
              onSelect={handleSelect}
              disabled={false}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
