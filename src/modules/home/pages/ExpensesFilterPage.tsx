import { useExpensesQuery } from "@/expenses/infrastructure/react-adapters/useExpensesQuery";
import { useCategoriesQuery } from "@/expenses/infrastructure/react-adapters/useCategoriesQuery";
import { useExpensesFilter } from "@/expenses/ui/hooks/useExpensesFilter";
import ExpensesList from "@/expenses/ui/components/organisms/ExpensesList";
import FilterPanel from "@/expenses/ui/components/organisms/FilterPanel";
import PageHeader from "@/expenses/ui/components/molecules/PageHeader";

export default function ExpensesFilterPage() {
  const { data: expenses = [], isLoading: expensesLoading } =
    useExpensesQuery();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategoriesQuery();

  const { filteredExpenses, filters, clearFilters } =
    useExpensesFilter(expenses);

  const isLoading = expensesLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="px-4 py-6 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Cargando gastos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <PageHeader
        title="Filtrar Gastos"
        subtitle="Busca y filtra tu historial de gastos"
        showAddButton={true}
      />

      <FilterPanel
        categories={categories}
        {...filters}
        onClearFilters={clearFilters}
      />

      <ExpensesList
        expenses={filteredExpenses}
        categories={categories}
        isLoading={isLoading}
        showAnalysis={false}
      />
    </div>
  );
}
