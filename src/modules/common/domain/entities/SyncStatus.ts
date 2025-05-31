export enum SyncStatusEnum {
  SYNCED = "synced",
  PENDING = "pending",
  SYNCING = "syncing",
  ERROR = "error",
  OFFLINE = "offline",
}

export interface SyncState {
  status: SyncStatusEnum;
  lastSync: Date | null;
  pendingCount: number;
  error?: string;
}

export class SyncStatus {
  constructor(
    public readonly status: SyncStatusEnum,
    public readonly lastSync: Date | null,
    public readonly pendingCount: number,
    public readonly error?: string
  ) {}

  static create(state: Partial<SyncState>): SyncStatus {
    return new SyncStatus(
      state.status ?? SyncStatusEnum.OFFLINE,
      state.lastSync ?? null,
      state.pendingCount ?? 0,
      state.error
    );
  }

  isOnline(): boolean {
    return this.status !== SyncStatusEnum.OFFLINE;
  }

  hasPendingSync(): boolean {
    return this.pendingCount > 0;
  }

  isSyncing(): boolean {
    return this.status === SyncStatusEnum.SYNCING;
  }

  canSync(): boolean {
    return (
      this.isOnline() &&
      (this.hasPendingSync() || this.status === SyncStatusEnum.ERROR)
    );
  }

  toState(): SyncState {
    return {
      status: this.status,
      lastSync: this.lastSync,
      pendingCount: this.pendingCount,
      error: this.error,
    };
  }
}
