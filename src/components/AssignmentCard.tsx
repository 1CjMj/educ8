import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Assignment {
  id: string;
  title: string;
  description: string;
  type: 'assignment' | 'note' | 'test';
  due_date?: string;
  points: number;
  file_name?: string;
  file_type?: string;
  created_at: string;
}

interface AssignmentCardProps {
  assignment: Assignment;
  onView: (assignment: Assignment) => void;
  onEdit?: (assignment: Assignment) => void;
  onDelete?: (id: string) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ 
  assignment, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'bg-blue-100 text-blue-800';
      case 'test': return 'bg-red-100 text-red-800';
      case 'note': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getTypeColor(assignment.type)}>
                {assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)}
              </Badge>
              {assignment.points > 0 && (
                <span className="text-sm text-gray-600">{assignment.points} pts</span>
              )}
            </div>
            <CardTitle className="text-lg">{assignment.title}</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => onView(assignment)}>
              <Eye className="w-4 h-4" />
            </Button>
            {isTeacher && onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(assignment)}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {isTeacher && onDelete && (
              <Button variant="outline" size="sm" onClick={() => onDelete(assignment.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {assignment.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(assignment.created_at)}</span>
            </div>
            {assignment.due_date && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Due {formatDate(assignment.due_date)}</span>
              </div>
            )}
          </div>
          {assignment.file_name && (
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>Attachment</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;