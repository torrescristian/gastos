import { Expense } from "@/expenses/domain/entities/Expense";
import { ExpenseData } from "@/expenses/domain/schemas/ExpenseSchema";

export interface ExpensesRepository {
  create(expense: ExpenseData): Promise<Expense>;
  getAll(): Promise<Expense[]>;
  getById(id: string): Promise<Expense | null>;
  update(id: string, expense: Partial<ExpenseData>): Promise<Expense>;
  delete(id: string): Promise<void>;
  save(expense: Expense): Promise<void>;
}
