import { ExpensesRepository } from "@/expenses/domain/repositories/ExpensesRepository";
import {
  ExpenseData,
  ExpenseSchema,
} from "@/expenses/domain/schemas/ExpenseSchema";
import { Expense } from "@/expenses/domain/entities/Expense";

export default class CreateExpenseUseCase {
  constructor(private readonly expensesRepository: ExpensesRepository) {}

  async execute(expenseData: ExpenseData): Promise<Expense> {
    // Validar los datos con el esquema
    const validatedData = ExpenseSchema.parse(expenseData);

    // Crear el gasto
    const expense = await this.expensesRepository.create(validatedData);

    return expense;
  }
}
