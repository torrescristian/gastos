import { useQuery } from "@tanstack/react-query";
import { CATEGORIES_KEY } from "@/common/consts/query-keys";
import LocalCategoriesRepository from "../repositories-adapters/LocalCategoriesRepository";

const categoriesRepository = new LocalCategoriesRepository();

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: async () => await categoriesRepository.getAll(),
  });
};
