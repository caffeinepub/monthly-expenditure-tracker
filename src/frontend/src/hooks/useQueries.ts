import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Expense, Earning } from '../backend';

// Expense Queries
export function useGetAllExpenses() {
  const { actor, isFetching } = useActor();

  return useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllExpenses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetExpensesByMonthYear(month: number, year: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Expense[]>({
    queryKey: ['expenses', month, year],
    queryFn: async () => {
      if (!actor) return [];
      const expenses = await actor.getExpensesByMonthYear(BigInt(month), BigInt(year));
      
      // Client-side filtering by month/year since backend doesn't filter yet
      return expenses.filter((expense) => {
        const expenseDate = new Date(Number(expense.date) / 1_000_000);
        return expenseDate.getMonth() + 1 === month && expenseDate.getFullYear() === year;
      });
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddExpense() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amount,
      category,
      description,
      date,
    }: {
      amount: number;
      category: string;
      description: string;
      date: Date;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const timestamp = BigInt(date.getTime() * 1_000_000);
      return actor.addExpense(BigInt(amount), category, description, timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}

export function useUpdateExpense() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      amount,
      category,
      description,
      date,
    }: {
      id: bigint;
      amount: number;
      category: string;
      description: string;
      date: Date;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const timestamp = BigInt(date.getTime() * 1_000_000);
      return actor.updateExpense(id, BigInt(amount), category, description, timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}

export function useDeleteExpense() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteExpense(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}

// Earnings Queries
export function useGetMonthlyEarnings(month: number, year: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Earning | null>({
    queryKey: ['earnings', month, year],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMonthlyEarnings(BigInt(month), BigInt(year));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetMonthlyEarnings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amount,
      month,
      year,
    }: {
      amount: number;
      month: number;
      year: number;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.setMonthlyEarnings(BigInt(amount), BigInt(month), BigInt(year));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['earnings', variables.month, variables.year] });
      queryClient.invalidateQueries({ queryKey: ['savings'] });
    },
  });
}

// Savings Query
export function useGetMonthlySavings(month: number, year: number) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['savings', month, year],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getMonthlySavings(BigInt(month), BigInt(year));
    },
    enabled: !!actor && !isFetching,
  });
}
