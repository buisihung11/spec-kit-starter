import React, { useState } from 'react';
import {
  Box,
  Container,
  Drawer,
  IconButton,
  Typography,
  Divider,
  ListItemButton,
  Stack,
} from '@spec-kit-demo-v2/design-system';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';
import StorageIcon from '@mui/icons-material/Storage';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;
const collapsedDrawerWidth = 74;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  dividerAfter?: boolean;
  submenu?: NavItem[];
}

const mainNavItems: NavItem[] = [
  { label: 'Quick Create', icon: <MenuIcon />, path: '/quick-create' },
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Lifecycle', icon: <DescriptionIcon />, path: '/lifecycle' },
  { label: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { label: 'Projects', icon: <FolderIcon />, path: '/projects' },
  { label: 'Team', icon: <PeopleIcon />, path: '/team' },
  {
    label: 'New Instructions UI',
    icon: <AssignmentIcon />,
    path: '/new-instructions-ui',
    submenu: [
      {
        label: 'Available Forms',
        icon: <ListAltIcon />,
        path: '/new-instructions-ui',
      },
      {
        label: 'Manage Claims',
        icon: <ManageAccountsIcon />,
        path: '/new-instructions-ui/manage-claims',
      },
    ],
    dividerAfter: true,
  },
];

const documentNavItems: NavItem[] = [
  { label: 'Data Library', icon: <StorageIcon />, path: '/data-library' },
  { label: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { label: 'Word Assistant', icon: <DescriptionIcon />, path: '/word-assistant' },
  { label: 'More', icon: <MoreHorizIcon />, path: '/more' },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
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
            zIndex: (theme) => (isHovered ? theme.zIndex.drawer + 1 : 'auto'),
          },
        }}
      >
        {/* Sidebar Header */}
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
            onClick={handleDrawerToggle}
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

        <Divider />

        {/* Main Navigation */}
        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
          <Stack spacing={0.5} sx={{ p: 1 }}>
            {mainNavItems.map((item, index) => (
              <React.Fragment key={item.label}>
                <ListItemButton
                  onClick={() => {
                    if (item.submenu) {
                      handleMenuToggle(item.label);
                    } else if (item.path) {
                      handleNavigation(item.path);
                    }
                  }}
                  sx={{
                    borderRadius: 1,
                    justifyContent: isExpanded ? 'flex-start' : 'center',
                    px: 2,
                    py: 1.5,
                    minHeight: 48,
                    backgroundColor:
                      item.label === 'Quick Create'
                        ? 'primary.main'
                        : 'transparent',
                    color:
                      item.label === 'Quick Create'
                        ? 'primary.contrastText'
                        : 'text.primary',
                    '&:hover': {
                      backgroundColor:
                        item.label === 'Quick Create'
                          ? 'primary.dark'
                          : 'action.hover',
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
                        <Typography variant="body2">{item.label}</Typography>
                      )}
                    </Box>
                    {isExpanded && item.submenu && (
                      <Box>
                        {expandedMenus.has(item.label) ? (
                          <ExpandMoreIcon sx={{ fontSize: 20 }} />
                        ) : (
                          <ChevronRightIcon sx={{ fontSize: 20 }} />
                        )}
                      </Box>
                    )}
                  </Box>
                </ListItemButton>

                {/* Submenu Items */}
                {isExpanded && item.submenu && expandedMenus.has(item.label) && (
                  <Stack spacing={0.5} sx={{ pl: 2 }}>
                    {item.submenu.map((subItem) => (
                      <ListItemButton
                        key={subItem.label}
                        onClick={() =>
                          subItem.path && handleNavigation(subItem.path)
                        }
                        sx={{
                          borderRadius: 1,
                          px: 2,
                          py: 1,
                          minHeight: 40,
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
                          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                            {subItem.label}
                          </Typography>
                        </Box>
                      </ListItemButton>
                    ))}
                  </Stack>
                )}

                {item.dividerAfter && (
                  <Divider sx={{ my: 1.5, mx: isExpanded ? 1 : 0 }} />
                )}
              </React.Fragment>
            ))}

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

            {documentNavItems.map((item) => (
              <ListItemButton
                key={item.label}
                onClick={() => item.path && handleNavigation(item.path)}
                sx={{
                  borderRadius: 1,
                  justifyContent: isExpanded ? 'flex-start' : 'center',
                  px: 2,
                  py: 1.5,
                  minHeight: 48,
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
                  {item.icon}
                  {isExpanded && (
                    <Typography variant="body2">{item.label}</Typography>
                  )}
                </Box>
              </ListItemButton>
            ))}
          </Stack>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            py: 2,
            minHeight: 64,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <DescriptionIcon />
            <Typography variant="h6">Documents</Typography>
          </Stack>
          <Typography variant="body1">GitHub</Typography>
        </Box>

        {/* Page Content */}
        <Container
          maxWidth={false}
          sx={{
            flexGrow: 1,
            py: 4,
            px: 4,
          }}
        >
          {children}
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 4,
            mt: 'auto',
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary">
              © 2024 Spec-Kit Demo. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
