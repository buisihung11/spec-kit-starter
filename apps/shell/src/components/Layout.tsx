import React from 'react';
import { Box, Container, Typography, Stack } from '@spec-kit-demo-v2/design-system';
import DescriptionIcon from '@mui/icons-material/Description';
import { Sidebar } from './Sidebar';
import { mainNavItems, documentNavItems } from './navigationData';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar mainItems={mainNavItems} documentItems={documentNavItems} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'grey.100',
          transition: 'margin-left 0.3s ease, width 0.3s ease',
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
            backgroundColor: 'background.paper',
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
