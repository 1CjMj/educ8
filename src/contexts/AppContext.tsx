import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthProvider } from './AuthContext';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <AuthProvider>
      <AppContext.Provider
        value={{
          sidebarOpen,
          toggleSidebar,
        }}
      >
        {children}
      </AppContext.Provider>
    </AuthProvider>
  );
};