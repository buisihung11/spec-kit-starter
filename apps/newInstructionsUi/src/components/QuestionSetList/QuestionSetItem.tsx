import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  ListItemButton,
  Box,
} from '@spec-kit-demo-v2/design-system';
import type { QuestionSet } from '../../types/questionSet.types';

/**
 * Props for the QuestionSetItem component
 */
export interface QuestionSetItemProps {
  /** The question set data to display */
  questionSet: QuestionSet;
  /** Whether this item is currently selected */
  isSelected: boolean;
  /** Whether this item is currently loading */
  isLoading: boolean;
  /** Callback when the item is selected */
  onSelect: (id: string) => void;
  /** Whether the item should be disabled */
  disabled: boolean;
}

/**
 * Presentational component for rendering an individual question set item.
 *
 * Displays the question set name, functional status badge, and loading indicator.
 * Provides hover effects and disabled states for user interaction feedback.
 *
 * @param props - Component props
 * @returns Rendered question set item
 *
 * @example
 * ```tsx
 * <QuestionSetItem
 *   questionSet={questionSet}
 *   isSelected={selectedId === questionSet.id}
 *   isLoading={loading && selectedId === questionSet.id}
 *   onSelect={handleSelect}
 *   disabled={false}
 * />
 * ```
 */
export function QuestionSetItem({
  questionSet,
  isSelected,
  isLoading,
  onSelect,
  disabled,
}: QuestionSetItemProps): React.ReactElement {
  const isDisabled = disabled || !questionSet.isFunctional;

  const handleClick = () => {
    if (!isDisabled) {
      onSelect(questionSet.id);
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
      }}
    >
      <ListItemButton
        onClick={handleClick}
        disabled={isDisabled}
        sx={{
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <CardContent sx={{ width: '100%', py: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box flex={1}>
              <Typography variant="h6" component="div" gutterBottom>
                {questionSet.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {questionSet.description}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              {isLoading && <CircularProgress size={20} />}

              <Chip
                label={questionSet.isFunctional ? 'Functional' : 'Not Available'}
                color={questionSet.isFunctional ? 'success' : 'default'}
                size="small"
              />
            </Box>
          </Box>
        </CardContent>
      </ListItemButton>
    </Card>
  );
}
