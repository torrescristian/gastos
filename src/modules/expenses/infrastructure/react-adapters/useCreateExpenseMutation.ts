import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORIES_KEY, EXPENSES_KEY } from "@/common/consts/query-keys";
import CreateExpenseUseCase from "@/expenses/application/CreateExpenseUseCase";
import LocalExpensesRepository from "../repositories-adapters/LocalExpensesRepository";
import { ExpenseData } from "@/expenses/domain/schemas/ExpenseSchema";

const createExpenseUseCase = new CreateExpenseUseCase(
  new LocalExpensesRepository()
);

export const useCreateExpenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseData: ExpenseData) => {
      const expense = await createExpenseUseCase.execute(expenseData);
      return expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      queryClient.invalidateQueries({ queryKey: [EXPENSES_KEY] });
    },
    onError: (error) => {
      console.error("Error creating expense:", error);
    },
  });
};
