import { describe, expect, it } from "vitest";
import {
  ExpenseSchema,
  ExpenseFormSchema,
  type ExpenseData,
  type ExpenseFormData,
} from "./ExpenseSchema";

describe("ExpenseSchema", () => {
  describe("valid expense data", () => {
    it("should validate correct expense data", () => {
      const validExpense: ExpenseData = {
        amount: 100.5,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        note: "Test expense",
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(validExpense)).not.toThrow();
    });

    it("should require subcategoryId", () => {
      const validExpense: ExpenseData = {
        amount: 50,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: false,
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(validExpense)).not.toThrow();
    });

    it("should accept optional note as null", () => {
      const validExpense: ExpenseData = {
        amount: 75.25,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        note: null,
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(validExpense)).not.toThrow();
    });

    it("should accept today's date", () => {
      const today = new Date();
      const validExpense: ExpenseData = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: false,
        date: today,
      };

      expect(() => ExpenseSchema.parse(validExpense)).not.toThrow();
    });
  });

  describe("amount validation", () => {
    it("should reject negative amounts", () => {
      const invalidExpense = {
        amount: -10,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "El monto debe ser mayor a 0"
      );
    });

    it("should reject zero amount", () => {
      const invalidExpense = {
        amount: 0,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "El monto debe ser mayor a 0"
      );
    });

    it("should reject amounts too large", () => {
      const invalidExpense = {
        amount: 1000000000, // 1 billion
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "El monto es demasiado grande"
      );
    });

    it("should reject non-numeric amounts", () => {
      const invalidExpense = {
        amount: "not a number",
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "El monto debe ser un número válido"
      );
    });

    it("should require amount", () => {
      const invalidExpense = {
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "El monto es obligatorio"
      );
    });
  });

  describe("categoryId validation", () => {
    it("should reject empty categoryId", () => {
      const invalidExpense = {
        amount: 100,
        categoryId: "",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "La categoría es obligatoria"
      );
    });

    it("should require categoryId", () => {
      const invalidExpense = {
        amount: 100,
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "La categoría es obligatoria"
      );
    });

    it("should reject non-string categoryId", () => {
      const invalidExpense = {
        amount: 100,
        categoryId: 123,
        subcategoryId: "sub1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "Debe seleccionar una categoría válida"
      );
    });
  });

  describe("subcategoryId validation", () => {
    it("should reject empty subcategoryId", () => {
      const invalidExpense = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "La subcategoría es obligatoria"
      );
    });

    it("should reject missing subcategoryId", () => {
      const invalidExpense = {
        amount: 100,
        categoryId: "1",
        isCardPayment: true,
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "La subcategoría es obligatoria"
      );
    });
  });

  describe("isCardPayment validation", () => {
    it("should require isCardPayment", () => {
      const invalidExpense = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "El método de pago es obligatorio"
      );
    });

    it("should reject non-boolean isCardPayment", () => {
      const invalidExpense = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: "true",
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "Método de pago debe ser verdadero o falso"
      );
    });
  });

  describe("note validation", () => {
    it("should reject notes longer than 500 characters", () => {
      const longNote = "a".repeat(501);
      const invalidExpense = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        note: longNote,
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "La nota no puede exceder 500 caracteres"
      );
    });

    it("should accept notes with exactly 500 characters", () => {
      const maxNote = "a".repeat(500);
      const validExpense = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        note: maxNote,
        date: new Date("2024-01-15"),
      };

      expect(() => ExpenseSchema.parse(validExpense)).not.toThrow();
    });
  });

  describe("date validation", () => {
    it("should accept future dates", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30); // 30 days in the future

      const validExpense = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: futureDate,
        note: "Future expense",
      };

      expect(() => ExpenseSchema.parse(validExpense)).not.toThrow();
    });

    it("should accept past dates", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30); // 30 days in the past

      const validExpense = {
        amount: 150,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: false,
        date: pastDate,
        note: "Past expense",
      };

      expect(() => ExpenseSchema.parse(validExpense)).not.toThrow();
    });

    it("should require date", () => {
      const invalidExpense = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "La fecha es obligatoria"
      );
    });

    it("should reject invalid date", () => {
      const invalidExpense = {
        amount: 100,
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: "invalid-date",
      };

      expect(() => ExpenseSchema.parse(invalidExpense)).toThrow(
        "Fecha inválida"
      );
    });
  });
});

