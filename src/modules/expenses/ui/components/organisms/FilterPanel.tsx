import React from "react";
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
  return (
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
