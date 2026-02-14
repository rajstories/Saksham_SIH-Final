import React from 'react';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './components/pages/DashboardPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <ErrorBoundary>
          <DashboardPage />
        </ErrorBoundary>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
