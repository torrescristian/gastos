import { useQuery } from "@tanstack/react-query";
import { EXPENSES_KEY } from "@/common/consts/query-keys";
import ListExpensesUseCase from "@/expenses/application/ListExpensesUseCase";
import LocalExpensesRepository from "../repositories-adapters/LocalExpensesRepository";

const useCase = new ListExpensesUseCase(new LocalExpensesRepository());

export const useExpensesQuery = () => {
  return useQuery({
    queryKey: [EXPENSES_KEY],
    queryFn: () => useCase.execute(),
  });
};
