import { Link } from "react-router-dom";
import { EXPENSES } from "@/common/consts/pages-urls";

export default function HomePage() {
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
          <div className="flex justify-between items-center mb-5">
            <span className="text-gray-400">Total gastado</span>
            <span className="text-white font-bold text-2xl">$8,459.50</span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full h-3 bg-gray-700 rounded-full mb-4">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              style={{ width: "70%" }}
            ></div>
          </div>

          <div className="flex justify-between text-sm text-gray-400">
            <span>0%</span>
            <span>Presupuesto: $12,000</span>
            <span>100%</span>
          </div>
        </div>
      </section>

      {/* Distribución por categorías */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            Categorías principales
          </h2>
          <Link to={EXPENSES} className="text-blue-400 text-sm">
            Ver todas
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <CategoryCard
            name="Servicios"
            icon="💡"
            amount="$2,845.00"
            percentage={35}
            color="from-indigo-500 to-purple-500"
          />
          <CategoryCard
            name="Supermercado"
            icon="🛒"
            amount="$1,950.30"
            percentage={25}
            color="from-blue-500 to-cyan-400"
          />
          <CategoryCard
            name="Deudas Fijas"
            icon="🏠"
            amount="$2,200.00"
            percentage={28}
            color="from-green-500 to-emerald-400"
          />
          <CategoryCard
            name="Transporte"
            icon="🛢️"
            amount="$980.20"
            percentage={12}
            color="from-amber-500 to-orange-400"
          />
        </div>
      </section>

      {/* Últimos gastos */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Últimos gastos</h2>
          <Link to={EXPENSES} className="text-blue-400 text-sm">
            Ver todos
          </Link>
        </div>

        <div className="space-y-3">
          <ExpenseItem
            title="Factura Edesur"
            category="Servicios"
            date="Hoy"
            amount="$850.00"
            icon="💡"
          />
          <ExpenseItem
            title="Supermercado"
            category="Comida"
            date="Ayer"
            amount="$1,235.40"
            icon="🛒"
          />
          <ExpenseItem
            title="Nafta"
            category="Transporte"
            date="25/05"
            amount="$580.20"
            icon="⛽"
          />
        </div>
      </section>

      {/* Botón de acción flotante */}
      <Link
        to={EXPENSES}
        className="fixed bottom-20 right-4 bg-gradient-to-r from-blue-500 to-indigo-600 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
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
  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
    <div className="flex justify-between items-start mb-2">
      <span className="text-2xl">{icon}</span>
      <span className="text-right text-white font-bold">{amount}</span>
    </div>
    <h3 className="text-gray-300 font-medium mb-2">{name}</h3>
    <div className="w-full h-1.5 bg-gray-700 rounded-full mb-1">
      <div
        className={`h-full bg-gradient-to-r ${color} rounded-full`}
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
}: {
  title: string;
  category: string;
  date: string;
  amount: string;
  icon: string;
}) => (
  <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center">
    <div className="rounded-full bg-gray-700 p-2 mr-3">
      <span className="text-xl">{icon}</span>
    </div>
    <div className="flex-1">
      <h3 className="text-white font-medium">{title}</h3>
      <p className="text-sm text-gray-400">
        {category} • {date}
      </p>
    </div>
    <span className="text-white font-medium">{amount}</span>
  </div>
);
