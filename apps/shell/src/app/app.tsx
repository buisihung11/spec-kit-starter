import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppTheme } from '@spec-kit-demo-v2/design-system';
import { Layout } from '../components/Layout';
import { Home } from '../components/Home';
import { Login } from '../components/Login';

const NewInstructionsUi = React.lazy(
  () => import('newInstructionsUi/Module')
);

export function App() {
  return (
    <AppTheme defaultMode="light">
      <Layout>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/new-instructions-ui/*" element={<NewInstructionsUi />} />
          </Routes>
        </React.Suspense>
      </Layout>
    </AppTheme>
  );
}

export default App;
