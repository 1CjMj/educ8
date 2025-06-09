import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, BarChart3, Users, GraduationCap, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ReportData {
  id: string;
  title: string;
  type: string;
  description: string;
  lastGenerated: string;
  icon: any;
  allowedRoles: string[];
}

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('current-term');
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const reportTypes: ReportData[] = [
    {
      id: 'student-performance',
      title: 'Student Performance Report',
      type: 'Academic',
      description: 'Comprehensive analysis of student grades and progress',
      lastGenerated: '2024-03-15',
      icon: BarChart3,
      allowedRoles: ['admin', 'teacher', 'hod', 'parent']
    },
    {
      id: 'attendance-report',
      title: 'Attendance Report',
      type: 'Administrative',
      description: 'Student attendance statistics and patterns',
      lastGenerated: '2024-03-14',
      icon: Users,
      allowedRoles: ['admin', 'teacher', 'hod']
    },
    {
      id: 'class-summary',
      title: 'Class Summary Report',
      type: 'Academic',
      description: 'Overview of class performance and statistics',
      lastGenerated: '2024-03-13',
      icon: GraduationCap,
      allowedRoles: ['admin', 'teacher', 'hod']
    },
    {
      id: 'financial-report',
      title: 'Financial Report',
      type: 'Financial',
      description: 'Fee collection and outstanding payments',
      lastGenerated: '2024-03-12',
      icon: DollarSign,
      allowedRoles: ['admin', 'bursar']
    },
    {
      id: 'teacher-performance',
      title: 'Teacher Performance Report',
      type: 'Administrative',
      description: 'Teacher effectiveness and class management metrics',
      lastGenerated: '2024-03-11',
      icon: Users,
      allowedRoles: ['admin', 'hod']
    },
    {
      id: 'parent-communication',
      title: 'Parent Communication Log',
      type: 'Communication',
      description: 'Record of parent-teacher interactions and meetings',
      lastGenerated: '2024-03-10',
      icon: FileText,
      allowedRoles: ['admin', 'teacher', 'parent']
    },
    {
      id: 'student-progress',
      title: 'Individual Student Progress',
      type: 'Academic',
      description: 'Detailed progress report for individual students',
      lastGenerated: '2024-03-09',
      icon: BarChart3,
      allowedRoles: ['admin', 'teacher', 'parent', 'student']
    },
    {
      id: 'school-calendar',
      title: 'School Calendar Report',
      type: 'Administrative',
      description: 'Upcoming events, holidays, and important dates',
      lastGenerated: '2024-03-08',
      icon: Calendar,
      allowedRoles: ['admin', 'teacher', 'student', 'parent']
    }
  ];

  // Filter reports based on user role
  const availableReports = reportTypes.filter(report => 
    report.allowedRoles.includes(user?.role || '')
  );

  const getReportsByType = () => {
    const grouped = availableReports.reduce((acc, report) => {
      if (!acc[report.type]) {
        acc[report.type] = [];
      }
      acc[report.type].push(report);
      return acc;
    }, {} as Record<string, ReportData[]>);
    
    return grouped;
  };

  const groupedReports = getReportsByType();

  const getQuickStats = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { label: 'Total Students', value: '1,245', color: 'text-blue-600' },
          { label: 'Active Teachers', value: '87', color: 'text-green-600' },
          { label: 'Classes', value: '32', color: 'text-purple-600' },
          { label: 'Attendance Rate', value: '94%', color: 'text-orange-600' }
        ];
      case 'teacher':
        return [
          { label: 'My Students', value: '156', color: 'text-blue-600' },
          { label: 'Classes', value: '5', color: 'text-green-600' },
          { label: 'Avg Performance', value: '78%', color: 'text-purple-600' },
          { label: 'Attendance', value: '92%', color: 'text-orange-600' }
        ];
      case 'student':
        return [
          { label: 'Current Grade', value: 'B+', color: 'text-blue-600' },
          { label: 'Attendance', value: '94%', color: 'text-green-600' },
          { label: 'Assignments', value: '23/25', color: 'text-purple-600' },
          { label: 'Rank', value: '12/45', color: 'text-orange-600' }
        ];
      case 'parent':
        return [
          { label: 'Children', value: '2', color: 'text-blue-600' },
          { label: 'Avg Grade', value: 'B+', color: 'text-green-600' },
          { label: 'Attendance', value: '92%', color: 'text-purple-600' },
          { label: 'Outstanding Fees', value: '$450', color: 'text-red-600' }
        ];
      default:
        return [];
    }
  };

  const quickStats = getQuickStats();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports & Analytics</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Generate and download reports based on your role
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-term">Current Term</SelectItem>
              <SelectItem value="last-term">Last Term</SelectItem>
              <SelectItem value="academic-year">Academic Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      {quickStats.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Available Reports */}
      <div className="space-y-6">
        {Object.entries(groupedReports).map(([type, reports]) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {type} Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {reports.map((report) => {
                  const Icon = report.icon;
                  return (
                    <div key={report.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{report.title}</h3>
                            <Badge variant="secondary" className="text-xs mt-1">{report.type}</Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                        </span>
                        <Button size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {availableReports.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Reports Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have access to any reports with your current role.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;