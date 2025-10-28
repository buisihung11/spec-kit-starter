# Sidebar Component

A modular, collapsible sidebar navigation component with support for nested menus and active state tracking.

## Component Structure

```
Sidebar/
├── index.ts                  # Main exports
├── types.ts                  # TypeScript type definitions
├── Sidebar.tsx               # Main sidebar container
├── SidebarHeader.tsx         # Header with logo and toggle
├── SidebarNavigation.tsx     # Navigation menu structure
├── SidebarMenuItem.tsx       # Individual menu item
└── SidebarSubmenu.tsx        # Submenu items
```

## Features

- **Collapsible**: Click toggle to collapse/expand
- **Hover Expand**: Automatically expands on hover when collapsed
- **Active State**: Highlights current page/route
- **Nested Menus**: Support for expandable submenus
- **Smooth Transitions**: Animated width changes
- **Responsive Icons**: Centered icons in collapsed state

## Usage

### Basic Example

```tsx
import { Sidebar } from './components/Sidebar';
import { mainNavItems, documentNavItems } from './components/navigationData';

function App() {
  return (
    <Sidebar
      mainItems={mainNavItems}
      documentItems={documentNavItems}
    />
  );
}
```

### With Custom Widths

```tsx
<Sidebar
  mainItems={mainNavItems}
  documentItems={documentNavItems}
  drawerWidth={300}
  collapsedDrawerWidth={80}
/>
```

## Navigation Data Structure

Navigation items follow the `NavItem` interface:

```tsx
interface NavItem {
  label: string;              // Display text
  icon: React.ReactNode;      // Icon component
  path?: string;              // Navigation path
  dividerAfter?: boolean;     // Show divider after item
  submenu?: NavItem[];        // Nested menu items
}
```

### Example Navigation Data

```tsx
const mainNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
  },
  {
    label: 'Projects',
    icon: <FolderIcon />,
    path: '/projects',
    submenu: [
      {
        label: 'All Projects',
        icon: <ListIcon />,
        path: '/projects',
      },
      {
        label: 'Create New',
        icon: <AddIcon />,
        path: '/projects/new',
      },
    ],
    dividerAfter: true,
  },
];
```

## Component Breakdown

### Sidebar (Main Container)

- Manages collapse/expand state
- Handles hover interactions
- Tracks expanded submenus
- Provides navigation functionality

### SidebarHeader

- Displays company logo/name
- Contains collapse/expand toggle button
- Adapts to collapsed state

### SidebarNavigation

- Renders all navigation sections
- Manages active state highlighting
- Handles menu item interactions
- Organizes main and document sections

### SidebarMenuItem

- Individual clickable menu item
- Shows icon and label (when expanded)
- Indicates active state with styling
- Shows expand/collapse indicator for submenus

### SidebarSubmenu

- Renders nested menu items
- Indented for visual hierarchy
- Tracks active state for submenu items
- Slightly smaller styling than main items

## Active State Logic

The sidebar automatically highlights the active route by:

1. Comparing current `location.pathname` with item paths
2. Checking if any submenu item matches the current path
3. Applying `action.selected` background color
4. Using bold font weight (600) for active items

## Styling

The sidebar uses Material-UI's `sx` prop for styling:

- **Expanded Width**: 280px (default)
- **Collapsed Width**: 74px (default)
- **Transitions**: 0.3s ease for width changes
- **Active Color**: `action.selected` from theme
- **Hover Color**: `action.hover` from theme

## TypeScript Support

All components are fully typed with exported interfaces:

- `SidebarProps`
- `SidebarHeaderProps`
- `SidebarMenuItemProps`
- `SidebarSubmenuProps`
- `SidebarNavigationProps`
- `NavItem`

## Accessibility

- Semantic button elements for interactions
- Proper ARIA labels (inherited from Material-UI)
- Keyboard navigation support
- Clear visual focus indicators
