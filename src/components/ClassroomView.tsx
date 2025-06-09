import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AssignmentCard from './AssignmentCard';
import CreateAssignment from './CreateAssignment';
import AssignmentDetail from './AssignmentDetail';

interface Assignment {
  id: string;
  title: string;
  description: string;
  type: 'assignment' | 'note' | 'test';
  due_date?: string;
  points: number;
  file_name?: string;
  file_type?: string;
  file_url?: string;
  created_at: string;
}

interface ClassData {
  id: string;
  name: string;
  teacher: string;
}

interface ClassroomViewProps {
  classData: ClassData;
  onBack: () => void;
}

const ClassroomView: React.FC<ClassroomViewProps> = ({ classData, onBack }) => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  useEffect(() => {
    loadAssignments();
  }, [classData.id]);

  useEffect(() => {
    filterAssignments();
  }, [assignments, searchTerm, activeTab]);

  const loadAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('class_id', classData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error('Error loading assignments:', error);
      // Use mock data for demo
      setAssignments([
        {
          id: '1',
          title: 'Math Homework - Algebra',
          description: 'Complete exercises 1-20 from chapter 5. Show all work and calculations.',
          type: 'assignment',
          due_date: '2024-12-20T23:59:00',
          points: 50,
          file_name: 'algebra_exercises.pdf',
          file_type: 'application/pdf',
          created_at: '2024-12-10T10:00:00'
        },
        {
          id: '2',
          title: 'Science Quiz - Chemistry',
          description: 'Online quiz covering atomic structure and periodic table.',
          type: 'test',
          due_date: '2024-12-18T15:00:00',
          points: 25,
          created_at: '2024-12-12T09:00:00'
        },
        {
          id: '3',
          title: 'Class Notes - Photosynthesis',
          description: 'Study notes on photosynthesis process and its importance.',
          type: 'note',
          points: 0,
          file_name: 'photosynthesis_notes.docx',
          file_type: 'application/msword',
          created_at: '2024-12-08T14:30:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterAssignments = () => {
    let filtered = assignments;

    // Filter by type
    if (activeTab !== 'all') {
      filtered = filtered.filter(assignment => assignment.type === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAssignments(filtered);
  };

  const handleCreateAssignment = () => {
    setView('create');
  };

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setView('detail');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedAssignment(null);
    loadAssignments(); // Refresh data
  };

  if (view === 'create') {
    return (
      <CreateAssignment
        classId={classData.id}
        onBack={handleBackToList}
        onSave={handleBackToList}
      />
    );
  }

  if (view === 'detail' && selectedAssignment) {
    return (
      <AssignmentDetail
        assignment={selectedAssignment}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Classes
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{classData.name}</h1>
          <p className="text-gray-600">Teacher: {classData.teacher}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {isTeacher && (
          <Button onClick={handleCreateAssignment}>
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="assignment">Assignments</TabsTrigger>
          <TabsTrigger value="test">Tests</TabsTrigger>
          <TabsTrigger value="note">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading assignments...</p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No assignments found.</p>
                {isTeacher && (
                  <Button onClick={handleCreateAssignment} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Assignment
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onView={handleViewAssignment}
                  onEdit={isTeacher ? handleViewAssignment : undefined}
                  onDelete={isTeacher ? (id) => console.log('Delete', id) : undefined}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassroomView;