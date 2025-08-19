import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORIES_KEY, EXPENSES_KEY } from "@/common/consts/query-keys";
import UpdateExpenseUseCase from "@/expenses/application/UpdateExpenseUseCase";
import LocalExpensesRepository from "../repositories-adapters/LocalExpensesRepository";
import { ExpenseData } from "@/expenses/domain/schemas/ExpenseSchema";

const updateExpenseUseCase = new UpdateExpenseUseCase(
  new LocalExpensesRepository()
);

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
      const expense = await updateExpenseUseCase.execute(id, expenseData);
      return expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      queryClient.invalidateQueries({ queryKey: [EXPENSES_KEY] });
    },
    onError: (error) => {
      console.error("Error updating expense:", error);
    },
  });
};
