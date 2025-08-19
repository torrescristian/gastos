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
  const handleSelectAllCategories = () => {
    setFilterCategoryId("");
    setFilterSubcategoryId("");
  };

  const handleSelectAllSubcategories = () => {
    setFilterSubcategoryId("");
  };

  const handleSelectAllPaymentMethods = () => {
    setFilterMethod("all");
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-6">
      <h3 className="text-white font-semibold mb-3">Filtros</h3>

      {/* Fechas en la misma fila */}
      <div className="grid grid-cols-2 gap-3 mb-4">
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

      {/* Texto de búsqueda */}
      <div className="mb-4">
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

      {/* Métodos de pago como badges */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs text-gray-400">Método de Pago</label>
          <button
            type="button"
            onClick={handleSelectAllPaymentMethods}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Seleccionar todos
          </button>
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
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs text-gray-400">Categoría</label>
          <button
            type="button"
            onClick={handleSelectAllCategories}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Seleccionar todas
          </button>
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs text-gray-400">Subcategoría</label>
            <button
              type="button"
              onClick={handleSelectAllSubcategories}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Seleccionar todas
            </button>
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
