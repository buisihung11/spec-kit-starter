import React, { useState } from 'react';
import { Drawer, Divider } from '@spec-kit-demo-v2/design-system';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavigation } from './SidebarNavigation';
import { NavItem } from './types';

/**
 * Props for the Sidebar component
 */
export interface SidebarProps {
  /** Main navigation items */
  mainItems: NavItem[];
  /** Document section navigation items */
  documentItems: NavItem[];
  /** Width of the expanded drawer */
  drawerWidth?: number;
  /** Width of the collapsed drawer */
  collapsedDrawerWidth?: number;
}

/**
 * Sidebar component with collapsible navigation
 *
 * @param props - The component props
 * @returns The rendered sidebar
 *
 * @example
 * ```tsx
 * <Sidebar
 *   mainItems={mainNavItems}
 *   documentItems={documentNavItems}
 * />
 * ```
 */
export function Sidebar({
  mainItems,
  documentItems,
  drawerWidth = 280,
  collapsedDrawerWidth = 74,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigation = (path: string) => {
    if (path) {
      navigate(path);
    }
  };

  const handleMenuToggle = (label: string) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  // Determine if sidebar should show expanded content
  const isExpanded = !isCollapsed || isHovered;

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: isExpanded ? drawerWidth : collapsedDrawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isExpanded ? drawerWidth : collapsedDrawerWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'grey.100',
          zIndex: (theme) => (isHovered ? theme.zIndex.drawer + 1 : 'auto'),
        },
      }}
    >
      <SidebarHeader
        isExpanded={isExpanded}
        isCollapsed={isCollapsed}
        onToggle={handleDrawerToggle}
      />

      <Divider />

      <SidebarNavigation
        mainItems={mainItems}
        documentItems={documentItems}
        isExpanded={isExpanded}
        activePath={location.pathname}
        expandedMenus={expandedMenus}
        onNavigate={handleNavigation}
        onMenuToggle={handleMenuToggle}
      />
    </Drawer>
  );
}
