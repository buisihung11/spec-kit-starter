import * as React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';

export const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'New Instructions',
      description: 'Access the new instructions UI module with enhanced features and functionality.',
      icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
      path: '/new-instructions-ui',
    },
    {
      title: 'Dashboard',
      description: 'View your dashboard with real-time updates and insights.',
      icon: <DashboardIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard',
    },
  ];

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          py: 6,
          px: 2,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to Spec-Kit Demo
        </Typography>
        <Typography variant="h6" align="center" paragraph>
          A modern microfrontend architecture powered by NX, React, and Material UI
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {features.map((feature, index) => (
          <Card
            key={index}
            sx={{
              flex: '1 1 calc(50% - 12px)',
              minWidth: '280px',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2,
                  color: 'primary.main',
                }}
              >
                {feature.icon}
              </Box>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                {feature.title}
              </Typography>
              <Typography align="center" color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button
                size="large"
                variant="contained"
                onClick={() => navigate(feature.path)}
              >
                Explore
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          About This Project
        </Typography>
        <Typography variant="body1" paragraph>
          This is a demonstration of a microfrontend architecture using:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>NX Monorepo:</strong> For efficient workspace management and build orchestration
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Module Federation:</strong> For seamless integration of independently deployed applications
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>React Router:</strong> For client-side routing and navigation
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Material UI:</strong> For consistent and beautiful user interfaces
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
