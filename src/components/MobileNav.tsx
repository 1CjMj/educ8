import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, Home, Users, GraduationCap, BookOpen, BarChart3, FileText, Settings, LogOut, DollarSign } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home }
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'teachers', label: 'Teachers', icon: Users },
          { id: 'classes', label: 'Classes', icon: BookOpen },
          { id: 'grades', label: 'Grades', icon: BarChart3 },
          { id: 'fees', label: 'Fees', icon: DollarSign },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      case 'teacher':
        return [
          ...baseItems,
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'classes', label: 'My Classes', icon: BookOpen },
          { id: 'grades', label: 'Grades', icon: BarChart3 },
          { id: 'reports', label: 'Reports', icon: FileText }
        ];
      case 'student':
        return [
          ...baseItems,
          { id: 'students', label: 'Classmates', icon: Users },
          { id: 'classes', label: 'My Classes', icon: BookOpen },
          { id: 'grades', label: 'My Grades', icon: BarChart3 }
        ];
      case 'parent':
        return [
          ...baseItems,
          { id: 'students', label: 'Children', icon: GraduationCap },
          { id: 'grades', label: 'Grades', icon: BarChart3 },
          { id: 'fees', label: 'Fees', icon: DollarSign },
          { id: 'reports', label: 'Reports', icon: FileText }
        ];
      case 'hod':
        return [
          ...baseItems,
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'teachers', label: 'Teachers', icon: Users },
          { id: 'classes', label: 'Classes', icon: BookOpen },
          { id: 'grades', label: 'Grades', icon: BarChart3 },
          { id: 'reports', label: 'Reports', icon: FileText }
        ];
      case 'bursar':
        return [
          ...baseItems,
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'fees', label: 'Fees Management', icon: DollarSign },
          { id: 'reports', label: 'Financial Reports', icon: FileText }
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Educ8</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user?.role?.toUpperCase()}</p>
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
            <Button variant="outline" className="w-full" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;