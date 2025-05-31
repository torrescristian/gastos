import { SyncRepository } from "@/common/domain/repositories/SyncRepository";
import {
  SyncStatus,
  SyncStatusEnum,
} from "@/common/domain/entities/SyncStatus";

export default class GetSyncStatusUseCase {
  constructor(private readonly syncRepository: SyncRepository) {}

  async execute(): Promise<SyncStatus> {
    const currentStatus = await this.syncRepository.getSyncStatus();
    const pendingExpenses = await this.syncRepository.getPendingExpenses();

    // Update pending count
    const updatedStatus = SyncStatus.create({
      ...currentStatus.toState(),
      pendingCount: pendingExpenses.length,
    });

    // Check online status and adjust accordingly
    if (navigator.onLine) {
      if (currentStatus.status === SyncStatusEnum.OFFLINE) {
        const newStatus =
          pendingExpenses.length > 0
            ? SyncStatusEnum.PENDING
            : SyncStatusEnum.SYNCED;

        const finalStatus = SyncStatus.create({
          ...updatedStatus.toState(),
          status: newStatus,
        });

        await this.syncRepository.saveSyncStatus(finalStatus);
        return finalStatus;
      }
    } else {
      if (currentStatus.status !== SyncStatusEnum.OFFLINE) {
        const offlineStatus = SyncStatus.create({
          ...updatedStatus.toState(),
          status: SyncStatusEnum.OFFLINE,
        });

        await this.syncRepository.saveSyncStatus(offlineStatus);
        return offlineStatus;
      }
    }

    return updatedStatus;
  }
}
