import { useState } from 'react';
import { useGetExpensesByMonthYear, useDeleteExpense } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import ExpenseEditDialog from './ExpenseEditDialog';
import type { Expense } from '../backend';

interface ExpenseListProps {
  month: number;
  year: number;
}

export default function ExpenseList({ month, year }: ExpenseListProps) {
  const { data: expenses, isLoading } = useGetExpensesByMonthYear(month, year);
  const deleteExpense = useDeleteExpense();
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteExpense.mutateAsync(deleteId);
      toast.success('Expense deleted successfully');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete expense');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-amber-200 dark:border-neutral-800">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedExpenses = [...(expenses || [])].sort((a, b) => {
    return Number(b.date) - Number(a.date);
  });

  return (
    <>
      <Card className="border-amber-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Expense History
          </CardTitle>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {sortedExpenses.length} {sortedExpenses.length === 1 ? 'transaction' : 'transactions'} this
            month
          </p>
        </CardHeader>
        <CardContent>
          {sortedExpenses.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
              No expenses recorded for this month yet.
            </div>
          ) : (
            <div className="space-y-3">
              {sortedExpenses.map((expense) => {
                const expenseDate = new Date(Number(expense.date) / 1_000_000);
                return (
                  <div
                    key={expense.id.toString()}
                    className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                            {expense.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                            <Calendar className="w-3 h-3" />
                            {expenseDate.toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                          {expense.description}
                        </h4>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                          ${Number(expense.amount).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditExpense(expense)}
                          className="border-amber-200 dark:border-neutral-700 hover:bg-amber-50 dark:hover:bg-neutral-700"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDeleteId(expense.id)}
                          className="border-rose-200 dark:border-neutral-700 hover:bg-rose-50 dark:hover:bg-neutral-700 text-rose-600 dark:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this expense entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      {editExpense && (
        <ExpenseEditDialog
          expense={editExpense}
          open={!!editExpense}
          onOpenChange={(open) => !open && setEditExpense(null)}
        />
      )}
    </>
  );
}
