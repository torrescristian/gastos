import { useState, useEffect } from "react";
import { Category } from "@/expenses/domain/entities/Category";

interface FilterPanelProps {
  categories: Category[];
  filterCategoryId: string;
  setFilterCategoryId: (id: string) => void;
  filterSubcategoryId: string;
  setFilterSubcategoryId: (id: string) => void;
  filterMethod: "all" | "cash" | "card";
  setFilterMethod: (method: "all" | "cash" | "card") => void;
  filterText: string;
  setFilterText: (text: string) => void;
  filterFrom: string;
  setFilterFrom: (date: string) => void;
  filterTo: string;
  setFilterTo: (date: string) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
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
  onClearFilters,
}) => {
  const [showAdvancedDates, setShowAdvancedDates] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Establecer mes actual por defecto
  useEffect(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    setSelectedMonth(currentMonth);

    // Si no hay fechas personalizadas, establecer el mes actual
    if (!filterFrom && !filterTo) {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setFilterFrom(firstDay.toISOString().split("T")[0]);
      setFilterTo(lastDay.toISOString().split("T")[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMonthChange = (monthValue: string) => {
    setSelectedMonth(monthValue);
    if (monthValue) {
      const [year, month] = monthValue.split("-");
      const firstDay = new Date(parseInt(year), parseInt(month) - 1, 1);
      const lastDay = new Date(parseInt(year), parseInt(month), 0);
      setFilterFrom(firstDay.toISOString().split("T")[0]);
      setFilterTo(lastDay.toISOString().split("T")[0]);
    }
  };

  const toggleAdvancedDates = () => {
    setShowAdvancedDates(!showAdvancedDates);
  };
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-6">
      <h3 className="text-white font-semibold mb-3">Filtros</h3>

      {/* Toggle entre vista mensual y avanzada */}
      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-2">Período</label>

        {/* Vista mensual (por defecto) */}
        {!showAdvancedDates && (
          <div className="space-y-2">
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            >
              <option value="">Seleccionar mes</option>
              {/* Últimos 12 meses */}
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const monthKey = `${year}-${String(month).padStart(2, "0")}`;
                const monthName = date.toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                });
                return (
                  <option key={monthKey} value={monthKey}>
                    {monthName}
                  </option>
                );
              })}
            </select>

            <button
              type="button"
              onClick={toggleAdvancedDates}
              className="w-full px-3 py-2 text-xs text-blue-400 hover:text-blue-300 border border-blue-400 rounded hover:bg-blue-400/10 transition-colors"
            >
              Usar fechas específicas
            </button>
          </div>
        )}

        {/* Vista avanzada (fechas personalizadas) */}
        {showAdvancedDates && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <button
              type="button"
              onClick={toggleAdvancedDates}
              className="w-full px-3 py-2 text-xs text-blue-400 hover:text-blue-300 border border-blue-400 rounded hover:bg-blue-400/10 transition-colors"
            >
              Volver a selección por mes
            </button>
          </div>
        )}
      </div>

      {/* Búsqueda en notas */}
      <div className="mb-4">
        <label
          htmlFor="filter-text"
          className="block text-xs text-gray-400 mb-1"
        >
          Buscar en notas
        </label>
        <input
          id="filter-text"
          type="text"
          placeholder="Ej: compra semanal, cena con amigos, viaje..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
        />
      </div>

      {/* Métodos de pago como badges */}
      <div className="mb-4">
        <div className="mb-2">
          <label className="block text-xs text-gray-400">Método de Pago</label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterMethod("all")}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              filterMethod === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setFilterMethod("cash")}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              filterMethod === "cash"
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            💵 Contado
          </button>
          <button
            type="button"
            onClick={() => setFilterMethod("card")}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              filterMethod === "card"
                ? "bg-orange-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            💳 Tarjeta
          </button>
        </div>
      </div>

      {/* Categorías como badges */}
      <div className="mb-4">
        <div className="mb-2">
          <label className="block text-xs text-gray-400">Categoría</label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterCategoryId("")}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              filterCategoryId === ""
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Todas
          </button>
          {categories
            .filter((c) => !c.isLegacy)
            .map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setFilterCategoryId(c.id.toString());
                  setFilterSubcategoryId("");
                }}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterCategoryId === c.id.toString()
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {c.icon} {c.name}
              </button>
            ))}
        </div>
      </div>

      {/* Subcategorías como badges (solo si hay categoría seleccionada) */}
      {filterCategoryId && (
        <div className="mb-4">
          <div className="mb-2">
            <label className="block text-xs text-gray-400">Subcategoría</label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilterSubcategoryId("")}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                filterSubcategoryId === ""
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Todas
            </button>
            {categories
              .find((c) => c.id.toString() === filterCategoryId)
              ?.subcategories.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFilterSubcategoryId(s.id.toString())}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterSubcategoryId === s.id.toString()
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {s.icon} {s.name}
                </button>
              ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onClearFilters}
          className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-200"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
