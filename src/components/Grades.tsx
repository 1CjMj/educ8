import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Grade {
  id: string;
  studentName: string;
  studentId: string;
  class: string;
  subject: string;
  assignment: string;
  grade: string;
  percentage: number;
  date: string;
  teacher: string;
  term: string;
  parentId?: string;
}

const Grades: React.FC = () => {
  const { user } = useAuth();
  const [grades] = useState<Grade[]>([
    {
      id: '1',
      studentName: 'Tinashe Moyo',
      studentId: '1',
      class: 'Form 4A',
      subject: 'Mathematics',
      assignment: 'Mid-term Exam',
      grade: 'A',
      percentage: 87,
      date: '2024-03-15',
      teacher: 'Mrs. Sarah Mukamuri',
      term: 'Term 1',
      parentId: '4'
    },
    {
      id: '2',
      studentName: 'Chipo Mukamuri',
      studentId: '2',
      class: 'Form 3B',
      subject: 'Biology',
      assignment: 'Lab Report',
      grade: 'B+',
      percentage: 82,
      date: '2024-03-12',
      teacher: 'Ms. Grace Chikwanha',
      term: 'Term 1',
      parentId: '7'
    },
    {
      id: '3',
      studentName: 'John Mukamuri',
      studentId: '3',
      class: 'Form 4A',
      subject: 'Physics',
      assignment: 'Quiz 1',
      grade: 'B',
      percentage: 78,
      date: '2024-03-10',
      teacher: 'Mrs. Sarah Mukamuri',
      term: 'Term 1',
      parentId: '7'
    },
    {
      id: '4',
      studentName: 'Tinashe Moyo',
      studentId: '1',
      class: 'Form 4A',
      subject: 'English',
      assignment: 'Essay Assignment',
      grade: 'B+',
      percentage: 82,
      date: '2024-03-08',
      teacher: 'Mr. Peter Ndoro',
      term: 'Term 1',
      parentId: '4'
    },
    {
      id: '5',
      studentName: 'John Mukamuri',
      studentId: '3',
      class: 'Form 4A',
      subject: 'Mathematics',
      assignment: 'Quiz 2',
      grade: 'A-',
      percentage: 85,
      date: '2024-03-05',
      teacher: 'Mrs. Sarah Mukamuri',
      term: 'Term 1',
      parentId: '7'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [filterTerm, setFilterTerm] = useState('all');

  const canEdit = user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'hod';

  // Role-based filtering
  const getFilteredGrades = () => {
    let filtered = grades.filter(grade => {
      const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           grade.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           grade.assignment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = filterSubject === 'all' || grade.subject === filterSubject;
      const matchesClass = filterClass === 'all' || grade.class === filterClass;
      const matchesTerm = filterTerm === 'all' || grade.term === filterTerm;
      
      return matchesSearch && matchesSubject && matchesClass && matchesTerm;
    });

    // Role-based filtering
    if (user?.role === 'student') {
      filtered = filtered.filter(grade => grade.studentId === '1'); // Current user's grades
    } else if (user?.role === 'teacher') {
      filtered = filtered.filter(grade => grade.teacher === 'Mrs. Sarah Mukamuri'); // Teacher's classes
    } else if (user?.role === 'parent') {
      // Parent sees only their children's grades
      filtered = filtered.filter(grade => grade.parentId === user.id);
    }

    return filtered;
  };

  const filteredGrades = getFilteredGrades();
  const subjects = [...new Set(grades.map(g => g.subject))];
  const classes = [...new Set(grades.map(g => g.class))];
  const terms = [...new Set(grades.map(g => g.term))];

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 70) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getGradeBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return 'default';
    if (percentage >= 70) return 'secondary';
    return 'outline';
  };

  const calculateStats = () => {
    if (filteredGrades.length === 0) return { average: 0, trend: 'stable' };
    
    const average = filteredGrades.reduce((sum, grade) => sum + grade.percentage, 0) / filteredGrades.length;
    const recent = filteredGrades.slice(-3);
    const older = filteredGrades.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return { average, trend: 'stable' };
    
    const recentAvg = recent.reduce((sum, grade) => sum + grade.percentage, 0) / recent.length;
    const olderAvg = older.reduce((sum, grade) => sum + grade.percentage, 0) / older.length;
    
    const trend = recentAvg > olderAvg ? 'up' : recentAvg < olderAvg ? 'down' : 'stable';
    
    return { average, trend };
  };

  const stats = calculateStats();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user?.role === 'student' ? 'My Grades' : user?.role === 'parent' ? "Children's Grades" : 'Grades'}
          </h1>
          {(user?.role === 'student' || user?.role === 'parent') && (
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average:</span>
                <span className={`font-semibold ${getGradeColor(stats.average)}`}>
                  {stats.average.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-1">
                {stats.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                {stats.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{stats.trend}</span>
              </div>
            </div>
          )}
        </div>
        {canEdit && (
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Grade
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search grades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterTerm} onValueChange={setFilterTerm}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  {terms.map(term => (
                    <SelectItem key={term} value={term}>{term}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredGrades.map((grade) => (
              <div key={grade.id} className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 border rounded-lg gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{grade.assignment}</h3>
                    <Badge variant={getGradeBadgeVariant(grade.percentage)}>
                      {grade.grade} ({grade.percentage}%)
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>{grade.subject}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{grade.class}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{grade.term}</span>
                  </div>
                  {user?.role !== 'student' && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Student: {grade.studentName} • Teacher: {grade.teacher}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(grade.date).toLocaleDateString()}
                  </p>
                </div>
                {canEdit && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {filteredGrades.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {user?.role === 'parent' ? 'No grades found for your children.' : 'No grades found matching your criteria.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Grades;