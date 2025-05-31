import { SyncRepository } from "@/common/domain/repositories/SyncRepository";
import {
  SyncStatus,
  SyncStatusEnum,
} from "@/common/domain/entities/SyncStatus";

export default class SyncExpensesUseCase {
  constructor(private readonly syncRepository: SyncRepository) {}

  async execute(): Promise<SyncStatus> {
    // Check if we're online
    if (!navigator.onLine) {
      const offlineStatus = SyncStatus.create({
        status: SyncStatusEnum.OFFLINE,
        lastSync: null,
        pendingCount: 0,
        error: "No hay conexión a internet",
      });
      await this.syncRepository.saveSyncStatus(offlineStatus);
      return offlineStatus;
    }

    try {
      // Set syncing status
      const currentStatus = await this.syncRepository.getSyncStatus();
      const syncingStatus = SyncStatus.create({
        ...currentStatus.toState(),
        status: SyncStatusEnum.SYNCING,
        error: undefined,
      });
      await this.syncRepository.saveSyncStatus(syncingStatus);

      // Get pending expenses
      const pendingExpenses = await this.syncRepository.getPendingExpenses();

      if (pendingExpenses.length === 0) {
        // Nothing to sync
        const syncedStatus = SyncStatus.create({
          status: SyncStatusEnum.SYNCED,
          lastSync: new Date(),
          pendingCount: 0,
        });
        await this.syncRepository.saveSyncStatus(syncedStatus);
        return syncedStatus;
      }

      // Sync with backend
      await this.syncRepository.syncExpensesWithBackend(pendingExpenses);

      // Clear pending expenses after successful sync
      await this.syncRepository.clearPendingExpenses();

      // Update to synced status
      const syncedStatus = SyncStatus.create({
        status: SyncStatusEnum.SYNCED,
        lastSync: new Date(),
        pendingCount: 0,
      });
      await this.syncRepository.saveSyncStatus(syncedStatus);

      return syncedStatus;
    } catch (error) {
      // Handle sync error
      const currentStatus = await this.syncRepository.getSyncStatus();
      const errorStatus = SyncStatus.create({
        ...currentStatus.toState(),
        status: SyncStatusEnum.ERROR,
        error:
          error instanceof Error
            ? error.message
            : "Error de sincronización desconocido",
      });
      await this.syncRepository.saveSyncStatus(errorStatus);

      throw error; // Re-throw for React Query error handling
    }
  }
}
