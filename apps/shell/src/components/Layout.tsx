import React from 'react';
import { Box, Container } from '@spec-kit-demo-v2/design-system';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          maxWidth: { xs: '100%', sm: 'lg', md: 'xl' },
        }}
      >
        {children}
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Box textAlign="center">
            <small>© 2024 Spec-Kit Demo. All rights reserved.</small>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
