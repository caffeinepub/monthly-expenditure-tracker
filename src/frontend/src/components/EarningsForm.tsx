import { useState } from 'react';
import { useSetMonthlyEarnings, useGetMonthlyEarnings } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface EarningsFormProps {
  defaultMonth: number;
  defaultYear: number;
}

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export default function EarningsForm({ defaultMonth, defaultYear }: EarningsFormProps) {
  const setMonthlyEarnings = useSetMonthlyEarnings();
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(defaultMonth.toString());
  const [year, setYear] = useState(defaultYear.toString());

  const { data: existingEarnings, isLoading } = useGetMonthlyEarnings(
    parseInt(month),
    parseInt(year)
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !month || !year) {
      toast.error('Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await setMonthlyEarnings.mutateAsync({
        amount: amountNum,
        month: parseInt(month),
        year: parseInt(year),
      });
      toast.success('Monthly earnings saved successfully');
      setAmount('');
    } catch (error) {
      toast.error('Failed to save earnings');
      console.error(error);
    }
  };

  return (
    <Card className="border-amber-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Set Monthly Earnings
        </CardTitle>
        <CardDescription>Record your income for a specific month</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            {existingEarnings && (
              <div className="mb-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Current earnings for {MONTHS[parseInt(month) - 1].label} {year}:{' '}
                  <span className="font-bold">${Number(existingEarnings.amount).toLocaleString()}</span>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="earnings-month">Month</Label>
                  <Select value={month} onValueChange={setMonth} required>
                    <SelectTrigger id="earnings-month">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m) => (
                        <SelectItem key={m.value} value={m.value.toString()}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="earnings-year">Year</Label>
                  <Select value={year} onValueChange={setYear} required>
                    <SelectTrigger id="earnings-year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="earnings-amount">Amount ($)</Label>
                <Input
                  id="earnings-amount"
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

              <Button
                type="submit"
                disabled={setMonthlyEarnings.isPending}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-md"
              >
                {setMonthlyEarnings.isPending ? 'Saving...' : 'Save Earnings'}
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
