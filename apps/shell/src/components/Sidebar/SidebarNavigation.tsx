import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Stack,
} from '@spec-kit-demo-v2/design-system';
import { NavItem } from './types';
import { SidebarMenuItem } from './SidebarMenuItem';
import { SidebarSubmenu } from './SidebarSubmenu';

/**
 * Props for the SidebarNavigation component
 */
export interface SidebarNavigationProps {
  /** Main navigation items */
  mainItems: NavItem[];
  /** Document section navigation items */
  documentItems: NavItem[];
  /** Whether the sidebar is expanded */
  isExpanded: boolean;
  /** Current active path */
  activePath: string;
  /** Set of expanded menu labels */
  expandedMenus: Set<string>;
  /** Callback to navigate to a path */
  onNavigate: (path: string) => void;
  /** Callback to toggle menu expansion */
  onMenuToggle: (label: string) => void;
}

/**
 * Navigation section of the sidebar containing all menu items
 *
 * @param props - The component props
 * @returns The rendered navigation section
 */
export function SidebarNavigation({
  mainItems,
  documentItems,
  isExpanded,
  activePath,
  expandedMenus,
  onNavigate,
  onMenuToggle,
}: SidebarNavigationProps) {
  /**
   * Check if a navigation item is active based on current path
   */
  const isItemActive = (item: NavItem): boolean => {
    if (item.path === activePath) return true;
    if (item.submenu) {
      return item.submenu.some((subItem) => subItem.path === activePath);
    }
    return false;
  };

  return (
    <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
      <Stack spacing={0.5} sx={{ p: 1 }}>
        {/* Main Navigation Items */}
        {mainItems.map((item) => {
          const isActive = isItemActive(item);
          const isMenuExpanded = expandedMenus.has(item.label);

          return (
            <React.Fragment key={item.label}>
              <SidebarMenuItem
                item={item}
                isExpanded={isExpanded}
                isActive={isActive}
                isMenuExpanded={isMenuExpanded}
                onClick={() => {
                  if (item.submenu) {
                    onMenuToggle(item.label);
                  } else if (item.path) {
                    onNavigate(item.path);
                  }
                }}
              />

              {/* Submenu Items */}
              {isExpanded && item.submenu && isMenuExpanded && (
                <SidebarSubmenu
                  items={item.submenu}
                  activePath={activePath}
                  onNavigate={onNavigate}
                />
              )}

              {item.dividerAfter && (
                <Divider sx={{ my: 1.5, mx: isExpanded ? 1 : 0 }} />
              )}
            </React.Fragment>
          );
        })}

        {/* Documents Section */}
        {isExpanded && (
          <Typography
            variant="caption"
            sx={{
              px: 2,
              pt: 2,
              pb: 1,
              color: 'text.secondary',
              fontWeight: 'medium',
            }}
          >
            Documents
          </Typography>
        )}

        {/* Document Navigation Items */}
        {documentItems.map((item) => {
          const isActive = isItemActive(item);

          return (
            <SidebarMenuItem
              key={item.label}
              item={item}
              isExpanded={isExpanded}
              isActive={isActive}
              isMenuExpanded={false}
              onClick={() => item.path && onNavigate(item.path)}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
