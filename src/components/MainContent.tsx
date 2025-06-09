import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from './Dashboard';
import Students from './Students';
import Teachers from './Teachers';
import Classes from './Classes';
import Grades from './Grades';
import Reports from './Reports';
import Settings from './Settings';
import Fees from './Fees';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MainContentProps {
  activeTab: string;
}

const MainContent: React.FC<MainContentProps> = ({ activeTab }) => {
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Students />;
      case 'teachers':
        return <Teachers />;
      case 'classes':
        return <Classes />;
      case 'grades':
        return <Grades />;
      case 'fees':
        return <Fees />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="p-4 md:p-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Feature Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">This feature is under development and will be available soon.</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      {renderContent()}
    </div>
  );
};

export default MainContent;