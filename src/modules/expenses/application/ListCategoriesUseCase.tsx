import { CategoriesRepository } from "@/expenses/domain/repositories/CategoriesRepository";

export default class ListCategoriesUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {
    this.categoriesRepository = categoriesRepository;
  }

  async execute() {
    return await this.categoriesRepository.getAll();
  }
}
