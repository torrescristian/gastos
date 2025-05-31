import { ExpensesRepository } from "@/expenses/domain/repositories/ExpensesRepository";
import { Expense } from "@/expenses/domain/entities/Expense";

export default class ListExpensesUseCase {
  constructor(private readonly expensesRepository: ExpensesRepository) {}

  async execute(): Promise<Expense[]> {
    return await this.expensesRepository.getAll();
  }
}
