import { useGetMonthlyEarnings, useGetExpensesByMonthYear } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface MonthlySummaryProps {
  month: number;
  year: number;
}

export default function MonthlySummary({ month, year }: MonthlySummaryProps) {
  const { data: earnings, isLoading: earningsLoading } = useGetMonthlyEarnings(month, year);
  const { data: expenses, isLoading: expensesLoading } = useGetExpensesByMonthYear(month, year);

  const earningsAmount = earnings ? Number(earnings.amount) : 0;
  const totalExpenses = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
  const savings = earningsAmount - totalExpenses;
  const savingsPercentage = earningsAmount > 0 ? (savings / earningsAmount) * 100 : 0;

  const isLoading = earningsLoading || expensesLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-amber-200 dark:border-neutral-800">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Earnings Card */}
        <Card className="border-amber-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Monthly Earnings
            </CardTitle>
            <Wallet className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              ${earningsAmount.toLocaleString()}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Total income for the month
            </p>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card className="border-rose-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-rose-600 dark:text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {expenses?.length || 0} transactions
            </p>
          </CardContent>
        </Card>

        {/* Savings Card */}
        <Card
          className={`border-2 ${
            savings >= 0
              ? 'border-emerald-300 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30'
              : 'border-rose-300 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30'
          } shadow-sm hover:shadow-md transition-shadow`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {savings >= 0 ? 'Savings' : 'Overspending'}
            </CardTitle>
            {savings >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                savings >= 0
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-rose-700 dark:text-rose-400'
              }`}
            >
              ${Math.abs(savings).toLocaleString()}
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              {savings >= 0
                ? `${savingsPercentage.toFixed(1)}% of earnings saved`
                : `${Math.abs(savingsPercentage).toFixed(1)}% over budget`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Growth Image */}
      {savings > 0 && (
        <Card className="border-amber-200 dark:border-neutral-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-neutral-900 dark:to-neutral-800 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  Great job! You're saving money! 🎉
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Keep up the excellent work managing your finances. Your savings are growing steadily.
                </p>
              </div>
              <div className="flex-shrink-0">
                <img
                  src="/assets/generated/financial-growth.dim_400x300.png"
                  alt="Financial growth illustration"
                  className="w-full max-w-[300px] h-auto rounded-lg shadow-md"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
