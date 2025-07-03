import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CATEGORIES_KEY,
  EXPENSES_KEY,
  SYNC_STATUS_KEY,
} from "@/common/consts/query-keys";
import UpdateExpenseUseCase from "@/expenses/application/UpdateExpenseUseCase";
import LocalExpensesRepository from "../repositories-adapters/LocalExpensesRepository";
import AddExpenseToSyncUseCase from "@/common/application/AddExpenseToSyncUseCase";
import LocalSyncRepository from "@/common/infrastructure/repositories-adapters/LocalSyncRepository";
import { ExpenseData } from "@/expenses/domain/schemas/ExpenseSchema";

const updateExpenseUseCase = new UpdateExpenseUseCase(
  new LocalExpensesRepository()
);
const addToSyncUseCase = new AddExpenseToSyncUseCase(new LocalSyncRepository());

export const useUpdateExpenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      expenseData,
    }: {
      id: string;
      expenseData: Partial<ExpenseData>;
    }) => {
      // Update expense locally first (offline-first)
      const expense = await updateExpenseUseCase.execute(id, expenseData);

      // Add to pending sync queue
      await addToSyncUseCase.execute(expense);

      return expense;
    },
    onSuccess: () => {
      // Invalidate all related queries to refetch data
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      queryClient.invalidateQueries({ queryKey: [EXPENSES_KEY] });
      queryClient.invalidateQueries({ queryKey: [SYNC_STATUS_KEY] });
    },
    onError: (error) => {
      console.error("Error updating expense:", error);
    },
  });
};
