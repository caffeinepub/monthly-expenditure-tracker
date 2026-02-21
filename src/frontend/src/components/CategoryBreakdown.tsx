import { useGetExpensesByMonthYear } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Film,
  Heart,
  Zap,
  MoreHorizontal,
} from 'lucide-react';

interface CategoryBreakdownProps {
  month: number;
  year: number;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Food: <Utensils className="w-5 h-5" />,
  Transport: <Car className="w-5 h-5" />,
  Entertainment: <Film className="w-5 h-5" />,
  Utilities: <Zap className="w-5 h-5" />,
  Shopping: <ShoppingCart className="w-5 h-5" />,
  Housing: <Home className="w-5 h-5" />,
  Healthcare: <Heart className="w-5 h-5" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Food: 'bg-amber-500',
  Transport: 'bg-blue-500',
  Entertainment: 'bg-purple-500',
  Utilities: 'bg-yellow-500',
  Shopping: 'bg-pink-500',
  Housing: 'bg-green-500',
  Healthcare: 'bg-red-500',
};

export default function CategoryBreakdown({ month, year }: CategoryBreakdownProps) {
  const { data: expenses, isLoading } = useGetExpensesByMonthYear(month, year);

  const categoryTotals = expenses?.reduce((acc, expense) => {
    const category = expense.category;
    acc[category] = (acc[category] || 0) + Number(expense.amount);
    return acc;
  }, {} as Record<string, number>) || {};

  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  const sortedCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a);

  if (isLoading) {
    return (
      <Card className="border-amber-200 dark:border-neutral-800">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sortedCategories.length === 0) {
    return (
      <Card className="border-amber-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            No expenses recorded for this month yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Category Breakdown
        </CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Your spending across different categories
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedCategories.map(([category, amount]) => {
            const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
            const icon = CATEGORY_ICONS[category] || <MoreHorizontal className="w-5 h-5" />;
            const colorClass = CATEGORY_COLORS[category] || 'bg-neutral-500';

            return (
              <div
                key={category}
                className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center text-white shadow-sm`}
                    >
                      {icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {category}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      ${amount.toLocaleString()}
                    </div>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
