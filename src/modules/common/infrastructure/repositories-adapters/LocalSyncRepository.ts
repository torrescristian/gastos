import { SyncRepository } from "@/common/domain/repositories/SyncRepository";
import {
  SyncStatus,
  SyncStatusEnum,
} from "@/common/domain/entities/SyncStatus";
import { Expense } from "@/expenses/domain/entities/Expense";

const SYNC_STORAGE_KEY = "sync_status";
const PENDING_SYNC_KEY = "pending_sync_expenses";

export default class LocalSyncRepository implements SyncRepository {
  async getSyncStatus(): Promise<SyncStatus> {
    try {
      const stored = localStorage.getItem(SYNC_STORAGE_KEY);
      if (!stored) {
        return SyncStatus.create({ status: SyncStatusEnum.OFFLINE });
      }

      const parsed = JSON.parse(stored);
      return SyncStatus.create({
        ...parsed,
        lastSync: parsed.lastSync ? new Date(parsed.lastSync) : null,
      });
    } catch (error) {
      console.error("Error loading sync status:", error);
      return SyncStatus.create({ status: SyncStatusEnum.OFFLINE });
    }
  }

  async saveSyncStatus(status: SyncStatus): Promise<void> {
    try {
      localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(status.toState()));
    } catch (error) {
      console.error("Error saving sync status:", error);
      throw new Error("Failed to save sync status");
    }
  }

  async getPendingExpenses(): Promise<Expense[]> {
    try {
      const pending = localStorage.getItem(PENDING_SYNC_KEY);
      if (!pending) return [];

      const pendingExpenses = JSON.parse(pending) as Record<string, unknown>[];
      return pendingExpenses.map((expense) => ({
        ...expense,
        date: new Date(expense.date as string),
        createdAt: expense.createdAt
          ? new Date(expense.createdAt as string)
          : undefined,
        updatedAt: expense.updatedAt
          ? new Date(expense.updatedAt as string)
          : undefined,
      })) as Expense[];
    } catch (error) {
      console.error("Error loading pending expenses:", error);
      return [];
    }
  }

  async addExpenseToPendingSync(expense: Expense): Promise<void> {
    try {
      const pending = await this.getPendingExpenses();

      // Check if expense already exists in pending list
      const exists = pending.find((e) => e.id === expense.id);
      if (exists) {
        return; // Already in pending list
      }

      // Add to pending list
      const updatedPending = [
        ...pending,
        {
          ...expense,
          syncPending: true,
          localCreatedAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(updatedPending));
    } catch (error) {
      console.error("Error adding expense to pending sync:", error);
      throw new Error("Failed to add expense to pending sync");
    }
  }

  async clearPendingExpenses(): Promise<void> {
    try {
      localStorage.removeItem(PENDING_SYNC_KEY);
    } catch (error) {
      console.error("Error clearing pending expenses:", error);
      throw new Error("Failed to clear pending expenses");
    }
  }

  async syncExpensesWithBackend(expenses: Expense[]): Promise<void> {
    // TODO: Replace with actual backend API call
    // For now, simulate backend sync
    await this.simulateBackendSync(expenses);
  }

  private async simulateBackendSync(expenses: Expense[]): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate random success/failure for demo (80% success rate)
    if (Math.random() > 0.8) {
      throw new Error("Error de red simulado");
    }

    console.log("Successfully synced expenses to backend:", expenses);
  }
}
