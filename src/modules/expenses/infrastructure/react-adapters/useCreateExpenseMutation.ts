import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CATEGORIES_KEY,
  EXPENSES_KEY,
  SYNC_STATUS_KEY,
} from "@/common/consts/query-keys";
import CreateExpenseUseCase from "@/expenses/application/CreateExpenseUseCase";
import LocalExpensesRepository from "../repositories-adapters/LocalExpensesRepository";
import AddExpenseToSyncUseCase from "@/common/application/AddExpenseToSyncUseCase";
import LocalSyncRepository from "@/common/infrastructure/repositories-adapters/LocalSyncRepository";
import { ExpenseData } from "@/expenses/domain/schemas/ExpenseSchema";

const createExpenseUseCase = new CreateExpenseUseCase(
  new LocalExpensesRepository()
);
const addToSyncUseCase = new AddExpenseToSyncUseCase(new LocalSyncRepository());

export const useCreateExpenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseData: ExpenseData) => {
      // Create expense locally first (offline-first)
      const expense = await createExpenseUseCase.execute(expenseData);

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
      console.error("Error creating expense:", error);
    },
  });
};
