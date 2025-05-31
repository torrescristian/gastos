import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SYNC_STATUS_KEY, EXPENSES_KEY } from "@/common/consts/query-keys";
import SyncExpensesUseCase from "@/common/application/SyncExpensesUseCase";
import LocalSyncRepository from "../repositories-adapters/LocalSyncRepository";

const useCase = new SyncExpensesUseCase(new LocalSyncRepository());

export const useSyncMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => useCase.execute(),
    onSuccess: () => {
      // Invalidate related queries to refetch data
      queryClient.invalidateQueries({ queryKey: [SYNC_STATUS_KEY] });
      queryClient.invalidateQueries({ queryKey: [EXPENSES_KEY] });
    },
    onError: (error) => {
      console.error("Sync failed:", error);
      // Invalidate sync status to show error state
      queryClient.invalidateQueries({ queryKey: [SYNC_STATUS_KEY] });
    },
  });
};
