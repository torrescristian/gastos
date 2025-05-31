import { useSyncStatusQuery } from "./useSyncStatusQuery";
import { useSyncMutation } from "./useSyncMutation";
import { SyncStatusEnum } from "@/common/domain/entities/SyncStatus";

export const useSyncState = () => {
  const { data: syncStatus, isLoading, error, refetch } = useSyncStatusQuery();
  const syncMutation = useSyncMutation();

  const syncNow = async () => {
    try {
      await syncMutation.mutateAsync();
      return true;
    } catch (error) {
      console.error("Sync failed:", error);
      return false;
    }
  };

  const refreshStatus = () => {
    refetch();
  };

  // Helper computed values
  const isOnline = syncStatus?.status !== SyncStatusEnum.OFFLINE;
  const hasPendingSync = (syncStatus?.pendingCount ?? 0) > 0;
  const isSyncing =
    syncStatus?.status === SyncStatusEnum.SYNCING || syncMutation.isPending;
  const canSync = syncStatus?.canSync() ?? false;

  return {
    // Raw data
    syncState: syncStatus?.toState(),
    syncStatus,
    isLoading,
    error,

    // Actions
    syncNow,
    refreshStatus,

    // Computed helpers
    isOnline,
    hasPendingSync,
    isSyncing,
    canSync,

    // Mutation state
    syncError: syncMutation.error,
    syncIsLoading: syncMutation.isPending,
  };
};
