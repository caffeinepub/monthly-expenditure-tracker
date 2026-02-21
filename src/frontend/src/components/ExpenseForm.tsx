import { useState } from 'react';
import { useAddExpense } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ExpenseFormProps {
  defaultMonth: number;
  defaultYear: number;
}

const COMMON_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Housing',
  'Healthcare',
  'Other',
];

export default function ExpenseForm({ defaultMonth, defaultYear }: ExpenseFormProps) {
  const addExpense = useAddExpense();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = category === 'custom' ? customCategory : category;

    if (!amount || !finalCategory || !description || !date) {
      toast.error('Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await addExpense.mutateAsync({
        amount: amountNum,
        category: finalCategory,
        description,
        date: new Date(date),
      });
      toast.success('Expense added successfully');
      
      // Reset form
      setAmount('');
      setCategory('');
      setCustomCategory('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      toast.error('Failed to add expense');
      console.error(error);
    }
  };

  return (
    <Card className="border-amber-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Add New Expense
        </CardTitle>
        <CardDescription>Record a new expense transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat === 'Other' ? 'custom' : cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {category === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="customCategory">Custom Category</Label>
              <Input
                id="customCategory"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter category name"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this expense for?"
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={addExpense.isPending}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-md"
          >
            {addExpense.isPending ? 'Adding...' : 'Add Expense'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
