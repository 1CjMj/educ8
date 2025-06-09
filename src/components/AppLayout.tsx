import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import LoginForm from './LoginForm';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import MainContent from './MainContent';

const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const isMobile = useIsMobile();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navigation />
      {isMobile ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <MainContent activeTab={activeTab} />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <MainContent activeTab={activeTab} />
        </div>
      )}
    </div>
  );
};

export default AppLayout;