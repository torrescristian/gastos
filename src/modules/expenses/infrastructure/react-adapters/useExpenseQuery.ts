import { useQuery } from "@tanstack/react-query";
import { EXPENSES_KEY } from "@/common/consts/query-keys";
import LocalExpensesRepository from "../repositories-adapters/LocalExpensesRepository";

const repository = new LocalExpensesRepository();

export const useExpenseQuery = (id: string) => {
  return useQuery({
    queryKey: [EXPENSES_KEY, id],
    queryFn: () => repository.getById(id),
    enabled: !!id,
  });
};
