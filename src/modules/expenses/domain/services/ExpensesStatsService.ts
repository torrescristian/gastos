import { Expense } from "@/expenses/domain/entities/Expense";
import { Category } from "@/expenses/domain/entities/Category";

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  total: number;
  percentage: number;
  color: string;
}

export interface SubcategoryStats {
  subcategoryId: string;
  subcategoryName: string;
  subcategoryIcon: string;
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
  color: string;
}

export interface MonthlyStats {
  totalSpent: number;
  budget?: number;
  percentage?: number;
  categoryBreakdown: CategoryStats[];
  subcategoryBreakdown: SubcategoryStats[];
  recentExpenses: Expense[];
}

export class ExpensesStatsService {
  private static readonly CATEGORY_COLORS = [
    "from-indigo-500 to-purple-500",
    "from-blue-500 to-cyan-400",
    "from-green-500 to-emerald-400",
    "from-amber-500 to-orange-400",
    "from-red-500 to-pink-400",
    "from-purple-500 to-indigo-400",
    "from-teal-500 to-green-400",
  ];

  static calculateMonthlyStats(
    expenses: Expense[],
    categories: Category[],
    budget?: number,
    currentDate?: Date
  ): MonthlyStats {
    // Filter expenses for current month
    const now = currentDate || new Date();
    const currentMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    });

    // Calculate total spent
    const totalSpent = currentMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Calculate percentage of budget used only if budget is provided
    const percentage =
      budget && budget > 0
        ? Math.round((totalSpent / budget) * 100)
        : undefined;

    // Calculate category breakdown
    const categoryTotals = new Map<string, number>();

    currentMonthExpenses.forEach((expense) => {
      const currentTotal = categoryTotals.get(expense.categoryId) || 0;
      categoryTotals.set(expense.categoryId, currentTotal + expense.amount);
    });

    const categoryEntries = Array.from(categoryTotals.entries());
    const categoryMapped = categoryEntries.map(([categoryId, total], index) => {
      const category = categories.find(
        (cat) => cat.id.toString() === categoryId
      );
      const categoryPercentage =
        totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0;

      return {
        categoryId,
        categoryName: category?.name || "Desconocida",
        categoryIcon: category?.icon || "❓",
        total,
        percentage: categoryPercentage,
        color: this.CATEGORY_COLORS[index % this.CATEGORY_COLORS.length],
      };
    });
    const categorySorted = [...categoryMapped].sort(
      (a, b) => b.total - a.total
    );
    const categoryBreakdown: CategoryStats[] = categorySorted.slice(0, 4);

    // Calculate subcategory breakdown (emphasis)
    const subcategoryTotals = new Map<string, number>();
    currentMonthExpenses.forEach((expense) => {
      const key =
        expense.subcategoryId && expense.subcategoryId.trim() !== ""
          ? expense.subcategoryId
          : `uncategorized:${expense.categoryId}`;
      const currentTotal = subcategoryTotals.get(key) || 0;
      subcategoryTotals.set(key, currentTotal + expense.amount);
    });

    const subEntries = Array.from(subcategoryTotals.entries());
    const subMapped = subEntries.map(([subKey, total], index) => {
      let subcategoryId = subKey;
      let subcategoryName = "Sin subcategoría";
      let subcategoryIcon = "🏷️";
      let categoryId = "";
      let categoryName = "Desconocida";

      if (subKey.startsWith("uncategorized:")) {
        categoryId = subKey.replace("uncategorized:", "");
        const category = categories.find(
          (cat) => cat.id.toString() === categoryId
        );
        categoryName = category?.name || "Desconocida";
        subcategoryName = categoryName;
        subcategoryIcon = category?.icon || "❓";
      } else {
        // find subcategory and its parent category
        const parent = categories.find((cat) =>
          cat.subcategories.some((sub) => sub.id.toString() === subKey)
        );
        if (parent) {
          categoryId = parent.id.toString();
          categoryName = parent.name;
          const sub = parent.subcategories.find(
            (s) => s.id.toString() === subKey
          );
          if (sub) {
            subcategoryId = sub.id.toString();
            subcategoryName = sub.name;
            subcategoryIcon = sub.icon;
          }
        }
      }

      const percentage =
        totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0;

      return {
        subcategoryId,
        subcategoryName,
        subcategoryIcon,
        categoryId,
        categoryName,
        total,
        percentage,
        color: this.CATEGORY_COLORS[index % this.CATEGORY_COLORS.length],
      };
    });
    const subSorted = [...subMapped].sort((a, b) => b.total - a.total);
    const subcategoryBreakdown: SubcategoryStats[] = subSorted.slice(0, 6);

    // Get recent expenses (last 3)
    const recentSorted = [...currentMonthExpenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const recentExpenses = recentSorted.slice(0, 3);

    return {
      totalSpent,
      budget,
      percentage,
      categoryBreakdown,
      subcategoryBreakdown,
      recentExpenses,
    };
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  static formatDate(date: Date, currentDate?: Date): string {
    const now = currentDate || new Date();
    const expenseDate = new Date(date);

    // Check if it's today
    if (expenseDate.toDateString() === now.toDateString()) {
      return "Hoy";
    }

    // Check if it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (expenseDate.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    }

    // Format as dd/MM
    return expenseDate.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
    });
  }
}
