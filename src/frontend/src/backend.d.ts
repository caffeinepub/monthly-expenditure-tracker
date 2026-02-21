import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Earning {
    id: bigint;
    month: bigint;
    year: bigint;
    timestamp: Time;
    amount: bigint;
}
export type Time = bigint;
export interface Expense {
    id: bigint;
    date: Time;
    description: string;
    timestamp: Time;
    category: string;
    amount: bigint;
}
export interface backendInterface {
    addExpense(amount: bigint, category: string, description: string, date: Time): Promise<bigint>;
    deleteExpense(id: bigint): Promise<void>;
    getAllExpenses(): Promise<Array<Expense>>;
    getExpensesByMonthYear(_month: bigint, _year: bigint): Promise<Array<Expense>>;
    getMonthlyEarnings(month: bigint, year: bigint): Promise<Earning | null>;
    getMonthlySavings(month: bigint, year: bigint): Promise<bigint>;
    getTotalExpensesByCategory(category: string, _month: bigint, _year: bigint): Promise<bigint>;
    setMonthlyEarnings(amount: bigint, month: bigint, year: bigint): Promise<bigint>;
    updateExpense(id: bigint, amount: bigint, category: string, description: string, date: Time): Promise<void>;
}
