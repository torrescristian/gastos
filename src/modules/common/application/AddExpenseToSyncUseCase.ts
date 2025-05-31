import { SyncRepository } from "@/common/domain/repositories/SyncRepository";
import {
  SyncStatus,
  SyncStatusEnum,
} from "@/common/domain/entities/SyncStatus";
import { Expense } from "@/expenses/domain/entities/Expense";

export default class AddExpenseToSyncUseCase {
  constructor(private readonly syncRepository: SyncRepository) {}

  async execute(expense: Expense): Promise<void> {
    // Add expense to pending sync queue
    await this.syncRepository.addExpenseToPendingSync(expense);

    // Update sync status if we're not offline
    const currentStatus = await this.syncRepository.getSyncStatus();
    if (
      currentStatus.status !== SyncStatusEnum.OFFLINE &&
      currentStatus.status !== SyncStatusEnum.SYNCING
    ) {
      const pendingStatus = SyncStatus.create({
        ...currentStatus.toState(),
        status: SyncStatusEnum.PENDING,
        pendingCount: currentStatus.pendingCount + 1,
      });

      await this.syncRepository.saveSyncStatus(pendingStatus);
    }
  }
}
