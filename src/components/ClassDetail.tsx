import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, MapPin, Clock, Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ClassroomView from './ClassroomView';

interface ClassStudent {
  id: string;
  name: string;
  age: number;
  guardianPhone: string;
  email: string;
  status: 'active' | 'inactive';
}

interface ClassData {
  id: string;
  name: string;
  teacher: string;
  room: string;
  schedule: string;
  subjects: string[];
  students: ClassStudent[];
}

interface ClassDetailProps {
  classData: ClassData;
  onBack: () => void;
}

const ClassDetail: React.FC<ClassDetailProps> = ({ classData, onBack }) => {
  const { user } = useAuth();
  const [view, setView] = useState<'info' | 'classroom'>('info');
  const canEdit = user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'hod';

  if (view === 'classroom') {
    return (
      <ClassroomView 
        classData={classData} 
        onBack={() => setView('info')} 
      />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{classData.name}</h1>
      </div>

      <div className="flex gap-2">
        <Button 
          variant={view === 'info' ? 'default' : 'outline'}
          onClick={() => setView('info')}
        >
          Class Info
        </Button>
        <Button 
          variant={view === 'classroom' ? 'default' : 'outline'}
          onClick={() => setView('classroom')}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Classroom
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Class Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Teacher: {classData.teacher}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Room: {classData.room}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Schedule: {classData.schedule}</span>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Subjects:</p>
              <div className="flex flex-wrap gap-1">
                {classData.subjects.map((subject, index) => (
                  <Badge key={index} variant="secondary">{subject}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Students ({classData.students.length})</CardTitle>
              {canEdit && (
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classData.students.map((student) => (
                <div key={student.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-gray-600">Age: {student.age} • {student.guardianPhone}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClassDetail;