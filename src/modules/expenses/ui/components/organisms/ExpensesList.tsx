import React from "react";
import { useNavigate } from "react-router-dom";
import { Expense } from "@/expenses/domain/entities/Expense";
import { Category } from "@/expenses/domain/entities/Category";
import { ExpensesStatsService } from "@/expenses/domain/services/ExpensesStatsService";
import { getExpenseEditUrl } from "@/common/consts/pages-urls";

interface ExpensesListProps {
  expenses: Expense[];
  categories: Category[];
  isLoading: boolean;
  showAnalysis?: boolean;
}

const ExpensesList: React.FC<ExpensesListProps> = ({
  expenses,
  categories,
  isLoading,
  showAnalysis = true,
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
    const isFilterMode =
      new URLSearchParams(location.search).get("filters") === "1";
    return (
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-white text-lg font-semibold mb-2">
          {isFilterMode ? "Sin resultados" : "No hay gastos registrados"}
        </h3>
        <p className="text-gray-400 mb-6">
          {isFilterMode
            ? "Ajusta los filtros para encontrar lo que buscas"
            : "Comienza registrando tu primer gasto"}
        </p>
      </div>
    );
  }

  // Calcular estadísticas totales (con lista ya filtrada)
  const currentMonth = new Date();
  const currentMonthExpenses = expenses.filter((expense: Expense) => {
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

  // Calcular estadísticas del mes anterior
  const previousMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() - 1
  );
  const previousMonthExpenses = expenses.filter((expense: Expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === previousMonth.getMonth() &&
      expenseDate.getFullYear() === previousMonth.getFullYear()
    );
  });
  const previousMonthTotal = previousMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Separar gastos en efectivo vs tarjeta (este mes)
  const currentMonthCash = currentMonthExpenses
    .filter((expense) => !expense.isCardPayment)
    .reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonthCard = currentMonthExpenses
    .filter((expense) => expense.isCardPayment)
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Calcular estadísticas del mes actual con datos filtrados (ya vienen en props)
  const monthlyStats = ExpensesStatsService.calculateMonthlyStats(
    expenses,
    categories
  );

  // Agrupar gastos por mes
  const expensesByMonth = expenses.reduce(
    (
      acc: Record<string, { name: string; expenses: Expense[]; total: number }>,
      expense: Expense
    ) => {
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
    },
    {} as Record<string, { name: string; expenses: Expense[]; total: number }>
  );

  return (
    <div className="space-y-6">
      {/* Resumen de estadísticas */}
      {showAnalysis && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-3">📊 Resumen</h3>

          {/* Desglose por método de pago este mes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 text-sm font-medium">
                  💸 Efectivo
                </span>
                <span className="text-white font-semibold text-lg">
                  {ExpensesStatsService.formatCurrency(currentMonthCash)}
                </span>
              </div>
              <div className="text-xs text-gray-400">Este mes</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-400 text-sm font-medium">
                  💳 Tarjeta
                </span>
                <span className="text-white font-semibold text-lg">
                  {ExpensesStatsService.formatCurrency(currentMonthCard)}
                </span>
              </div>
              <div className="text-xs text-gray-400">Este mes</div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Total este mes:{" "}
              <span className="text-white font-semibold">
                {ExpensesStatsService.formatCurrency(currentMonthTotal)}
              </span>
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {expenses.length} gasto{expenses.length !== 1 ? "s" : ""}{" "}
              registrado
              {expenses.length !== 1 ? "s" : ""} • Mes anterior:{" "}
              {ExpensesStatsService.formatCurrency(previousMonthTotal)}
              {previousMonthTotal > 0 &&
                (() => {
                  const trendUp = currentMonthTotal > previousMonthTotal;
                  const trendDown = currentMonthTotal < previousMonthTotal;
                  let trendClass = "text-gray-400";
                  let trendArrow = "→";
                  if (trendUp) {
                    trendClass = "text-red-400";
                    trendArrow = "↑";
                  } else if (trendDown) {
                    trendClass = "text-green-400";
                    trendArrow = "↓";
                  }
                  return (
                    <span className={`ml-2 ${trendClass}`}>
                      {trendArrow}
                      {ExpensesStatsService.formatCurrency(
                        Math.abs(currentMonthTotal - previousMonthTotal)
                      )}
                    </span>
                  );
                })()}
            </p>
          </div>
        </div>
      )}

      {/* Subcategorías del mes actual (énfasis) */}
      {showAnalysis && monthlyStats.subcategoryBreakdown.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-3">
            🏷️ Subcategorías este mes
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {monthlyStats.subcategoryBreakdown.map((subData) => (
              <div
                key={subData.subcategoryId}
                className="bg-gray-700 rounded-lg p-3"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg">{subData.subcategoryIcon}</span>
                  <span className="text-white font-medium text-sm">
                    {ExpensesStatsService.formatCurrency(subData.total)}
                  </span>
                </div>
                <p className="text-gray-300 text-sm font-medium truncate">
                  {subData.subcategoryName}
                </p>
                <div className="w-full h-1 bg-gray-600 rounded-full mt-2">
                  <div
                    className={`h-full bg-gradient-to-r ${subData.color} rounded-full transition-all duration-500`}
                    style={{ width: `${subData.percentage}%` }}
                  ></div>
                </div>
                <p className="text-gray-500 text-xs mt-1 truncate">
                  {subData.categoryName}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de gastos agrupados por mes */}
      {(
        Object.entries(expensesByMonth) as Array<
          [string, { name: string; expenses: Expense[]; total: number }]
        >
      )
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([key, monthData]) => {
          const sortedExpenses = [...monthData.expenses].sort(
            (a: Expense, b: Expense) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          return (
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
                {sortedExpenses.map((expense: Expense) => {
                  const category = categories.find(
                    (cat) => cat.id.toString() === expense.categoryId
                  );
                  const subcategory = category?.subcategories.find(
                    (sub) => sub.id.toString() === expense.subcategoryId
                  );

                  return (
                    <ExpenseItem
                      key={expense.id}
                      id={expense.id || ""}
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
          );
        })}
    </div>
  );
};

// Componente para cada ítem de gasto
const ExpenseItem = ({
  id,
  title,
  category,
  date,
  amount,
  icon,
  isCardPayment,
}: {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: string;
  icon: string;
  isCardPayment: boolean;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id && id.trim() !== "") {
      navigate(getExpenseEditUrl(id));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      className="bg-gray-700 rounded-lg p-3 w-full flex items-center hover:bg-gray-600 transition-colors cursor-pointer touch-manipulation text-left"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="rounded-full bg-gray-600 p-2 mr-3 flex-shrink-0">
        <span className="text-lg">{icon}</span>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium truncate">{title}</h4>
        <p className="text-sm text-gray-400 truncate">
          {category} • {date}
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex flex-col items-end space-y-1 flex-shrink-0">
          {/* Status and Payment Method Row */}
          <div className="flex items-center space-x-2">
            {isCardPayment && (
              <span className="text-xs bg-orange-900/30 text-orange-400 px-1.5 py-0.5 rounded whitespace-nowrap">
                💳 Tarjeta
              </span>
            )}
          </div>

          {/* Amount */}
          <span className="text-white font-medium text-right">{amount}</span>
        </div>

        {/* Edit indicator */}
        <div className="text-gray-400 text-sm flex-shrink-0">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default ExpensesList;
