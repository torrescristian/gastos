import { Category } from "@/expenses/domain/entities/Category";
import { RepositoryGetAll } from "@/common/interfaces/repository";

export type CategoriesRepository = RepositoryGetAll<Category>;
