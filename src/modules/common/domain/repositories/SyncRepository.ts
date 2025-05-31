import { SyncStatus } from "@/common/domain/entities/SyncStatus";
import { Expense } from "@/expenses/domain/entities/Expense";

export interface SyncRepository {
  getSyncStatus(): Promise<SyncStatus>;
  saveSyncStatus(status: SyncStatus): Promise<void>;
  getPendingExpenses(): Promise<Expense[]>;
  addExpenseToPendingSync(expense: Expense): Promise<void>;
  clearPendingExpenses(): Promise<void>;
  syncExpensesWithBackend(expenses: Expense[]): Promise<void>;
}
