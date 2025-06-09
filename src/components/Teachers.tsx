import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Mail, Phone, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  department: string;
  status: 'active' | 'inactive';
  experience: number;
}

const Teachers: React.FC = () => {
  const { user } = useAuth();
  const [teachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'Mrs. Sarah Mukamuri',
      email: 'sarah.mukamuri@school.zw',
      phone: '+263 77 123 4567',
      subjects: ['Mathematics', 'Physics'],
      classes: ['Form 4A', 'Form 4B'],
      department: 'Sciences',
      status: 'active',
      experience: 8
    },
    {
      id: '2',
      name: 'Mr. John Sibanda',
      email: 'john.sibanda@school.zw',
      phone: '+263 71 234 5678',
      subjects: ['English', 'Literature'],
      classes: ['Form 2B', 'Form 3A'],
      department: 'Languages',
      status: 'active',
      experience: 12
    },
    {
      id: '3',
      name: 'Ms. Grace Chikwanha',
      email: 'grace.chikwanha@school.zw',
      phone: '+263 78 345 6789',
      subjects: ['Biology', 'Chemistry'],
      classes: ['Form 3A', 'Form 3B'],
      department: 'Sciences',
      status: 'active',
      experience: 6
    },
    {
      id: '4',
      name: 'Mr. Peter Ndoro',
      email: 'peter.ndoro@school.zw',
      phone: '+263 77 456 7890',
      subjects: ['History', 'Geography'],
      classes: ['Form 1A', 'Form 2A'],
      department: 'Humanities',
      status: 'active',
      experience: 15
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const canEdit = user?.role === 'admin' || user?.role === 'hod';
  const canView = user?.role !== 'student'; // Students can't view teacher details

  // Role-based filtering
  const getFilteredTeachers = () => {
    let filtered = teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // If HOD role, show only department teachers
    if (user?.role === 'hod') {
      filtered = filtered.filter(teacher => teacher.department === 'Sciences'); // HOD's department
    }

    return filtered;
  };

  const filteredTeachers = getFilteredTeachers();

  if (!canView) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Access Restricted
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Students do not have access to teacher information.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user?.role === 'hod' ? 'Department Teachers' : 'Teachers'}
          </h1>
          {user?.role === 'hod' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Teachers in your department
            </p>
          )}
        </div>
        {canEdit && (
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Teacher
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{teacher.name}</h3>
                      <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                        {teacher.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{teacher.department} Department</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{teacher.experience} years experience</p>
                  </div>
                  {canEdit && (
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    <span>{teacher.classes.length} classes</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subjects:</p>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Classes:</p>
                  <div className="flex flex-wrap gap-1">
                    {teacher.classes.map((cls, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Teachers;