import * as React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
} from '@spec-kit-demo-v2/design-system';
import AssignmentIcon from '@mui/icons-material/Assignment';

export function App() {
  return (
    <Box>
      <Paper
        elevation={2}
        sx={{
          py: 4,
          px: 3,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <AssignmentIcon sx={{ fontSize: 50, mr: 2 }} />
          <Typography variant="h3" component="h1">
            New Instructions UI
          </Typography>
        </Box>
        <Typography variant="h6" align="center">
          Microfrontend Remote Application
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
        <Card sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '250px' }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Instructions
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This is a placeholder for the instructions module. You can add your instruction management features here.
            </Typography>
            <Button variant="contained" color="primary">
              View Instructions
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '250px' }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Create New
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Create new instructions with templates and guidelines for your team.
            </Typography>
            <Button variant="contained" color="primary">
              Create
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '250px' }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Templates
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Browse and manage instruction templates for common scenarios.
            </Typography>
            <Button variant="contained" color="primary">
              Browse
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          About This Module
        </Typography>
        <Typography variant="body1" paragraph>
          This is a remotely loaded microfrontend module using Module Federation. It demonstrates:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              Independent deployment and development
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              Shared dependencies with the host application
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              Lazy loading for optimal performance
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              Consistent styling using Material UI
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default App;
