import { useState, useEffect } from "react";
import { SyncService, SyncState } from "@/common/services/SyncService";
import { SyncStatus } from "@/common/consts/sync-status";

export const useSyncState = () => {
  const syncService = SyncService.getInstance();
  const [syncState, setSyncState] = useState<SyncState>(() =>
    syncService.getSyncState()
  );

  useEffect(() => {
    const unsubscribe = syncService.subscribe(setSyncState);
    return unsubscribe;
  }, [syncService]);

  const syncNow = async () => {
    return await syncService.syncWithBackend();
  };

  const refreshStatus = () => {
    syncService.refreshStatus();
  };

  const isOnline = syncState.status !== SyncStatus.OFFLINE;
  const hasPendingSync = syncState.pendingCount > 0;
  const isSyncing = syncState.status === SyncStatus.SYNCING;

  return {
    syncState,
    syncNow,
    refreshStatus,
    isOnline,
    hasPendingSync,
    isSyncing,
  };
};
