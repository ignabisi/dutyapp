// Header.tsx
import React from 'react';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  return (
    <Header style={{ backgroundColor: '#333', height: '64px', lineHeight: '64px', padding: '0 20px' }}>
      
      <img 
        src="/dutylogo.svg" 
        alt="DutyApp Logo" 
        style={{ height: '40px', margin: '10px 5px 5px 5px', padding: '0', backgroundColor: 'transparent' }} 
      /> 
    </Header>
  );
};

export default AppHeader;
