/**
 * Type definitions for Sidebar components
 */

/**
 * Represents a navigation item in the sidebar
 */
export interface NavItem {
  /** Display label for the navigation item */
  label: string;
  /** Icon element to display */
  icon: React.ReactNode;
  /** Optional path to navigate to */
  path?: string;
  /** Whether to show a divider after this item */
  dividerAfter?: boolean;
  /** Optional submenu items */
  submenu?: NavItem[];
}