describe("ExpenseFormSchema", () => {
  describe("valid form data", () => {
    it("should validate correct form data", () => {
      const validFormData: ExpenseFormData = {
        amount: "100.50",
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        note: "Test expense",
        date: "2024-01-15",
      };

      expect(() => ExpenseFormSchema.parse(validFormData)).not.toThrow();
    });

    it("should accept optional subcategoryId as undefined", () => {
      const validFormData: ExpenseFormData = {
        amount: "50.00",
        categoryId: "1",
        isCardPayment: false,
        date: "2024-01-15",
      };

      expect(() => ExpenseFormSchema.parse(validFormData)).not.toThrow();
    });

    it("should accept optional note as undefined", () => {
      const validFormData: ExpenseFormData = {
        amount: "75.25",
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: "2024-01-15",
      };

      expect(() => ExpenseFormSchema.parse(validFormData)).not.toThrow();
    });
  });

  describe("amount validation", () => {
    it("should reject empty amount string", () => {
      const invalidFormData = {
        amount: "",
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: "2024-01-15",
      };

      expect(() => ExpenseFormSchema.parse(invalidFormData)).toThrow(
        "El monto es obligatorio"
      );
    });

    it("should reject invalid amount format", () => {
      const invalidFormData = {
        amount: "abc",
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: "2024-01-15",
      };

      expect(() => ExpenseFormSchema.parse(invalidFormData)).toThrow(
        "Formato de monto inválido"
      );
    });

    it("should reject zero amount", () => {
      const invalidFormData = {
        amount: "0",
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: "2024-01-15",
      };

      expect(() => ExpenseFormSchema.parse(invalidFormData)).toThrow(
        "El monto debe ser mayor a 0"
      );
    });

    it("should reject negative amounts", () => {
      const invalidFormData = {
        amount: "-10.50",
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: "2024-01-15",
      };

      expect(() => ExpenseFormSchema.parse(invalidFormData)).toThrow(
        "Formato de monto inválido"
      );
    });

    it("should reject amounts too large", () => {
      const invalidFormData = {
        amount: "1000000000.00",
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: "2024-01-15",
      };

      expect(() => ExpenseFormSchema.parse(invalidFormData)).toThrow(
        "El monto es demasiado grande"
      );
    });

    it("should accept valid decimal amounts", () => {
      const validFormData = {
        amount: "123.45",
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: "2024-01-15",
      };

      expect(() => ExpenseFormSchema.parse(validFormData)).not.toThrow();
    });

    it("should accept whole number amounts", () => {
      const validFormData = {
        amount: "123",
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: "2024-01-15",
      };

      expect(() => ExpenseFormSchema.parse(validFormData)).not.toThrow();
    });
  });

  describe("date string validation", () => {
    it("should reject empty date string", () => {
      const invalidFormData = {
        amount: "100.00",
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: "",
      };

      expect(() => ExpenseFormSchema.parse(invalidFormData)).toThrow(
        "La fecha es obligatoria"
      );
    });

    it("should reject invalid date strings", () => {
      const invalidFormData = {
        amount: "100.00",
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: "invalid-date",
      };

      expect(() => ExpenseFormSchema.parse(invalidFormData)).toThrow(
        "Fecha inválida"
      );
    });

    it("should accept future dates", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const validFormData = {
        amount: "100.00",
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: futureDate.toISOString().split("T")[0],
        note: "Future expense",
      };

      expect(() => ExpenseFormSchema.parse(validFormData)).not.toThrow();
    });

    it("should accept past dates", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30);

      const validFormData = {
        amount: "150.00",
        categoryId: "2",
        subcategoryId: "sub2",
        isCardPayment: false,
        date: pastDate.toISOString().split("T")[0],
        note: "Past expense",
      };

      expect(() => ExpenseFormSchema.parse(validFormData)).not.toThrow();
    });

    it("should accept valid date strings", () => {
      const validFormData = {
        amount: "100.00",
        categoryId: "1",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: "2024-01-15",
      };

      expect(() => ExpenseFormSchema.parse(validFormData)).not.toThrow();
    });
  });

  describe("categoryId validation", () => {
    it("should reject empty categoryId", () => {
      const invalidFormData = {
        amount: "100.00",
        categoryId: "",
        subcategoryId: "sub1",
        isCardPayment: true,
        date: "2024-01-15",
      };

      expect(() => ExpenseFormSchema.parse(invalidFormData)).toThrow(
        "Debe seleccionar una categoría"
      );
    });
  });
});
