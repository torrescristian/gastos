export enum SyncStatus {
  SYNCED = "synced",
  PENDING = "pending",
  SYNCING = "syncing",
  ERROR = "error",
  OFFLINE = "offline",
}

export const SYNC_STORAGE_KEY = "sync_status";
export const PENDING_SYNC_KEY = "pending_sync_expenses";
