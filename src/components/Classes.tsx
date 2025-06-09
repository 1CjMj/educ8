import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Users, Clock, MapPin, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ClassDetail from './ClassDetail';

interface ClassStudent {
  id: string;
  name: string;
  age: number;
  guardianPhone: string;
  email: string;
  status: 'active' | 'inactive';
}

interface Class {
  id: string;
  name: string;
  teacher: string;
  room: string;
  schedule: string;
  subjects: string[];
  students: ClassStudent[];
}

const Classes: React.FC = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [classes] = useState<Class[]>([
    { 
      id: '1', 
      name: 'Form 1A', 
      teacher: 'Mrs. Sarah Mutasa', 
      room: 'Room 101', 
      schedule: 'Mon-Fri 8:00-15:00', 
      subjects: ['Mathematics', 'English', 'Science'],
      students: [
        { id: '1', name: 'John Doe', age: 14, guardianPhone: '+263 77 111 1111', email: 'john@school.zw', status: 'active' },
        { id: '2', name: 'Jane Smith', age: 13, guardianPhone: '+263 77 222 2222', email: 'jane@school.zw', status: 'active' }
      ]
    },
    { 
      id: '2', 
      name: 'Form 2B', 
      teacher: 'Mr. John Sibanda', 
      room: 'Room 205', 
      schedule: 'Mon-Fri 8:00-15:00', 
      subjects: ['Mathematics', 'English', 'History'],
      students: [
        { id: '3', name: 'Mike Johnson', age: 15, guardianPhone: '+263 77 333 3333', email: 'mike@school.zw', status: 'active' }
      ]
    },
    { 
      id: '3', 
      name: 'Form 3A', 
      teacher: 'Ms. Grace Chikwanha', 
      room: 'Room 301', 
      schedule: 'Mon-Fri 8:00-15:00', 
      subjects: ['Biology', 'Chemistry', 'Physics'],
      students: [
        { id: '4', name: 'Sarah Wilson', age: 16, guardianPhone: '+263 77 444 4444', email: 'sarah@school.zw', status: 'active' }
      ]
    },
    { 
      id: '4', 
      name: 'Form 4A', 
      teacher: 'Mr. Peter Mpofu', 
      room: 'Room 402', 
      schedule: 'Mon-Fri 8:00-15:00', 
      subjects: ['Mathematics', 'English', 'Physics', 'Chemistry'],
      students: [
        { id: '5', name: 'Tinashe Moyo', age: 17, guardianPhone: '+263 77 123 4567', email: 'tinashe@school.zw', status: 'active' },
        { id: '6', name: 'John Mukamuri', age: 17, guardianPhone: '+263 78 345 6789', email: 'john@school.zw', status: 'active' }
      ]
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const canEdit = user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'hod';
  
  // Role-based filtering
  const getFilteredClasses = () => {
    let filtered = classes.filter(cls =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // If student role, show only their classes
    if (user?.role === 'student') {
      filtered = filtered.filter(cls => cls.name === 'Form 4A'); // User's class
    }
    // If teacher role, show only their classes
    else if (user?.role === 'teacher') {
      filtered = filtered.filter(cls => cls.teacher === 'Mrs. Sarah Mukamuri'); // Teacher's classes
    }

    return filtered;
  };

  const filteredClasses = getFilteredClasses();

  if (selectedClass) {
    return (
      <ClassDetail 
        classData={selectedClass} 
        onBack={() => setSelectedClass(null)} 
      />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user?.role === 'student' ? 'My Classes' : 'Classes'}
          </h1>
          {user?.role === 'student' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Your enrolled classes
            </p>
          )}
        </div>
        {canEdit && (
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredClasses.map((cls) => (
              <div key={cls.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{cls.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Teacher: {cls.teacher}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedClass(cls)}
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
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{cls.students.length} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{cls.room}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{cls.schedule}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subjects:</p>
                  <div className="flex flex-wrap gap-1">
                    {cls.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {subject}
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

export default Classes;