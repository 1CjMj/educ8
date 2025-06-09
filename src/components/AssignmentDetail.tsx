import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, FileText, Upload, Download, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

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

interface Submission {
  id: string;
  content: string;
  file_name?: string;
  file_url?: string;
  status: 'draft' | 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
  submitted_at?: string;
}

interface AssignmentDetailProps {
  assignment: Assignment;
  onBack: () => void;
}

const AssignmentDetail: React.FC<AssignmentDetailProps> = ({ assignment, onBack }) => {
  const { user } = useAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  useEffect(() => {
    if (isStudent) {
      loadSubmission();
    }
  }, [assignment.id]);

  const loadSubmission = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('assignment_id', assignment.id)
        .eq('student_id', user?.id || 'student1')
        .single();

      if (data) {
        setSubmission(data);
        setSubmissionText(data.content || '');
      }
    } catch (error) {
      console.log('No submission found');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubmissionFile(e.target.files[0]);
    }
  };

  const submitAssignment = async () => {
    setLoading(true);
    try {
      let fileUrl = null;
      let fileName = null;

      if (submissionFile) {
        fileName = submissionFile.name;
        fileUrl = URL.createObjectURL(submissionFile);
      }

      const submissionData = {
        assignment_id: assignment.id,
        student_id: user?.id || 'student1',
        content: submissionText,
        file_url: fileUrl,
        file_name: fileName,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      };

      if (submission) {
        const { error } = await supabase
          .from('submissions')
          .update(submissionData)
          .eq('id', submission.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('submissions')
          .insert(submissionData);
        if (error) throw error;
      }

      await loadSubmission();
    } catch (error) {
      console.error('Error submitting assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'bg-blue-100 text-blue-800';
      case 'test': return 'bg-red-100 text-red-800';
      case 'note': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Badge className={getTypeColor(assignment.type)}>
            {assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)}
          </Badge>
          <h1 className="text-2xl font-bold">{assignment.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Posted {formatDate(assignment.created_at)}</span>
              </div>
              {assignment.due_date && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Due {formatDate(assignment.due_date)}</span>
                </div>
              )}
              {assignment.points > 0 && (
                <span>{assignment.points} points</span>
              )}
            </div>
            
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{assignment.description}</p>
            </div>

            {assignment.file_name && (
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">{assignment.file_name}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {isStudent && assignment.type !== 'note' && (
          <Card>
            <CardHeader>
              <CardTitle>Your Submission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {submission?.status === 'graded' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Grade:</span>
                    <span className="text-lg font-bold">{submission.grade}/{assignment.points}</span>
                  </div>
                  {submission.feedback && (
                    <div>
                      <span className="font-medium">Feedback:</span>
                      <p className="text-sm mt-1">{submission.feedback}</p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Your Answer</label>
                <Textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={6}
                  disabled={submission?.status === 'submitted' || submission?.status === 'graded'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Attach File (Optional)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={submission?.status === 'submitted' || submission?.status === 'graded'}
                />
              </div>

              {submission?.status === 'submitted' ? (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">Submitted on {submission.submitted_at && formatDate(submission.submitted_at)}</p>
                </div>
              ) : (
                <Button 
                  onClick={submitAssignment} 
                  disabled={loading || !submissionText.trim()}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? 'Submitting...' : 'Submit Assignment'}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AssignmentDetail;