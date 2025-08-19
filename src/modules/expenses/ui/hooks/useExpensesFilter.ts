import { useState, useMemo } from "react";
import { Expense } from "@/expenses/domain/entities/Expense";

export const useExpensesFilter = (expenses: Expense[]) => {
  const [filterCategoryId, setFilterCategoryId] = useState<string>("");
  const [filterSubcategoryId, setFilterSubcategoryId] = useState<string>("");
  const [filterMethod, setFilterMethod] = useState<"all" | "cash" | "card">(
    "all"
  );
  const [filterText, setFilterText] = useState<string>("");
  const [filterFrom, setFilterFrom] = useState<string>("");
  const [filterTo, setFilterTo] = useState<string>("");

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (filterMethod !== "all") {
        if (filterMethod === "cash" && e.isCardPayment) return false;
        if (filterMethod === "card" && !e.isCardPayment) return false;
      }
      if (filterCategoryId && e.categoryId !== filterCategoryId) return false;
      if (filterSubcategoryId && e.subcategoryId !== filterSubcategoryId)
        return false;
      if (filterText) {
        const text = filterText.toLowerCase();
        if (!(e.note || "").toLowerCase().includes(text)) return false;
      }
      if (filterFrom) {
        const d = new Date(e.date);
        if (d < new Date(filterFrom)) return false;
      }
      if (filterTo) {
        const d = new Date(e.date);
        if (d > new Date(filterTo)) return false;
      }
      return true;
    });
  }, [
    expenses,
    filterMethod,
    filterCategoryId,
    filterSubcategoryId,
    filterText,
    filterFrom,
    filterTo,
  ]);

  const clearFilters = () => {
    setFilterCategoryId("");
    setFilterSubcategoryId("");
    setFilterMethod("all");
    setFilterText("");
    setFilterFrom("");
    setFilterTo("");
  };

  return {
    filteredExpenses,
    filters: {
      filterCategoryId,
      setFilterCategoryId,
      filterSubcategoryId,
      setFilterSubcategoryId,
      filterMethod,
      setFilterMethod,
      filterText,
      setFilterText,
      filterFrom,
      setFilterFrom,
      filterTo,
      setFilterTo,
    },
    clearFilters,
  };
};
