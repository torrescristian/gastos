import { Link } from "react-router-dom";
import { EXPENSES } from "@/common/consts/pages-urls";
import { useExpensesQuery } from "@/expenses/infrastructure/react-adapters/useExpensesQuery";
import { useCategoriesQuery } from "@/expenses/infrastructure/react-adapters/useCategoriesQuery";
import { ExpensesStatsService } from "@/expenses/domain/services/ExpensesStatsService";

export default function HomePage() {
  const { data: expenses = [], isLoading: expensesLoading } =
    useExpensesQuery();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategoriesQuery();

  // Calculate monthly statistics without budget
  const monthlyStats = ExpensesStatsService.calculateMonthlyStats(
    expenses,
    categories
  );

  const isLoading = expensesLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="px-4 py-6 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header con saludo */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">¡Hola!</h1>
        <p className="text-gray-400 mt-1">Bienvenido a tu gestor de gastos</p>
      </header>

      {/* Resumen de gastos */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Resumen del mes
        </h2>
        <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400">Total gastado</span>
            <span className="text-white font-bold text-2xl">
              {ExpensesStatsService.formatCurrency(monthlyStats.totalSpent)}
            </span>
          </div>

          <div className="text-center">
            <div className="text-6xl mb-3">💰</div>
            <p className="text-gray-400 text-sm">
              {monthlyStats.totalSpent > 0
                ? `Has gastado ${ExpensesStatsService.formatCurrency(
                    monthlyStats.totalSpent
                  )} este mes`
                : "¡Aún no has registrado gastos este mes!"}
            </p>
          </div>
        </div>
      </section>

      {/* Distribución por categorías */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {monthlyStats.categoryBreakdown.length > 0
              ? "Categorías principales"
              : "Sin gastos este mes"}
          </h2>
          <Link to={EXPENSES} className="text-blue-400 text-sm">
            Ver todas
          </Link>
        </div>

        {monthlyStats.categoryBreakdown.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {monthlyStats.categoryBreakdown.map((categoryData) => (
              <CategoryCard
                key={categoryData.categoryId}
                name={categoryData.categoryName}
                icon={categoryData.categoryIcon}
                amount={ExpensesStatsService.formatCurrency(categoryData.total)}
                percentage={categoryData.percentage}
                color={categoryData.color}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-gray-400 text-4xl mb-3">📊</div>
            <p className="text-gray-400">No hay gastos registrados este mes</p>
            <Link
              to={EXPENSES}
              className="mt-3 inline-block text-blue-400 hover:text-blue-300"
            >
              Registrar primer gasto
            </Link>
          </div>
        )}
      </section>

      {/* Últimos gastos */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Últimos gastos</h2>
          <Link to={EXPENSES} className="text-blue-400 text-sm">
            Ver todos
          </Link>
        </div>

        {monthlyStats.recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {monthlyStats.recentExpenses.map((expense) => {
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
                  amount={ExpensesStatsService.formatCurrency(expense.amount)}
                  icon={subcategory?.icon || category?.icon || "💰"}
                  isCardPayment={expense.isCardPayment}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-gray-400 text-4xl mb-3">📝</div>
            <p className="text-gray-400">No hay gastos recientes</p>
          </div>
        )}
      </section>

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
    </div>
  );
}

// Componente de tarjeta de categoría
const CategoryCard = ({
  name,
  icon,
  amount,
  percentage,
  color,
}: {
  name: string;
  icon: string;
  amount: string;
  percentage: number;
  color: string;
}) => (
  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:bg-gray-750 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <span className="text-2xl">{icon}</span>
      <span className="text-right text-white font-bold">{amount}</span>
    </div>
    <h3 className="text-gray-300 font-medium mb-2">{name}</h3>
    <div className="w-full h-1.5 bg-gray-700 rounded-full mb-1">
      <div
        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
    <span className="text-xs text-gray-400">{percentage}%</span>
  </div>
);

// Componente de ítem de gasto
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
}) => (
  <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center hover:bg-gray-750 transition-colors">
    <div className="rounded-full bg-gray-700 p-2 mr-3">
      <span className="text-xl">{icon}</span>
    </div>
    <div className="flex-1">
      <h3 className="text-white font-medium">{title}</h3>
      <div className="flex items-center space-x-2">
        <p className="text-sm text-gray-400">
          {category} • {date}
        </p>
        {isCardPayment && (
          <span className="text-xs bg-orange-900/30 text-orange-400 px-2 py-0.5 rounded">
            💳 Tarjeta
          </span>
        )}
      </div>
    </div>
    <span className="text-white font-medium">{amount}</span>
  </div>
);
