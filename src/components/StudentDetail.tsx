import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, BookOpen, Trophy } from 'lucide-react';

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
}

interface StudentDetailProps {
  student: Student;
  onBack: () => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student, onBack }) => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{student.name}</h1>
        <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
          {student.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Class</p>
                <p className="text-sm">{student.class}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p className="text-sm">{student.age} years</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p className="text-sm">{student.dateOfBirth}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Guardian Phone</p>
                <p className="text-sm">{student.guardianPhone}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-sm">{student.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Extracurricular Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {student.extracurriculars.map((activity, index) => (
                  <Badge key={index} variant="outline">{activity}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Current Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {student.grades.map((grade, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm font-medium">{grade.subject}</span>
                    <Badge variant="secondary">{grade.grade}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;