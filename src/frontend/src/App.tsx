import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import MonthYearSelector from './components/MonthYearSelector';
import MonthlySummary from './components/MonthlySummary';
import CategoryBreakdown from './components/CategoryBreakdown';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import EarningsForm from './components/EarningsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign } from 'lucide-react';

function App() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Header */}
        <header className="border-b border-amber-200/50 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    Expense Tracker
                  </h1>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Track your spending, save smarter
                  </p>
                </div>
              </div>
              <MonthYearSelector
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Summary Section */}
            <MonthlySummary month={selectedMonth} year={selectedYear} />

            {/* Category Breakdown */}
            <CategoryBreakdown month={selectedMonth} year={selectedYear} />

            {/* Tabs for Forms and List */}
            <Tabs defaultValue="expenses" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white dark:bg-neutral-800 shadow-sm">
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="add-expense">Add Expense</TabsTrigger>
                <TabsTrigger value="set-earnings">Set Earnings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="expenses" className="mt-6">
                <ExpenseList month={selectedMonth} year={selectedYear} />
              </TabsContent>
              
              <TabsContent value="add-expense" className="mt-6">
                <div className="max-w-2xl mx-auto">
                  <ExpenseForm defaultMonth={selectedMonth} defaultYear={selectedYear} />
                </div>
              </TabsContent>
              
              <TabsContent value="set-earnings" className="mt-6">
                <div className="max-w-2xl mx-auto">
                  <EarningsForm defaultMonth={selectedMonth} defaultYear={selectedYear} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-amber-200/50 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              <p>
                © {new Date().getFullYear()} Built with ❤️ using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.hostname : 'expense-tracker'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 font-medium transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </footer>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
