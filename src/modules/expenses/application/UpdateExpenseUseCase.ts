import { ExpensesRepository } from "@/expenses/domain/repositories/ExpensesRepository";
import {
  ExpenseData,
  ExpenseSchema,
} from "@/expenses/domain/schemas/ExpenseSchema";
import { Expense } from "@/expenses/domain/entities/Expense";

export default class UpdateExpenseUseCase {
  constructor(private readonly expensesRepository: ExpensesRepository) {}

  async execute(
    id: string,
    expenseData: Partial<ExpenseData>
  ): Promise<Expense> {
    // Obtener el gasto actual
    const existingExpense = await this.expensesRepository.getById(id);
    if (!existingExpense) {
      throw new Error(`Expense with id ${id} not found`);
    }

    // Combinar datos existentes con los nuevos datos
    const updatedData = {
      ...existingExpense,
      ...expenseData,
    };

    // Validar los datos con el esquema
    const validatedData = ExpenseSchema.parse(updatedData);

    // Actualizar el gasto
    const expense = await this.expensesRepository.update(id, validatedData);

    return expense;
  }
}
