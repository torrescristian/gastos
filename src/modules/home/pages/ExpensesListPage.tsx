import { useExpensesQuery } from "@/expenses/infrastructure/react-adapters/useExpensesQuery";
import { useCategoriesQuery } from "@/expenses/infrastructure/react-adapters/useCategoriesQuery";
import ExpensesList from "@/expenses/ui/components/organisms/ExpensesList";
import PageHeader from "@/expenses/ui/components/molecules/PageHeader";
import { useTranslation } from "@/common/hooks/useTranslation";

export default function ExpensesListPage() {
  const { data: expenses = [], isLoading: expensesLoading } =
    useExpensesQuery();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategoriesQuery();
  const { t } = useTranslation();

  const isLoading = expensesLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="px-4 py-6 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>{t("loadingExpenses")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <PageHeader
        title={t("myExpenses")}
        subtitle={t("completeExpenseHistory")}
        showAddButton={true}
      />

      <ExpensesList
        expenses={expenses}
        categories={categories}
        isLoading={isLoading}
        showAnalysis={true}
      />
    </div>
  );
}
