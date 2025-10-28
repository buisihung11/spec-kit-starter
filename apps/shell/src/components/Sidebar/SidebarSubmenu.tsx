import React from 'react';
import {
  Box,
  ListItemButton,
  Typography,
  Stack,
} from '@spec-kit-demo-v2/design-system';
import { NavItem } from './types';

/**
 * Props for the SidebarSubmenu component
 */
export interface SidebarSubmenuProps {
  /** Array of submenu items to render */
  items: NavItem[];
  /** Current active path */
  activePath: string;
  /** Callback when a submenu item is clicked */
  onNavigate: (path: string) => void;
}

/**
 * Submenu component for nested navigation items
 *
 * @param props - The component props
 * @returns The rendered submenu
 */
export function SidebarSubmenu({
  items,
  activePath,
  onNavigate,
}: SidebarSubmenuProps) {
  return (
    <Stack spacing={0.5} sx={{ pl: 2 }}>
      {items.map((subItem) => {
        const isActive = subItem.path === activePath;

        return (
          <ListItemButton
            key={subItem.label}
            onClick={() => subItem.path && onNavigate(subItem.path)}
            sx={{
              borderRadius: 1,
              px: 2,
              py: 1,
              minHeight: 40,
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
                gap: 2,
                width: '100%',
              }}
            >
              {subItem.icon}
              <Typography
                variant="body2"
                sx={{ fontSize: '0.875rem' }}
                fontWeight={isActive ? 600 : 400}
              >
                {subItem.label}
              </Typography>
            </Box>
          </ListItemButton>
        );
      })}
    </Stack>
  );
}
