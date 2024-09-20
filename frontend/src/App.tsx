// App.tsx
import React from 'react';
import { Layout } from 'antd';
import AppHeader from './components/layout/Header';
import AppFooter from './components/layout/Footer';
import MainLayout from './components/layout/MainLayout';
import { DutyProvider } from './components/context/DutyContext';
import './App.css';

const App: React.FC = () => {
  return (
    <DutyProvider>
      <Layout className="layout">
        <AppHeader />
        <MainLayout />
        <AppFooter />
      </Layout>
    </DutyProvider>
  );
};

export default App;
