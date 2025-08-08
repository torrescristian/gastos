import { Link, useLocation, useNavigate } from "react-router-dom";
import { EXPENSES, getExpenseEditUrl } from "@/common/consts/pages-urls";
import { useExpensesQuery } from "@/expenses/infrastructure/react-adapters/useExpensesQuery";
import { useCategoriesQuery } from "@/expenses/infrastructure/react-adapters/useCategoriesQuery";
import { ExpensesStatsService } from "@/expenses/domain/services/ExpensesStatsService";
import { Expense } from "@/expenses/domain/entities/Expense";
import { Category } from "@/expenses/domain/entities/Category";
import { useMemo, useState } from "react";

export default function HomePage() {
  const { data: expenses = [], isLoading: expensesLoading } =
    useExpensesQuery();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategoriesQuery();
  const location = useLocation();

  const isLoading = expensesLoading || categoriesLoading;
  const showFilters =
    new URLSearchParams(location.search).get("filters") === "1";

  // Filtros: fecha (mes actual por defecto), categoría, subcategoría, método de pago, texto
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
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-white">Mis Gastos</h1>
            <p className="text-gray-400 mt-1">Historial completo de gastos</p>
          </div>
        </div>
      </header>

      {/* Panel de filtros en modo Filtrar */}
      {showFilters && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-6">
          <h3 className="text-white font-semibold mb-3">Filtros</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Fecha desde */}
            <div>
              <label
                htmlFor="filter-from"
                className="block text-xs text-gray-400 mb-1"
              >
                Desde
              </label>
              <input
                id="filter-from"
                type="date"
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              />
            </div>
            {/* Fecha hasta */}
            <div>
              <label
                htmlFor="filter-to"
                className="block text-xs text-gray-400 mb-1"
              >
                Hasta
              </label>
              <input
                id="filter-to"
                type="date"
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              />
            </div>
            {/* Método de pago */}
            <div>
              <label
                htmlFor="filter-method"
                className="block text-xs text-gray-400 mb-1"
              >
                Pago
              </label>
              <select
                id="filter-method"
                value={filterMethod}
                onChange={(e) =>
                  setFilterMethod(e.target.value as "all" | "cash" | "card")
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              >
                <option value="all">Todos</option>
                <option value="cash">Contado</option>
                <option value="card">Tarjeta</option>
              </select>
            </div>
            {/* Texto */}
            <div>
              <label
                htmlFor="filter-text"
                className="block text-xs text-gray-400 mb-1"
              >
                Texto
              </label>
              <input
                id="filter-text"
                type="text"
                placeholder="Buscar en notas..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              />
            </div>
            {/* Categoría */}
            <div>
              <label
                htmlFor="filter-category"
                className="block text-xs text-gray-400 mb-1"
              >
                Categoría
              </label>
              <select
                id="filter-category"
                value={filterCategoryId}
                onChange={(e) => {
                  setFilterCategoryId(e.target.value);
                  setFilterSubcategoryId("");
                }}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              >
                <option value="">Todas</option>
                {categories
                  .filter((c) => !c.isLegacy)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
            {/* Subcategoría */}
            <div>
              <label
                htmlFor="filter-subcategory"
                className="block text-xs text-gray-400 mb-1"
              >
                Subcategoría
              </label>
              <select
                id="filter-subcategory"
                value={filterSubcategoryId}
                onChange={(e) => setFilterSubcategoryId(e.target.value)}
                disabled={!filterCategoryId}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white disabled:opacity-50"
              >
                <option value="">Todas</option>
                {categories
                  .find((c) => c.id.toString() === filterCategoryId)
                  ?.subcategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setFilterCategoryId("");
                setFilterSubcategoryId("");
                setFilterMethod("all");
                setFilterText("");
                setFilterFrom("");
                setFilterTo("");
              }}
              className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-200"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Modo Filtrar: solo listado sin resumen/analítica */}
      {showFilters ? (
        <ExpensesList
          expenses={filteredExpenses}
          categories={categories}
          isLoading={isLoading}
          showAnalysis={false}
        />
      ) : (
        <ExpensesList
          expenses={expenses}
          categories={categories}
          isLoading={isLoading}
          showAnalysis={true}
        />
      )}

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

      {/* Success Toast ocultado al deshabilitar sync */}
    </div>
  );
}

// Componente para listar gastos
const ExpensesList = ({
  expenses,
  categories,
  isLoading,
  showAnalysis = true,
}: {
  expenses: Expense[];
  categories: Category[];
  isLoading: boolean;
  showAnalysis?: boolean;
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
        <Link
          to={EXPENSES}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Registrar primer gasto
        </Link>
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
  // sync oculto temporalmente: no usar estado de sync ni etiquetas relacionadas
  const navigate = useNavigate();

  // Sync oculto: no mostrar estado pendiente
  const isPendingSync = false;

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
            {isPendingSync && (
              <span className="text-xs bg-orange-900/30 text-orange-400 px-1.5 py-0.5 rounded whitespace-nowrap">
                ⏳ Pendiente
              </span>
            )}
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
