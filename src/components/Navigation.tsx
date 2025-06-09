import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 md:py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 md:space-x-4">
          <h1 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">Educ8</h1>
          <span className="hidden sm:block text-xs md:text-sm text-gray-500 dark:text-gray-400">School Management System</span>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</span>
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full capitalize">
              {user?.role}
            </span>
          </div>
          <div className="sm:hidden flex items-center space-x-1">
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full capitalize">
              {user?.role}
            </span>
          </div>
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs md:text-sm">
            <LogOut className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;