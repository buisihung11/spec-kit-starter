import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Stack,
} from '@spec-kit-demo-v2/design-system';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

/**
 * Props for the SidebarHeader component
 */
export interface SidebarHeaderProps {
  /** Whether the sidebar is expanded */
  isExpanded: boolean;
  /** Whether the sidebar is collapsed */
  isCollapsed: boolean;
  /** Callback for toggling the drawer */
  onToggle: () => void;
}

/**
 * Header component for the sidebar containing logo and collapse toggle
 *
 * @param props - The component props
 * @returns The rendered sidebar header
 */
export function SidebarHeader({
  isExpanded,
  isCollapsed,
  onToggle,
}: SidebarHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isExpanded ? 'space-between' : 'center',
        p: 2,
        minHeight: 64,
      }}
    >
      {isExpanded && (
        <Stack direction="row" spacing={1} alignItems="center">
          <AccountCircleIcon sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            Acme Inc.
          </Typography>
        </Stack>
      )}
      <IconButton
        onClick={onToggle}
        size="small"
        sx={{
          backgroundColor: isCollapsed ? 'action.hover' : 'transparent',
          '&:hover': {
            backgroundColor: 'action.selected',
          },
        }}
      >
        {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </Box>
  );
}
