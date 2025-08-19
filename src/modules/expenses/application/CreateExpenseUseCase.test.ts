import { describe, expect, it, beforeEach, vi } from "vitest";
import CreateExpenseUseCase from "./CreateExpenseUseCase";
import type { ExpensesRepository } from "../domain/repositories/ExpensesRepository";
import type { ExpenseData } from "../domain/schemas/ExpenseSchema";
import type { Expense } from "../domain/entities/Expense";
import { ZodError } from "zod";

// Mock repository
const mockExpensesRepository: ExpensesRepository = {
  create: vi.fn(),
  getAll: vi.fn(),
  getById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  save: vi.fn(),
};

describe("CreateExpenseUseCase", () => {
  let useCase: CreateExpenseUseCase;

  beforeEach(() => {
    useCase = new CreateExpenseUseCase(mockExpensesRepository);
    vi.clearAllMocks();
  });

  describe("successful expense creation", () => {
    it("should create expense with valid data", async () => {
      const expenseData: ExpenseData = {
        amount: 100.5,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        note: "Test expense",
        date: new Date("2024-01-15"),
      };

      const expectedExpense: Expense = {
        id: "1",
        ...expenseData,
        createdAt: new Date("2024-01-15T10:00:00Z"),
        updatedAt: new Date("2024-01-15T10:00:00Z"),
      };

      vi.mocked(mockExpensesRepository.create).mockResolvedValue(
        expectedExpense
      );

      const result = await useCase.execute(expenseData);

      expect(mockExpensesRepository.create).toHaveBeenCalledWith(expenseData);
      expect(mockExpensesRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedExpense);
    });

    it("should create expense with minimal required data", async () => {
      const expenseData: ExpenseData = {
        amount: 50,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: false,
        date: new Date("2024-01-15"),
      };

      const expectedExpense: Expense = {
        id: "2",
        ...expenseData,
        createdAt: new Date("2024-01-15T10:00:00Z"),
        updatedAt: new Date("2024-01-15T10:00:00Z"),
      };

      vi.mocked(mockExpensesRepository.create).mockResolvedValue(
        expectedExpense
      );

      const result = await useCase.execute(expenseData);

      expect(mockExpensesRepository.create).toHaveBeenCalledWith(expenseData);
      expect(result).toEqual(expectedExpense);
    });

    it("should create expense with null note", async () => {
      const expenseData: ExpenseData = {
        amount: 75.25,
        categoryId: "2",
        subcategoryId: "sub2",
        isCardPayment: true,
        note: null,
        date: new Date("2024-01-15"),
      };

      const expectedExpense: Expense = {
        id: "3",
        ...expenseData,
        createdAt: new Date("2024-01-15T10:00:00Z"),
        updatedAt: new Date("2024-01-15T10:00:00Z"),
      };

      vi.mocked(mockExpensesRepository.create).mockResolvedValue(
        expectedExpense
      );

      const result = await useCase.execute(expenseData);

      expect(mockExpensesRepository.create).toHaveBeenCalledWith(expenseData);
      expect(result).toEqual(expectedExpense);
    });

    it("should create expense with cash payment", async () => {
      const expenseData: ExpenseData = {
        amount: 25,
        categoryId: "3",
        subcategoryId: "sub3",
        isCardPayment: false,
        note: "Cash payment",
        date: new Date("2024-01-15"),
      };

      const expectedExpense: Expense = {
        id: "4",
        ...expenseData,
        createdAt: new Date("2024-01-15T10:00:00Z"),
        updatedAt: new Date("2024-01-15T10:00:00Z"),
      };

      vi.mocked(mockExpensesRepository.create).mockResolvedValue(
        expectedExpense
      );

      const result = await useCase.execute(expenseData);

      expect(mockExpensesRepository.create).toHaveBeenCalledWith(expenseData);
      expect(result).toEqual(expectedExpense);
    });
  });

  describe("validation errors", () => {
    it("should throw validation error for negative amount", async () => {
      const invalidExpenseData = {
        amount: -10,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      } as ExpenseData;

      await expect(useCase.execute(invalidExpenseData)).rejects.toThrow(
        ZodError
      );
      expect(mockExpensesRepository.create).not.toHaveBeenCalled();
    });

    it("should throw validation error for zero amount", async () => {
      const invalidExpenseData = {
        amount: 0,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      } as ExpenseData;

      await expect(useCase.execute(invalidExpenseData)).rejects.toThrow(
        ZodError
      );
      expect(mockExpensesRepository.create).not.toHaveBeenCalled();
    });

    it("should throw validation error for missing categoryId", async () => {
      const invalidExpenseData = {
        amount: 100,
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      } as ExpenseData;

      await expect(useCase.execute(invalidExpenseData)).rejects.toThrow(
        ZodError
      );
      expect(mockExpensesRepository.create).not.toHaveBeenCalled();
    });

    it("should throw validation error for empty categoryId", async () => {
      const invalidExpenseData = {
        amount: 100,
        categoryId: "",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      } as ExpenseData;

      await expect(useCase.execute(invalidExpenseData)).rejects.toThrow(
        ZodError
      );
      expect(mockExpensesRepository.create).not.toHaveBeenCalled();
    });

    it("should throw validation error for missing subcategoryId", async () => {
      const invalidExpenseData = {
        amount: 100,
        categoryId: "1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      } as ExpenseData;

      await expect(useCase.execute(invalidExpenseData)).rejects.toThrow(
        ZodError
      );
      expect(mockExpensesRepository.create).not.toHaveBeenCalled();
    });

    it("should throw validation error for empty subcategoryId", async () => {
      const invalidExpenseData = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      } as ExpenseData;

      await expect(useCase.execute(invalidExpenseData)).rejects.toThrow(
        ZodError
      );
      expect(mockExpensesRepository.create).not.toHaveBeenCalled();
    });

    it("should throw validation error for missing isCardPayment", async () => {
      const invalidExpenseData = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        date: new Date("2024-01-15"),
      } as ExpenseData;

      await expect(useCase.execute(invalidExpenseData)).rejects.toThrow(
        ZodError
      );
      expect(mockExpensesRepository.create).not.toHaveBeenCalled();
    });

    it("should throw validation error for missing date", async () => {
      const invalidExpenseData = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
      } as ExpenseData;

      await expect(useCase.execute(invalidExpenseData)).rejects.toThrow(
        ZodError
      );
      expect(mockExpensesRepository.create).not.toHaveBeenCalled();
    });

    it("should throw validation error for future date", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2); // More than 24h buffer

      const invalidExpenseData = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: futureDate,
      } as ExpenseData;

      await expect(useCase.execute(invalidExpenseData)).rejects.toThrow(
        ZodError
      );
      expect(mockExpensesRepository.create).not.toHaveBeenCalled();
    });

    it("should throw validation error for note too long", async () => {
      const longNote = "a".repeat(501); // Exceeds 500 character limit

      const invalidExpenseData = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        note: longNote,
        date: new Date("2024-01-15"),
      } as ExpenseData;

      await expect(useCase.execute(invalidExpenseData)).rejects.toThrow(
        ZodError
      );
      expect(mockExpensesRepository.create).not.toHaveBeenCalled();
    });

    it("should throw validation error for amount too large", async () => {
      const invalidExpenseData = {
        amount: 1000000000, // Exceeds limit
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      } as ExpenseData;

      await expect(useCase.execute(invalidExpenseData)).rejects.toThrow(
        ZodError
      );
      expect(mockExpensesRepository.create).not.toHaveBeenCalled();
    });

    it("should throw validation error for invalid data types", async () => {
      const invalidExpenseData = {
        amount: "not a number",
        categoryId: 123,
        subcategoryId: "sub1",
        isCardPayment: "true",
        date: "invalid-date",
      } as unknown as ExpenseData;

      await expect(useCase.execute(invalidExpenseData)).rejects.toThrow(
        ZodError
      );
      expect(mockExpensesRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("repository errors", () => {
    it("should propagate repository creation errors", async () => {
      const expenseData: ExpenseData = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      const repositoryError = new Error("Database connection failed");
      vi.mocked(mockExpensesRepository.create).mockRejectedValue(
        repositoryError
      );

      await expect(useCase.execute(expenseData)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockExpensesRepository.create).toHaveBeenCalledWith(expenseData);
    });

    it("should propagate repository timeout errors", async () => {
      const expenseData: ExpenseData = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      const timeoutError = new Error("Request timeout");
      vi.mocked(mockExpensesRepository.create).mockRejectedValue(timeoutError);

      await expect(useCase.execute(expenseData)).rejects.toThrow(
        "Request timeout"
      );
      expect(mockExpensesRepository.create).toHaveBeenCalledWith(expenseData);
    });

    it("should propagate storage full errors", async () => {
      const expenseData: ExpenseData = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      const storageError = new Error("Storage quota exceeded");
      vi.mocked(mockExpensesRepository.create).mockRejectedValue(storageError);

      await expect(useCase.execute(expenseData)).rejects.toThrow(
        "Storage quota exceeded"
      );
      expect(mockExpensesRepository.create).toHaveBeenCalledWith(expenseData);
    });
  });

  describe("edge cases", () => {
    it("should handle maximum valid amount", async () => {
      const expenseData: ExpenseData = {
        amount: 999999999, // Maximum valid amount
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      const expectedExpense: Expense = {
        id: "1",
        ...expenseData,
        createdAt: new Date("2024-01-15T10:00:00Z"),
        updatedAt: new Date("2024-01-15T10:00:00Z"),
      };

      vi.mocked(mockExpensesRepository.create).mockResolvedValue(
        expectedExpense
      );

      const result = await useCase.execute(expenseData);

      expect(mockExpensesRepository.create).toHaveBeenCalledWith(expenseData);
      expect(result).toEqual(expectedExpense);
    });

    it("should handle minimum valid amount", async () => {
      const expenseData: ExpenseData = {
        amount: 0.01, // Minimum valid amount
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      const expectedExpense: Expense = {
        id: "1",
        ...expenseData,
        createdAt: new Date("2024-01-15T10:00:00Z"),
        updatedAt: new Date("2024-01-15T10:00:00Z"),
      };

      vi.mocked(mockExpensesRepository.create).mockResolvedValue(
        expectedExpense
      );

      const result = await useCase.execute(expenseData);

      expect(mockExpensesRepository.create).toHaveBeenCalledWith(expenseData);
      expect(result).toEqual(expectedExpense);
    });

    it("should handle maximum valid note length", async () => {
      const maxNote = "a".repeat(500); // Maximum valid note length

      const expenseData: ExpenseData = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        note: maxNote,
        date: new Date("2024-01-15"),
      };

      const expectedExpense: Expense = {
        id: "1",
        ...expenseData,
        createdAt: new Date("2024-01-15T10:00:00Z"),
        updatedAt: new Date("2024-01-15T10:00:00Z"),
      };

      vi.mocked(mockExpensesRepository.create).mockResolvedValue(
        expectedExpense
      );

      const result = await useCase.execute(expenseData);

      expect(mockExpensesRepository.create).toHaveBeenCalledWith(expenseData);
      expect(result).toEqual(expectedExpense);
    });

    it("should handle today's date", async () => {
      const today = new Date();

      const expenseData: ExpenseData = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: today,
      };

      const expectedExpense: Expense = {
        id: "1",
        ...expenseData,
        createdAt: new Date("2024-01-15T10:00:00Z"),
        updatedAt: new Date("2024-01-15T10:00:00Z"),
      };

      vi.mocked(mockExpensesRepository.create).mockResolvedValue(
        expectedExpense
      );

      const result = await useCase.execute(expenseData);

      expect(mockExpensesRepository.create).toHaveBeenCalledWith(expenseData);
      expect(result).toEqual(expectedExpense);
    });
  });

  describe("data flow", () => {
    it("should pass validated data exactly to repository", async () => {
      const expenseData: ExpenseData = {
        amount: 123.45,
        categoryId: "category-123",
        subcategoryId: "subcategory-456",
        isCardPayment: false,
        note: "Exact data test",
        date: new Date("2024-01-15T09:30:00Z"),
      };

      const expectedExpense: Expense = {
        id: "generated-id",
        ...expenseData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockExpensesRepository.create).mockResolvedValue(
        expectedExpense
      );

      await useCase.execute(expenseData);

      expect(mockExpensesRepository.create).toHaveBeenCalledWith(expenseData);
      // Verify that the exact same object reference is passed
      expect(mockExpensesRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 123.45,
          categoryId: "category-123",
          subcategoryId: "subcategory-456",
          isCardPayment: false,
          note: "Exact data test",
          date: expect.any(Date),
        })
      );
    });
  });
});
