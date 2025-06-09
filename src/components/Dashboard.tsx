import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, BookOpen, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'parent' || user?.role === 'bursar') {
      fetchFeesData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFeesData = async () => {
    try {
      let query = supabase.from('fees').select('outstanding_amount');
      
      if (user?.role === 'parent') {
        query = query.eq('parent_id', user.id);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      const total = data?.reduce((sum, fee) => sum + fee.outstanding_amount, 0) || 0;
      setTotalOutstanding(total);
    } catch (error) {
      console.error('Error fetching fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatsCards = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { title: 'Total Students', value: '1,245', icon: GraduationCap, color: 'text-blue-600 dark:text-blue-400', onClick: () => navigate('/students') },
          { title: 'Total Teachers', value: '87', icon: Users, color: 'text-green-600 dark:text-green-400', onClick: () => navigate('/teachers') },
          { title: 'Active Classes', value: '32', icon: BookOpen, color: 'text-purple-600 dark:text-purple-400', onClick: () => navigate('/classes') },
          { title: 'Fees Management', value: 'View', icon: DollarSign, color: 'text-orange-600 dark:text-orange-400', onClick: () => navigate('/fees') }
        ];
      case 'teacher':
        return [
          { title: 'My Classes', value: '5', icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', onClick: () => navigate('/classes') },
          { title: 'Total Students', value: '156', icon: GraduationCap, color: 'text-green-600 dark:text-green-400', onClick: () => navigate('/students') },
          { title: 'Pending Grades', value: '23', icon: TrendingUp, color: 'text-orange-600 dark:text-orange-400', onClick: () => navigate('/grades') },
          { title: 'Messages', value: '7', icon: Users, color: 'text-purple-600 dark:text-purple-400', onClick: () => navigate('/reports') }
        ];
      case 'student':
        return [
          { title: 'Current Subjects', value: '8', icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', onClick: () => navigate('/classes') },
          { title: 'Attendance Rate', value: '94%', icon: TrendingUp, color: 'text-green-600 dark:text-green-400', onClick: () => navigate('/grades') },
          { title: 'Assignments Due', value: '3', icon: Calendar, color: 'text-orange-600 dark:text-orange-400', onClick: () => navigate('/grades') },
          { title: 'Classmates', value: '32', icon: Users, color: 'text-purple-600 dark:text-purple-400', onClick: () => navigate('/students') }
        ];
      case 'parent':
        return [
          { title: 'Children', value: '2', icon: Users, color: 'text-blue-600 dark:text-blue-400', onClick: () => navigate('/students') },
          { title: 'Avg Attendance', value: '92%', icon: TrendingUp, color: 'text-green-600 dark:text-green-400', onClick: () => navigate('/grades') },
          { title: 'Outstanding Fees', value: loading ? 'Loading...' : `$${totalOutstanding.toFixed(2)}`, icon: DollarSign, color: 'text-red-600 dark:text-red-400', onClick: () => navigate('/fees') },
          { title: 'New Messages', value: '4', icon: Users, color: 'text-purple-600 dark:text-purple-400', onClick: () => navigate('/reports') }
        ];
      case 'bursar':
        return [
          { title: 'Total Revenue', value: '$125,430', icon: DollarSign, color: 'text-green-600 dark:text-green-400', onClick: () => navigate('/fees') },
          { title: 'Outstanding Fees', value: loading ? 'Loading...' : `$${totalOutstanding.toFixed(2)}`, icon: DollarSign, color: 'text-red-600 dark:text-red-400', onClick: () => navigate('/fees') },
          { title: 'Payment Rate', value: '87%', icon: TrendingUp, color: 'text-blue-600 dark:text-blue-400', onClick: () => navigate('/fees') },
          { title: 'Students', value: '1,245', icon: GraduationCap, color: 'text-purple-600 dark:text-purple-400', onClick: () => navigate('/students') }
        ];
      case 'hod':
        return [
          { title: 'Department Teachers', value: '12', icon: Users, color: 'text-blue-600 dark:text-blue-400', onClick: () => navigate('/teachers') },
          { title: 'Department Students', value: '340', icon: GraduationCap, color: 'text-green-600 dark:text-green-400', onClick: () => navigate('/students') },
          { title: 'Subjects', value: '6', icon: BookOpen, color: 'text-purple-600 dark:text-purple-400', onClick: () => navigate('/classes') },
          { title: 'Avg Performance', value: '78%', icon: TrendingUp, color: 'text-orange-600 dark:text-orange-400', onClick: () => navigate('/grades') }
        ];
      default:
        return [];
    }
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'teacher':
        return [
          { label: 'Mark Attendance', onClick: () => navigate('/grades') },
          { label: 'Enter Grades', onClick: () => navigate('/grades') },
          { label: 'View My Classes', onClick: () => navigate('/classes') },
          { label: 'Send Message to Parents', onClick: () => navigate('/reports') }
        ];
      case 'admin':
        return [
          { label: 'Add New Student', onClick: () => navigate('/students') },
          { label: 'Manage Classes', onClick: () => navigate('/classes') },
          { label: 'View All Teachers', onClick: () => navigate('/teachers') },
          { label: 'Manage Fees', onClick: () => navigate('/fees') }
        ];
      case 'parent':
        return [
          { label: 'View Children\'s Fees', onClick: () => navigate('/fees') },
          { label: 'Check Grades', onClick: () => navigate('/grades') },
          { label: 'View Children', onClick: () => navigate('/students') },
          { label: 'Contact Teachers', onClick: () => navigate('/reports') }
        ];
      case 'bursar':
        return [
          { label: 'Update Fee Payments', onClick: () => navigate('/fees') },
          { label: 'Generate Fee Reports', onClick: () => navigate('/reports') },
          { label: 'View All Students', onClick: () => navigate('/students') },
          { label: 'Manage Outstanding Fees', onClick: () => navigate('/fees') }
        ];
      case 'student':
        return [
          { label: 'View Timetable', onClick: () => navigate('/classes') },
          { label: 'Check Grades', onClick: () => navigate('/grades') },
          { label: 'View Classmates', onClick: () => navigate('/students') },
          { label: 'Check Assignments', onClick: () => navigate('/grades') }
        ];
      case 'hod':
        return [
          { label: 'Manage Department', onClick: () => navigate('/teachers') },
          { label: 'View Department Classes', onClick: () => navigate('/classes') },
          { label: 'Review Performance', onClick: () => navigate('/grades') },
          { label: 'Generate Reports', onClick: () => navigate('/reports') }
        ];
      default:
        return [
          { label: 'View Students', onClick: () => navigate('/students') },
          { label: 'View Reports', onClick: () => navigate('/reports') },
          { label: 'Check Grades', onClick: () => navigate('/grades') },
          { label: 'View Classes', onClick: () => navigate('/classes') }
        ];
    }
  };

  const statsCards = getStatsCards();
  const quickActions = getQuickActions();

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back, {user?.name}!</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">Here's what's happening at your school today.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer"
              onClick={card.onClick}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-xl md:text-2xl font-bold ${card.color}`}>
                  {card.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 text-lg md:text-xl">Recent Activity</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">New student enrollment: John Mukamuri</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Grade submission completed for Form 2A</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Parent-teacher meeting scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 text-lg md:text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">Common tasks for your role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 md:space-y-2">
              {quickActions.map((action, index) => (
                <button 
                  key={index}
                  onClick={action.onClick}
                  className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-xs md:text-sm text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;