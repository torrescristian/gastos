import { Link } from "react-router-dom";
import { EXPENSES } from "@/common/consts/pages-urls";
import { useExpensesQuery } from "@/expenses/infrastructure/react-adapters/useExpensesQuery";
import { useCategoriesQuery } from "@/expenses/infrastructure/react-adapters/useCategoriesQuery";
import { ExpensesStatsService } from "@/expenses/domain/services/ExpensesStatsService";
import { Expense } from "@/expenses/domain/entities/Expense";
import { Category } from "@/expenses/domain/entities/Category";
import { useSyncState } from "@/common/infrastructure/react-adapters/useSyncState";
import { SyncStatusEnum } from "@/common/domain/entities/SyncStatus";
import { useState } from "react";

export default function HomePage() {
  const { data: expenses = [], isLoading: expensesLoading } =
    useExpensesQuery();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategoriesQuery();
  const { syncState, syncNow, isSyncing, canSync } = useSyncState();
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  const isLoading = expensesLoading || categoriesLoading;

  const handleSync = async () => {
    const success = await syncNow();
    if (success) {
      setShowSyncSuccess(true);
      setTimeout(() => setShowSyncSuccess(false), 3000);
    }
  };

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

  const getSyncStatusDisplay = () => {
    if (!syncState) {
      return {
        icon: "❓",
        text: "Cargando...",
        color: "text-gray-400",
      };
    }

    switch (syncState.status) {
      case SyncStatusEnum.SYNCED:
        return {
          icon: "✅",
          text: "Sincronizado",
          color: "text-green-400",
        };
      case SyncStatusEnum.PENDING:
        return {
          icon: "⏳",
          text: `${syncState.pendingCount} pendiente${
            syncState.pendingCount !== 1 ? "s" : ""
          }`,
          color: "text-orange-400",
        };
      case SyncStatusEnum.SYNCING:
        return {
          icon: "🔄",
          text: "Sincronizando...",
          color: "text-blue-400",
        };
      case SyncStatusEnum.ERROR:
        return {
          icon: "❌",
          text: "Error de sync",
          color: "text-red-400",
        };
      case SyncStatusEnum.OFFLINE:
        return {
          icon: "📱",
          text: "Sin conexión",
          color: "text-gray-400",
        };
      default:
        return {
          icon: "❓",
          text: "Desconocido",
          color: "text-gray-400",
        };
    }
  };

  const statusDisplay = getSyncStatusDisplay();

  return (
    <div className="px-4 py-6 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Mis Gastos</h1>
            <p className="text-gray-400 mt-1">Historial completo de gastos</p>
          </div>

          {/* Sync Status */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div
                className={`text-sm ${statusDisplay.color} flex items-center space-x-1`}
              >
                <span>{statusDisplay.icon}</span>
                <span>{statusDisplay.text}</span>
              </div>
              {syncState?.lastSync && (
                <p className="text-xs text-gray-500">
                  Última:{" "}
                  {syncState.lastSync.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>

            {/* Sync Button */}
            {canSync && (
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className={`p-2 rounded-lg transition-colors ${
                  isSyncing
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                title="Sincronizar con servidor"
              >
                <svg
                  className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <ExpensesList
        expenses={expenses}
        categories={categories}
        isLoading={isLoading}
      />

      {/* Botón de acción flotante */}
      <Link
        to={EXPENSES}
        className="fixed bottom-20 right-4 bg-gradient-to-r from-blue-500 to-indigo-600 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </Link>

      {/* Success Toast */}
      {showSyncSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <span>✅</span>
          <span>Gastos sincronizados exitosamente</span>
        </div>
      )}
    </div>
  );
}

// Componente para listar gastos
const ExpensesList = ({
  expenses,
  categories,
  isLoading,
}: {
  expenses: Expense[];
  categories: Category[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p>Cargando gastos...</p>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-white text-lg font-semibold mb-2">
          No hay gastos registrados
        </h3>
        <p className="text-gray-400 mb-6">
          Comienza registrando tu primer gasto
        </p>
        <Link
          to={EXPENSES}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Registrar primer gasto
        </Link>
      </div>
    );
  }

  // Calcular estadísticas totales
  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const currentMonth = new Date();
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth.getMonth() &&
      expenseDate.getFullYear() === currentMonth.getFullYear()
    );
  });
  const currentMonthTotal = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calcular estadísticas del mes actual
  const monthlyStats = ExpensesStatsService.calculateMonthlyStats(
    expenses,
    categories
  );

  // Agrupar gastos por mes
  const expensesByMonth = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const monthName = date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    });

    if (!acc[monthKey]) {
      acc[monthKey] = {
        name: monthName,
        expenses: [],
        total: 0,
      };
    }

    acc[monthKey].expenses.push(expense);
    acc[monthKey].total += expense.amount;
    return acc;
  }, {} as Record<string, { name: string; expenses: Expense[]; total: number }>);

  return (
    <div className="space-y-6">
      {/* Resumen de estadísticas */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="text-white font-semibold mb-3">📊 Resumen</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Este mes</p>
            <p className="text-white font-bold text-xl">
              {ExpensesStatsService.formatCurrency(currentMonthTotal)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Total histórico</p>
            <p className="text-white font-bold text-xl">
              {ExpensesStatsService.formatCurrency(totalAmount)}
            </p>
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-gray-400 text-sm">
            {expenses.length} gasto{expenses.length !== 1 ? "s" : ""} registrado
            {expenses.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Categorías del mes actual */}
      {monthlyStats.categoryBreakdown.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-3">
            🏷️ Categorías este mes
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {monthlyStats.categoryBreakdown.slice(0, 4).map((categoryData) => (
              <div
                key={categoryData.categoryId}
                className="bg-gray-700 rounded-lg p-3"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg">{categoryData.categoryIcon}</span>
                  <span className="text-white font-medium text-sm">
                    {ExpensesStatsService.formatCurrency(categoryData.total)}
                  </span>
                </div>
                <p className="text-gray-300 text-sm font-medium">
                  {categoryData.categoryName}
                </p>
                <div className="w-full h-1 bg-gray-600 rounded-full mt-2">
                  <div
                    className={`h-full bg-gradient-to-r ${categoryData.color} rounded-full transition-all duration-500`}
                    style={{ width: `${categoryData.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de gastos agrupados por mes */}
      {Object.entries(expensesByMonth)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([key, monthData]) => (
          <div
            key={key}
            className="bg-gray-800 rounded-xl border border-gray-700"
          >
            {/* Encabezado del mes */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-semibold capitalize">
                  {monthData.name}
                </h3>
                <div className="text-right">
                  <span className="text-white font-bold">
                    {ExpensesStatsService.formatCurrency(monthData.total)}
                  </span>
                  <p className="text-gray-400 text-sm">
                    {monthData.expenses.length} gasto
                    {monthData.expenses.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de gastos del mes */}
            <div className="p-4 space-y-3">
              {monthData.expenses
                .sort(
                  (a: Expense, b: Expense) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((expense: Expense) => {
                  const category = categories.find(
                    (cat) => cat.id.toString() === expense.categoryId
                  );
                  const subcategory = category?.subcategories.find(
                    (sub) => sub.id.toString() === expense.subcategoryId
                  );

                  return (
                    <ExpenseItem
                      key={expense.id}
                      title={
                        expense.note ||
                        subcategory?.name ||
                        category?.name ||
                        "Gasto"
                      }
                      category={category?.name || "Desconocida"}
                      date={ExpensesStatsService.formatDate(expense.date)}
                      amount={ExpensesStatsService.formatCurrency(
                        expense.amount
                      )}
                      icon={subcategory?.icon || category?.icon || "💰"}
                      isCardPayment={expense.isCardPayment}
                    />
                  );
                })}
            </div>
          </div>
        ))}
    </div>
  );
};

// Componente para cada ítem de gasto
const ExpenseItem = ({
  title,
  category,
  date,
  amount,
  icon,
  isCardPayment,
}: {
  title: string;
  category: string;
  date: string;
  amount: string;
  icon: string;
  isCardPayment: boolean;
}) => {
  const { syncState } = useSyncState();

  // Check if this expense is pending sync (simplified check by checking if it's from today and there are pending items)
  const isPendingSync = (syncState?.pendingCount ?? 0) > 0 && date === "Hoy";

  return (
    <div className="bg-gray-700 rounded-lg p-3 flex items-center hover:bg-gray-600 transition-colors">
      <div className="rounded-full bg-gray-600 p-2 mr-3">
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h4 className="text-white font-medium">{title}</h4>
          {isPendingSync && (
            <span className="text-xs bg-orange-900/30 text-orange-400 px-1.5 py-0.5 rounded flex items-center space-x-1">
              <span>⏳</span>
              <span>Pendiente</span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-400">
            {category} • {date}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-1">
        {isCardPayment && (
          <span className="text-xs bg-orange-900/30 text-orange-400 px-2 py-0.5 rounded">
            💳 Tarjeta
          </span>
        )}
        <span className="text-white font-medium">{amount}</span>
      </div>
    </div>
  );
};
