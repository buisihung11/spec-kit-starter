import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Layout } from '../components/Layout';
import { Home } from '../components/Home';
import { Login } from '../components/Login';

const NewInstructionsUi = React.lazy(
  () => import('newInstructionsUi/Module')
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/new-instructions-ui" element={<NewInstructionsUi />} />
          </Routes>
        </React.Suspense>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
