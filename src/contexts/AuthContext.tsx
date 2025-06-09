import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'bursar' | 'hod';
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoUsers: User[] = [
  { id: '1', username: 'admin', role: 'admin', name: 'System Administrator', email: 'admin@school.zw' },
  { id: '2', username: 'teacher1', role: 'teacher', name: 'Mrs. Sarah Mukamuri', email: 'sarah@school.zw' },
  { id: '3', username: 'student1', role: 'student', name: 'Tinashe Moyo', email: 'tinashe@school.zw' },
  { id: '4', username: 'parent1', role: 'parent', name: 'Mr. John Moyo', email: 'john@school.zw' },
  { id: '5', username: 'bursar', role: 'bursar', name: 'Mrs. Grace Chikwanha', email: 'grace@school.zw' },
  { id: '6', username: 'hod1', role: 'hod', name: 'Mr. Peter Ndoro', email: 'peter@school.zw' },
  { id: '7', username: 'parent2', role: 'parent', name: 'Mrs. Mary Mukamuri', email: 'mary@school.zw' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('educ8_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = demoUsers.find(u => u.username === username);
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      localStorage.setItem('educ8_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('educ8_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};