import { useQuery } from "@tanstack/react-query";
import { SYNC_STATUS_KEY } from "@/common/consts/query-keys";
import GetSyncStatusUseCase from "@/common/application/GetSyncStatusUseCase";
import LocalSyncRepository from "../repositories-adapters/LocalSyncRepository";

const useCase = new GetSyncStatusUseCase(new LocalSyncRepository());

export const useSyncStatusQuery = () => {
  return useQuery({
    queryKey: [SYNC_STATUS_KEY],
    queryFn: () => useCase.execute(),
    refetchInterval: 10000, // Refetch every 10 seconds for real-time status
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 5000, // Consider data stale after 5 seconds
  });
};
