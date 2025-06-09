import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { DollarSign, Edit, AlertCircle } from 'lucide-react';

interface Fee {
  id: string;
  student_id: string;
  student_name: string;
  parent_id: string;
  parent_name: string;
  amount_due: number;
  amount_paid: number;
  outstanding_amount: number;
  fee_type: string;
  due_date: string;
  status: string;
}

const Fees: React.FC = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  const [amountPaid, setAmountPaid] = useState('');

  useEffect(() => {
    fetchFees();
  }, [user]);

  const fetchFees = async () => {
    try {
      let query = supabase.from('fees').select('*');
      
      if (user?.role === 'parent') {
        query = query.eq('parent_id', user.id);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      setFees(data || []);
    } catch (error) {
      console.error('Error fetching fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFee = async (feeId: string, newAmountPaid: number) => {
    try {
      const { error } = await supabase
        .from('fees')
        .update({ 
          amount_paid: newAmountPaid,
          status: newAmountPaid >= editingFee!.amount_due ? 'paid' : newAmountPaid > 0 ? 'partial' : 'pending'
        })
        .eq('id', feeId);
      
      if (error) throw error;
      fetchFees();
      setEditingFee(null);
      setAmountPaid('');
    } catch (error) {
      console.error('Error updating fee:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalOutstanding = fees.reduce((sum, fee) => sum + fee.outstanding_amount, 0);

  if (loading) return <div>Loading fees...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {user?.role === 'parent' ? 'Children\'s Fees' : 'Student Fees Management'}
        </h1>
        {user?.role === 'parent' && (
          <Card className="w-64">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Outstanding</p>
                  <p className="text-2xl font-bold text-red-600">${totalOutstanding.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fees Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                {user?.role !== 'parent' && <TableHead>Parent</TableHead>}
                <TableHead>Amount Due</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                {user?.role === 'bursar' && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.student_name}</TableCell>
                  {user?.role !== 'parent' && <TableCell>{fee.parent_name}</TableCell>}
                  <TableCell>${fee.amount_due.toFixed(2)}</TableCell>
                  <TableCell>${fee.amount_paid.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">
                    {fee.outstanding_amount > 0 && (
                      <span className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        ${fee.outstanding_amount.toFixed(2)}
                      </span>
                    )}
                    {fee.outstanding_amount === 0 && (
                      <span className="text-green-600">$0.00</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(fee.status)}>
                      {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(fee.due_date).toLocaleDateString()}</TableCell>
                  {user?.role === 'bursar' && (
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingFee(fee);
                              setAmountPaid(fee.amount_paid.toString());
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Payment for {fee.student_name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Amount Due: ${fee.amount_due.toFixed(2)}</Label>
                            </div>
                            <div>
                              <Label htmlFor="amountPaid">Amount Paid</Label>
                              <Input
                                id="amountPaid"
                                type="number"
                                step="0.01"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                                placeholder="Enter amount paid"
                              />
                            </div>
                            <Button 
                              onClick={() => updateFee(fee.id, parseFloat(amountPaid) || 0)}
                              className="w-full"
                            >
                              Update Payment
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Fees;