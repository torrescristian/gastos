import { ExpensesRepository } from "@/expenses/domain/repositories/ExpensesRepository";
import { Expense } from "@/expenses/domain/entities/Expense";
import { ExpenseData } from "@/expenses/domain/schemas/ExpenseSchema";

const STORAGE_KEY = "expenses";

export default class LocalExpensesRepository implements ExpensesRepository {
  private getExpensesFromStorage(): Expense[] {
    try {
      const storedExpenses = localStorage.getItem(STORAGE_KEY);
      if (!storedExpenses) return [];

      return JSON.parse(storedExpenses).map(
        (expense: Record<string, unknown>) => ({
          ...expense,
          date: new Date(expense.date as string),
          createdAt: expense.createdAt
            ? new Date(expense.createdAt as string)
            : undefined,
          updatedAt: expense.updatedAt
            ? new Date(expense.updatedAt as string)
            : undefined,
        })
      ) as Expense[];
    } catch (error) {
      console.error("Error reading expenses from localStorage:", error);
      return [];
    }
  }

  private saveExpensesToStorage(expenses: Expense[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error("Error saving expenses to localStorage:", error);
    }
  }

  private generateId(): string {
    const expenses = this.getExpensesFromStorage();
    return expenses.length > 0
      ? (Math.max(...expenses.map((e) => Number(e.id) || 0)) + 1).toString()
      : "1";
  }

  async create(expenseData: ExpenseData): Promise<Expense> {
    const expenses = this.getExpensesFromStorage();
    const now = new Date();

    const newExpense: Expense = {
      id: this.generateId(),
      ...expenseData,
      createdAt: now,
      updatedAt: now,
    };

    expenses.push(newExpense);
    this.saveExpensesToStorage(expenses);

    return newExpense;
  }

  async getAll(): Promise<Expense[]> {
    return this.getExpensesFromStorage().sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getById(id: string): Promise<Expense | null> {
    const expenses = this.getExpensesFromStorage();
    return expenses.find((expense) => expense.id === id) || null;
  }

  async update(
    id: string,
    expenseData: Partial<ExpenseData>
  ): Promise<Expense> {
    const expenses = this.getExpensesFromStorage();
    const expenseIndex = expenses.findIndex((expense) => expense.id === id);

    if (expenseIndex === -1) {
      throw new Error(`Expense with id ${id} not found`);
    }

    const updatedExpense: Expense = {
      ...expenses[expenseIndex],
      ...expenseData,
      updatedAt: new Date(),
    };

    expenses[expenseIndex] = updatedExpense;
    this.saveExpensesToStorage(expenses);

    return updatedExpense;
  }

  async delete(id: string): Promise<void> {
    const expenses = this.getExpensesFromStorage();
    const filteredExpenses = expenses.filter((expense) => expense.id !== id);

    if (expenses.length === filteredExpenses.length) {
      throw new Error(`Expense with id ${id} not found`);
    }

    this.saveExpensesToStorage(filteredExpenses);
  }

  async save(expense: Expense): Promise<void> {
    const expenses = this.getExpensesFromStorage();
    const existingIndex = expenses.findIndex((e) => e.id === expense.id);

    if (existingIndex >= 0) {
      expenses[existingIndex] = { ...expense, updatedAt: new Date() };
    } else {
      expenses.push({
        ...expense,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    this.saveExpensesToStorage(expenses);
  }
}
