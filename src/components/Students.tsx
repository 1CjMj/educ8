import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import StudentDetail from './StudentDetail';

interface Student {
  id: string;
  name: string;
  class: string;
  age: number;
  guardianPhone: string;
  email: string;
  address: string;
  dateOfBirth: string;
  status: 'active' | 'inactive';
  extracurriculars: string[];
  grades: { subject: string; grade: string; }[];
  parentId?: string;
}

const Students: React.FC = () => {
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students] = useState<Student[]>([
    { 
      id: '1', 
      name: 'Tinashe Moyo', 
      class: 'Form 4A', 
      age: 17, 
      guardianPhone: '+263 77 123 4567',
      email: 'tinashe.moyo@school.zw',
      address: '123 Harare Drive, Harare',
      dateOfBirth: '2007-03-15',
      status: 'active',
      parentId: '4',
      extracurriculars: ['Football', 'Debate Club', 'Mathematics Olympiad'],
      grades: [
        { subject: 'Mathematics', grade: 'A' },
        { subject: 'English', grade: 'B+' },
        { subject: 'Physics', grade: 'A-' },
        { subject: 'Chemistry', grade: 'B' }
      ]
    },
    { 
      id: '2', 
      name: 'Chipo Mukamuri', 
      class: 'Form 3B', 
      age: 16, 
      guardianPhone: '+263 71 234 5678',
      email: 'chipo.mukamuri@school.zw',
      address: '456 Bulawayo Street, Bulawayo',
      dateOfBirth: '2008-07-22',
      status: 'active',
      parentId: '7',
      extracurriculars: ['Netball', 'Drama Club', 'Environmental Club'],
      grades: [
        { subject: 'Biology', grade: 'A' },
        { subject: 'English', grade: 'A-' },
        { subject: 'History', grade: 'B+' }
      ]
    },
    { 
      id: '3', 
      name: 'John Mukamuri', 
      class: 'Form 4A', 
      age: 17, 
      guardianPhone: '+263 78 345 6789',
      email: 'john.mukamuri@school.zw',
      address: '789 Gweru Avenue, Gweru',
      dateOfBirth: '2007-05-10',
      status: 'active',
      parentId: '7',
      extracurriculars: ['Cricket', 'Chess Club'],
      grades: [
        { subject: 'Mathematics', grade: 'B+' },
        { subject: 'English', grade: 'A-' },
        { subject: 'Physics', grade: 'B' }
      ]
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  // Role-based filtering
  const getFilteredStudents = () => {
    let filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // If student role, show only classmates
    if (user?.role === 'student') {
      const userClass = 'Form 4A'; // This would come from user data
      filtered = filtered.filter(student => student.class === userClass && student.id !== '1');
    }
    // If parent role, show only their children
    else if (user?.role === 'parent') {
      filtered = filtered.filter(student => student.parentId === user.id);
    }

    return filtered;
  };

  const filteredStudents = getFilteredStudents();
  const canEdit = user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'hod';

  if (selectedStudent) {
    return (
      <StudentDetail 
        student={selectedStudent} 
        onBack={() => setSelectedStudent(null)} 
      />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user?.role === 'student' ? 'My Classmates' : user?.role === 'parent' ? 'My Children' : 'Students'}
          </h1>
          {user?.role === 'student' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Students in your class
            </p>
          )}
          {user?.role === 'parent' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Your children's information
            </p>
          )}
        </div>
        {canEdit && (
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{student.name}</h3>
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {student.class} • Age: {student.age} • Guardian: {student.guardianPhone}
                  </p>
                  {user?.role !== 'student' && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {student.email}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {canEdit && (
                    <>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {user?.role === 'parent' ? 'No children found.' : 'No students found matching your criteria.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;