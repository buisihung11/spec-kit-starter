import React from 'react';
import {
  Box,
  ListItemButton,
  Typography,
} from '@spec-kit-demo-v2/design-system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NavItem } from './types';

/**
 * Props for the SidebarMenuItem component
 */
export interface SidebarMenuItemProps {
  /** The navigation item to render */
  item: NavItem;
  /** Whether the sidebar is expanded */
  isExpanded: boolean;
  /** Whether this menu item is active/selected */
  isActive: boolean;
  /** Whether this menu has expanded submenus */
  isMenuExpanded: boolean;
  /** Callback when the item is clicked */
  onClick: () => void;
}

/**
 * Individual menu item in the sidebar
 *
 * @param props - The component props
 * @returns The rendered menu item
 */
export function SidebarMenuItem({
  item,
  isExpanded,
  isActive,
  isMenuExpanded,
  onClick,
}: SidebarMenuItemProps) {
  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        borderRadius: 1,
        justifyContent: isExpanded ? 'flex-start' : 'center',
        px: 2,
        py: 1.5,
        minHeight: 48,
        backgroundColor: isActive ? 'primary.main' : 'transparent',
        color: isActive ? 'primary.contrastText' : 'text.primary',
        '&:hover': {
          backgroundColor: isActive ? 'primary.dark' : 'action.hover',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {item.icon}
          {isExpanded && (
            <Typography variant="body2" fontWeight={isActive ? 600 : 400}>
              {item.label}
            </Typography>
          )}
        </Box>
        {isExpanded && item.submenu && (
          <Box>
            {isMenuExpanded ? (
              <ExpandMoreIcon sx={{ fontSize: 20 }} />
            ) : (
              <ChevronRightIcon sx={{ fontSize: 20 }} />
            )}
          </Box>
        )}
      </Box>
    </ListItemButton>
  );
}
