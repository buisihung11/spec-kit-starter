import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';
import StorageIcon from '@mui/icons-material/Storage';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { NavItem } from './Sidebar/types';

/**
 * Main navigation items for the sidebar
 */
export const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
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

/**
 * Document section navigation items for the sidebar
 */
export const documentNavItems: NavItem[] = [
  { label: 'Data Library', icon: <StorageIcon />, path: '/data-library' },
  { label: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  {
    label: 'Word Assistant',
    icon: <DescriptionIcon />,
    path: '/word-assistant',
  },
  { label: 'More', icon: <MoreHorizIcon />, path: '/more' },
];
