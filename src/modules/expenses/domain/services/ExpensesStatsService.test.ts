import { describe, expect, it } from "vitest";
import { ExpensesStatsService } from "./ExpensesStatsService";
import type { Expense } from "../entities/Expense";
import type { Category } from "../entities/Category";

describe("ExpensesStatsService", () => {
  const mockCategories: Category[] = [
    {
      id: "1",
      name: "Comida",
      icon: "🍔",
      subcategories: [
        { id: "1-1", name: "Restaurantes", icon: "🍽️" },
        { id: "1-2", name: "Supermercado", icon: "🛒" },
      ],
    },
    {
      id: "2",
      name: "Transporte",
      icon: "🚗",
      subcategories: [{ id: "2-1", name: "Combustible", icon: "⛽" }],
    },
    {
      id: "3",
      name: "Entretenimiento",
      icon: "🎬",
      subcategories: [],
    },
  ];

  const currentDate = new Date("2024-01-15T10:00:00Z");

  describe("calculateMonthlyStats", () => {
    it("should calculate stats for current month expenses", () => {
      const expenses: Expense[] = [
        {
          id: "1",
          amount: 100,
          categoryId: "1",
          subcategoryId: "1-1",
          isCardPayment: true,
          date: new Date("2024-01-10"),
          createdAt: new Date("2024-01-10"),
        },
        {
          id: "2",
          amount: 50,
          categoryId: "1",
          subcategoryId: "1-2",
          isCardPayment: false,
          date: new Date("2024-01-12"),
          createdAt: new Date("2024-01-12"),
        },
        {
          id: "3",
          amount: 75,
          categoryId: "2",
          subcategoryId: "2-1",
          isCardPayment: true,
          date: new Date("2024-01-14"),
          createdAt: new Date("2024-01-14"),
        },
      ];

      const stats = ExpensesStatsService.calculateMonthlyStats(
        expenses,
        mockCategories,
        undefined,
        currentDate
      );

      expect(stats.totalSpent).toBe(225);
      expect(stats.budget).toBeUndefined();
      expect(stats.percentage).toBeUndefined();
      expect(stats.categoryBreakdown).toHaveLength(2);
      expect(stats.subcategoryBreakdown).toHaveLength(3);
      expect(stats.recentExpenses).toHaveLength(3);
    });

    it("should filter out expenses from different months", () => {
      const expenses: Expense[] = [
        {
          id: "1",
          amount: 100,
          categoryId: "1",
          subcategoryId: "1-1",
          isCardPayment: true,
          date: new Date("2024-01-10"), // Current month
          createdAt: new Date("2024-01-10"),
        },
        {
          id: "2",
          amount: 200,
          categoryId: "1",
          subcategoryId: "1-1",
          isCardPayment: true,
          date: new Date("2023-12-10"), // Previous month
          createdAt: new Date("2023-12-10"),
        },
        {
          id: "3",
          amount: 300,
          categoryId: "1",
          subcategoryId: "1-1",
          isCardPayment: true,
          date: new Date("2024-02-10"), // Next month
          createdAt: new Date("2024-02-10"),
        },
      ];

      const stats = ExpensesStatsService.calculateMonthlyStats(
        expenses,
        mockCategories,
        undefined,
        currentDate
      );

      expect(stats.totalSpent).toBe(100);
      expect(stats.recentExpenses).toHaveLength(1);
    });

    it("should calculate budget percentage when budget is provided", () => {
      const expenses: Expense[] = [
        {
          id: "1",
          amount: 300,
          categoryId: "1",
          subcategoryId: "1-1",
          isCardPayment: true,
          date: new Date("2024-01-10"),
          createdAt: new Date("2024-01-10"),
        },
      ];

      const budget = 1000;
      const stats = ExpensesStatsService.calculateMonthlyStats(
        expenses,
        mockCategories,
        budget,
        currentDate
      );

      expect(stats.totalSpent).toBe(300);
      expect(stats.budget).toBe(1000);
      expect(stats.percentage).toBe(30); // 300/1000 * 100 = 30%
    });

    it("should handle zero budget correctly", () => {
      const expenses: Expense[] = [
        {
          id: "1",
          amount: 100,
          categoryId: "1",
          subcategoryId: "1-1",
          isCardPayment: true,
          date: new Date("2024-01-10"),
          createdAt: new Date("2024-01-10"),
        },
      ];

      const stats = ExpensesStatsService.calculateMonthlyStats(
        expenses,
        mockCategories,
        0,
        currentDate
      );

      expect(stats.budget).toBe(0);
      expect(stats.percentage).toBeUndefined();
    });

    it("should calculate category breakdown correctly", () => {
      const expenses: Expense[] = [
        {
          id: "1",
          amount: 100,
          categoryId: "1", // Comida
          subcategoryId: "1-1",
          isCardPayment: true,
          date: new Date("2024-01-10"),
          createdAt: new Date("2024-01-10"),
        },
        {
          id: "2",
          amount: 50,
          categoryId: "1", // Comida
          subcategoryId: "1-2",
          isCardPayment: false,
          date: new Date("2024-01-12"),
          createdAt: new Date("2024-01-12"),
        },
        {
          id: "3",
          amount: 75,
          categoryId: "2", // Transporte
          subcategoryId: "2-1",
          isCardPayment: true,
          date: new Date("2024-01-14"),
          createdAt: new Date("2024-01-14"),
        },
      ];

      const stats = ExpensesStatsService.calculateMonthlyStats(
        expenses,
        mockCategories,
        undefined,
        currentDate
      );

      expect(stats.categoryBreakdown).toHaveLength(2);

      const foodCategory = stats.categoryBreakdown.find(
        (c) => c.categoryId === "1"
      );
      expect(foodCategory).toBeDefined();
      expect(foodCategory!.categoryName).toBe("Comida");
      expect(foodCategory!.categoryIcon).toBe("🍔");
      expect(foodCategory!.total).toBe(150);
      expect(foodCategory!.percentage).toBe(67); // 150/225 * 100 = 66.67 -> 67

      const transportCategory = stats.categoryBreakdown.find(
        (c) => c.categoryId === "2"
      );
      expect(transportCategory).toBeDefined();
      expect(transportCategory!.categoryName).toBe("Transporte");
      expect(transportCategory!.total).toBe(75);
      expect(transportCategory!.percentage).toBe(33); // 75/225 * 100 = 33.33 -> 33
    });

    it("should sort categories by total amount (highest first)", () => {
      const expenses: Expense[] = [
        {
          id: "1",
          amount: 50,
          categoryId: "1", // Comida - lower amount
          subcategoryId: "1-1",
          isCardPayment: true,
          date: new Date("2024-01-10"),
          createdAt: new Date("2024-01-10"),
        },
        {
          id: "2",
          amount: 100,
          categoryId: "2", // Transporte - higher amount
          subcategoryId: "2-1",
          isCardPayment: true,
          date: new Date("2024-01-12"),
          createdAt: new Date("2024-01-12"),
        },
      ];

      const stats = ExpensesStatsService.calculateMonthlyStats(
        expenses,
        mockCategories,
        undefined,
        currentDate
      );

      expect(stats.categoryBreakdown[0].categoryId).toBe("2"); // Transporte first
      expect(stats.categoryBreakdown[0].total).toBe(100);
      expect(stats.categoryBreakdown[1].categoryId).toBe("1"); // Comida second
      expect(stats.categoryBreakdown[1].total).toBe(50);
    });

    it("should limit category breakdown to top 4", () => {
      const manyCategories: Category[] = [
        { id: "1", name: "Cat1", icon: "🔴", subcategories: [] },
        { id: "2", name: "Cat2", icon: "🟠", subcategories: [] },
        { id: "3", name: "Cat3", icon: "🟡", subcategories: [] },
        { id: "4", name: "Cat4", icon: "🟢", subcategories: [] },
        { id: "5", name: "Cat5", icon: "🔵", subcategories: [] },
        { id: "6", name: "Cat6", icon: "🟣", subcategories: [] },
      ];

      const expenses: Expense[] = manyCategories.map((cat, index) => ({
        id: `${index + 1}`,
        amount: (index + 1) * 10, // Increasing amounts
        categoryId: cat.id,
        subcategoryId: "",
        isCardPayment: true,
        date: new Date("2024-01-10"),
        createdAt: new Date("2024-01-10"),
      }));

      const stats = ExpensesStatsService.calculateMonthlyStats(
        expenses,
        manyCategories,
        undefined,
        currentDate
      );

      expect(stats.categoryBreakdown).toHaveLength(4);
      // Should be sorted by amount descending, so highest amounts first
      expect(stats.categoryBreakdown[0].categoryId).toBe("6"); // 60
      expect(stats.categoryBreakdown[1].categoryId).toBe("5"); // 50
      expect(stats.categoryBreakdown[2].categoryId).toBe("4"); // 40
      expect(stats.categoryBreakdown[3].categoryId).toBe("3"); // 30
    });

    it("should calculate subcategory breakdown correctly", () => {
      const expenses: Expense[] = [
        {
          id: "1",
          amount: 100,
          categoryId: "1",
          subcategoryId: "1-1", // Restaurantes
          isCardPayment: true,
          date: new Date("2024-01-10"),
          createdAt: new Date("2024-01-10"),
        },
        {
          id: "2",
          amount: 50,
          categoryId: "1",
          subcategoryId: "1-2", // Supermercado
          isCardPayment: false,
          date: new Date("2024-01-12"),
          createdAt: new Date("2024-01-12"),
        },
        {
          id: "3",
          amount: 25,
          categoryId: "1",
          subcategoryId: "", // Sin subcategoría
          isCardPayment: true,
          date: new Date("2024-01-14"),
          createdAt: new Date("2024-01-14"),
        },
      ];

      const stats = ExpensesStatsService.calculateMonthlyStats(
        expenses,
        mockCategories,
        undefined,
        currentDate
      );

      expect(stats.subcategoryBreakdown).toHaveLength(3);

      const restaurantes = stats.subcategoryBreakdown.find(
        (s) => s.subcategoryId === "1-1"
      );
      expect(restaurantes).toBeDefined();
      expect(restaurantes!.subcategoryName).toBe("Restaurantes");
      expect(restaurantes!.subcategoryIcon).toBe("🍽️");
      expect(restaurantes!.categoryName).toBe("Comida");
      expect(restaurantes!.total).toBe(100);

      const uncategorized = stats.subcategoryBreakdown.find((s) =>
        s.subcategoryId.startsWith("uncategorized:")
      );
      expect(uncategorized).toBeDefined();
      expect(uncategorized!.subcategoryName).toBe("Comida"); // Takes parent category name
      expect(uncategorized!.total).toBe(25);
    });

    it("should sort subcategories by total amount (highest first)", () => {
      const expenses: Expense[] = [
        {
          id: "1",
          amount: 25,
          categoryId: "1",
          subcategoryId: "1-1", // Lower amount
          isCardPayment: true,
          date: new Date("2024-01-10"),
          createdAt: new Date("2024-01-10"),
        },
        {
          id: "2",
          amount: 75,
          categoryId: "1",
          subcategoryId: "1-2", // Higher amount
          isCardPayment: false,
          date: new Date("2024-01-12"),
          createdAt: new Date("2024-01-12"),
        },
      ];

      const stats = ExpensesStatsService.calculateMonthlyStats(
        expenses,
        mockCategories,
        undefined,
        currentDate
      );

      expect(stats.subcategoryBreakdown[0].subcategoryId).toBe("1-2"); // Supermercado first
      expect(stats.subcategoryBreakdown[0].total).toBe(75);
      expect(stats.subcategoryBreakdown[1].subcategoryId).toBe("1-1"); // Restaurantes second
      expect(stats.subcategoryBreakdown[1].total).toBe(25);
    });

    it("should limit subcategory breakdown to top 6", () => {
      const categoryWithManySubs: Category = {
        id: "1",
        name: "Test Category",
        icon: "🔴",
        subcategories: Array.from({ length: 10 }, (_, i) => ({
          id: `1-${i + 1}`,
          name: `Sub ${i + 1}`,
          icon: "📂",
        })),
      };

      const expenses: Expense[] = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        amount: (i + 1) * 10, // Increasing amounts
        categoryId: "1",
        subcategoryId: `1-${i + 1}`,
        isCardPayment: true,
        date: new Date("2024-01-10"),
        createdAt: new Date("2024-01-10"),
      }));

      const stats = ExpensesStatsService.calculateMonthlyStats(
        expenses,
        [categoryWithManySubs],
        undefined,
        currentDate
      );

      expect(stats.subcategoryBreakdown).toHaveLength(6);
      // Should be sorted by amount descending
      expect(stats.subcategoryBreakdown[0].subcategoryId).toBe("1-10"); // Highest amount
      expect(stats.subcategoryBreakdown[5].subcategoryId).toBe("1-5"); // 6th highest
    });

    it("should get recent expenses (last 3, sorted by date)", () => {
      const expenses: Expense[] = [
        {
          id: "1",
          amount: 100,
          categoryId: "1",
          subcategoryId: "1-1",
          isCardPayment: true,
          date: new Date("2024-01-10T10:00:00Z"),
          createdAt: new Date("2024-01-10T10:00:00Z"),
        },
        {
          id: "2",
          amount: 50,
          categoryId: "1",
          subcategoryId: "1-2",
          isCardPayment: false,
          date: new Date("2024-01-12T15:00:00Z"),
          createdAt: new Date("2024-01-12T15:00:00Z"),
        },
        {
          id: "3",
          amount: 75,
          categoryId: "2",
          subcategoryId: "2-1",
          isCardPayment: true,
          date: new Date("2024-01-14T09:00:00Z"),
          createdAt: new Date("2024-01-14T09:00:00Z"),
        },
        {
          id: "4",
          amount: 25,
          categoryId: "1",
          subcategoryId: "1-1",
          isCardPayment: true,
          date: new Date("2024-01-11T12:00:00Z"),
          createdAt: new Date("2024-01-11T12:00:00Z"),
        },
      ];

      const stats = ExpensesStatsService.calculateMonthlyStats(
        expenses,
        mockCategories,
        undefined,
        currentDate
      );

      expect(stats.recentExpenses).toHaveLength(3);
      // Should be sorted by date descending (most recent first)
      expect(stats.recentExpenses[0].id).toBe("3"); // 2024-01-14
      expect(stats.recentExpenses[1].id).toBe("2"); // 2024-01-12
      expect(stats.recentExpenses[2].id).toBe("4"); // 2024-01-11
    });

    it("should handle empty expenses array", () => {
      const stats = ExpensesStatsService.calculateMonthlyStats(
        [],
        mockCategories
      );

      expect(stats.totalSpent).toBe(0);
      expect(stats.categoryBreakdown).toHaveLength(0);
      expect(stats.subcategoryBreakdown).toHaveLength(0);
      expect(stats.recentExpenses).toHaveLength(0);
    });

    it("should handle unknown categories gracefully", () => {
      const expenses: Expense[] = [
        {
          id: "1",
          amount: 100,
          categoryId: "999", // Unknown category
          subcategoryId: "999-1",
          isCardPayment: true,
          date: new Date("2024-01-10"),
          createdAt: new Date("2024-01-10"),
        },
      ];

      const stats = ExpensesStatsService.calculateMonthlyStats(
        expenses,
        mockCategories,
        undefined,
        currentDate
      );

      expect(stats.totalSpent).toBe(100);
      expect(stats.categoryBreakdown).toHaveLength(1);
      expect(stats.categoryBreakdown[0].categoryName).toBe("Desconocida");
      expect(stats.categoryBreakdown[0].categoryIcon).toBe("❓");
    });

    it("should handle zero total spent for percentage calculations", () => {
      const stats = ExpensesStatsService.calculateMonthlyStats(
        [],
        mockCategories
      );

      expect(stats.totalSpent).toBe(0);
      expect(stats.categoryBreakdown).toHaveLength(0);
    });
  });

  describe("formatCurrency", () => {
    it("should format currency in Argentine pesos", () => {
      expect(ExpensesStatsService.formatCurrency(1000)).toBe("$\u00A01.000,00");
      expect(ExpensesStatsService.formatCurrency(1000.5)).toBe(
        "$\u00A01.000,50"
      );
      expect(ExpensesStatsService.formatCurrency(0)).toBe("$\u00A00,00");
      expect(ExpensesStatsService.formatCurrency(999999.99)).toBe(
        "$\u00A0999.999,99"
      );
    });

    it("should handle negative amounts", () => {
      expect(ExpensesStatsService.formatCurrency(-100)).toBe("-$\u00A0100,00");
    });

    it("should handle large numbers", () => {
      expect(ExpensesStatsService.formatCurrency(1000000)).toBe(
        "$\u00A01.000.000,00"
      );
    });
  });

  describe("formatDate", () => {
    const mockCurrentDate = new Date("2024-01-15T12:00:00");

    it("should return 'Hoy' for today", () => {
      const today = new Date("2024-01-15T10:00:00");
      expect(ExpensesStatsService.formatDate(today, mockCurrentDate)).toBe(
        "Hoy"
      );
    });

    it("should return 'Ayer' for yesterday", () => {
      const yesterday = new Date("2024-01-14T10:00:00");
      expect(ExpensesStatsService.formatDate(yesterday, mockCurrentDate)).toBe(
        "Ayer"
      );
    });

    it("should return formatted date for other dates", () => {
      const otherDate = new Date("2024-01-10T10:00:00");
      expect(ExpensesStatsService.formatDate(otherDate, mockCurrentDate)).toBe(
        "10/1"
      );
    });

    it("should handle dates from different months", () => {
      const otherMonth = new Date("2023-12-25T10:00:00");
      expect(ExpensesStatsService.formatDate(otherMonth, mockCurrentDate)).toBe(
        "25/12"
      );
    });

    it("should handle future dates", () => {
      const futureDate = new Date("2024-01-20T10:00:00");
      expect(ExpensesStatsService.formatDate(futureDate, mockCurrentDate)).toBe(
        "20/1"
      );
    });
  });
});
