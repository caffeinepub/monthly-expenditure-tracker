import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MonthYearSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
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

export default function MonthYearSelector({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}: MonthYearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="flex gap-2">
      <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(Number(value))}>
        <SelectTrigger className="w-[140px] bg-white dark:bg-neutral-800 border-amber-200 dark:border-neutral-700">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((month) => (
            <SelectItem key={month.value} value={month.value.toString()}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(Number(value))}>
        <SelectTrigger className="w-[100px] bg-white dark:bg-neutral-800 border-amber-200 dark:border-neutral-700">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
