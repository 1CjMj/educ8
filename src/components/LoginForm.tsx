import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = login(username, password);
    
    if (success) {
      toast({
        title: 'Login Successful',
        description: 'Welcome to Educ8!'
      });
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password',
        variant: 'destructive'
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400">Educ8</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">School Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-900 dark:text-gray-100">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900 dark:text-gray-100">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            <p className="font-semibold mb-2">Demo Accounts:</p>
            <div className="space-y-1">
              <p>Admin: admin / demo123</p>
              <p>Teacher: teacher1 / demo123</p>
              <p>Student: student1 / demo123</p>
              <p>Parent: parent1 / demo123</p>
              <p>Bursar: bursar / demo123</p>
              <p>HOD: hod1 / demo123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;