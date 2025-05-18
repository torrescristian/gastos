import { useQuery } from "@tanstack/react-query";
import { CATEGORIES_KEY } from "@/common/consts/query-keys";
import ListCategoriesUseCase from "@/expenses/application/ListCategoriesUseCase";
import LocalCategoriesRepository from "../repositories-adapters/LocalCategoriesRepository";

const useCase = new ListCategoriesUseCase(new LocalCategoriesRepository());

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: useCase.execute,
  });
};
