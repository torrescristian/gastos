import {
  SyncStatus,
  SYNC_STORAGE_KEY,
  PENDING_SYNC_KEY,
} from "@/common/consts/sync-status";
import { Expense } from "@/expenses/domain/entities/Expense";

export interface SyncState {
  status: SyncStatus;
  lastSync: Date | null;
  pendingCount: number;
  error?: string;
}

export class SyncService {
  private static instance: SyncService;
  private syncState: SyncState = {
    status: SyncStatus.OFFLINE,
    lastSync: null,
    pendingCount: 0,
  };
  private listeners: ((state: SyncState) => void)[] = [];

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  constructor() {
    this.loadSyncState();
    this.updatePendingCount();
    this.checkOnlineStatus();

    // Listen for online/offline events
    window.addEventListener("online", () => this.handleOnline());
    window.addEventListener("offline", () => this.handleOffline());
  }

  private loadSyncState(): void {
    try {
      const stored = localStorage.getItem(SYNC_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.syncState = {
          ...parsed,
          lastSync: parsed.lastSync ? new Date(parsed.lastSync) : null,
        };
      }
    } catch (error) {
      console.error("Error loading sync state:", error);
    }
  }

  private saveSyncState(): void {
    try {
      localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(this.syncState));
    } catch (error) {
      console.error("Error saving sync state:", error);
    }
  }

  private updatePendingCount(): void {
    try {
      const pending = localStorage.getItem(PENDING_SYNC_KEY);
      const pendingExpenses = pending ? JSON.parse(pending) : [];
      this.syncState.pendingCount = pendingExpenses.length;
    } catch (error) {
      console.error("Error updating pending count:", error);
      this.syncState.pendingCount = 0;
    }
  }

  private checkOnlineStatus(): void {
    if (navigator.onLine) {
      if (this.syncState.status === SyncStatus.OFFLINE) {
        this.syncState.status =
          this.syncState.pendingCount > 0
            ? SyncStatus.PENDING
            : SyncStatus.SYNCED;
      }
    } else {
      this.syncState.status = SyncStatus.OFFLINE;
    }
    this.notifyListeners();
  }

  private handleOnline(): void {
    console.log("App went online");
    this.checkOnlineStatus();
  }

  private handleOffline(): void {
    console.log("App went offline");
    this.syncState.status = SyncStatus.OFFLINE;
    this.notifyListeners();
  }

  addExpenseToPendingSync(expense: Expense): void {
    try {
      const pending = localStorage.getItem(PENDING_SYNC_KEY);
      const pendingExpenses = pending ? JSON.parse(pending) : [];

      // Add to pending list (avoid duplicates)
      const exists = pendingExpenses.find((e: Expense) => e.id === expense.id);
      if (!exists) {
        pendingExpenses.push({
          ...expense,
          // Mark as pending sync
          syncPending: true,
          localCreatedAt: new Date().toISOString(),
        });

        localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(pendingExpenses));
        this.updatePendingCount();

        // Update status
        if (this.syncState.status !== SyncStatus.OFFLINE) {
          this.syncState.status = SyncStatus.PENDING;
        }

        this.notifyListeners();
      }
    } catch (error) {
      console.error("Error adding expense to pending sync:", error);
    }
  }

  async syncWithBackend(): Promise<boolean> {
    if (!navigator.onLine) {
      this.syncState.status = SyncStatus.OFFLINE;
      this.syncState.error = "No hay conexión a internet";
      this.notifyListeners();
      return false;
    }

    try {
      this.syncState.status = SyncStatus.SYNCING;
      this.syncState.error = undefined;
      this.notifyListeners();

      const pending = localStorage.getItem(PENDING_SYNC_KEY);
      const pendingExpenses = pending ? JSON.parse(pending) : [];

      if (pendingExpenses.length === 0) {
        this.syncState.status = SyncStatus.SYNCED;
        this.syncState.lastSync = new Date();
        this.saveSyncState();
        this.notifyListeners();
        return true;
      }

      // TODO: Replace with actual backend API call
      // For now, simulate backend sync
      await this.simulateBackendSync(pendingExpenses);

      // Clear pending after successful sync
      localStorage.removeItem(PENDING_SYNC_KEY);

      this.syncState.status = SyncStatus.SYNCED;
      this.syncState.lastSync = new Date();
      this.syncState.pendingCount = 0;
      this.saveSyncState();
      this.notifyListeners();

      return true;
    } catch (error) {
      console.error("Sync failed:", error);
      this.syncState.status = SyncStatus.ERROR;
      this.syncState.error =
        error instanceof Error ? error.message : "Error de sincronización";
      this.notifyListeners();
      return false;
    }
  }

  private async simulateBackendSync(expenses: Expense[]): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate random success/failure for demo
    if (Math.random() > 0.8) {
      throw new Error("Error de red simulado");
    }

    console.log("Successfully synced expenses to backend:", expenses);
  }

  getSyncState(): SyncState {
    return { ...this.syncState };
  }

  subscribe(listener: (state: SyncState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener({ ...this.syncState }));
  }

  // Force a status check (useful for manual refresh)
  refreshStatus(): void {
    this.updatePendingCount();
    this.checkOnlineStatus();
    this.saveSyncState();
  }
}
