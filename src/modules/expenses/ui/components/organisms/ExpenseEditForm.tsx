import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useExpenseQuery } from "@/expenses/infrastructure/react-adapters/useExpenseQuery";
import { useExpenseForm } from "@/expenses/ui/hooks/useExpenseForm";
import {
  AmountField,
  PaymentMethodField,
  CategoryField,
  SubcategoryField,
  DateField,
  NoteField,
  SummaryField,
} from "@/expenses/ui/components/molecules/ExpenseFormFields";
import { HOME } from "@/common/consts/pages-urls";

const ExpenseEditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch the expense data
  const {
    data: expense,
    isLoading: expenseLoading,
    error: expenseError,
  } = useExpenseQuery(id || "");

  // Use the shared hook for form logic
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    errors,
    isSubmitting,
    categories,
    categoriesLoading,
    categoriesError,
    selectedCategory,
    selectedSubcategory,
    showSubcategories,
    toast,
  } = useExpenseForm({
    mode: "edit",
    initialData: expense || undefined,
    expenseId: id,
  });

  // Loading state
  if (expenseLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (expenseError || categoriesError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-white">
          <div className="text-red-400 text-2xl mb-2">⚠️</div>
          <p>Error al cargar los datos</p>
          <p className="text-sm text-gray-400 mt-1">
            {expenseError instanceof Error
              ? expenseError.message
              : "Error desconocido"}
          </p>
          <button
            onClick={() => navigate(HOME)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Expense not found
  if (!expense) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-white">
          <div className="text-yellow-400 text-2xl mb-2">📂</div>
          <p>Gasto no encontrado</p>
          <button
            onClick={() => navigate(HOME)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // No categories available
  if (!categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-white">
          <div className="text-yellow-400 text-2xl mb-2">📂</div>
          <p>No hay categorías disponibles</p>
          <button
            onClick={() => navigate(HOME)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Editar Gasto</h1>
          <button
            onClick={() => navigate(HOME)}
            className="text-gray-400 hover:text-white p-2 rounded"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Modifica los detalles de tu gasto
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Field */}
        <AmountField control={control} errors={errors} />

        {/* Payment Method Field */}
        <PaymentMethodField control={control} errors={errors} />

        {/* Category Field */}
        <CategoryField
          control={control}
          errors={errors}
          setValue={setValue}
          categories={categories}
        />

        {/* Subcategory Field */}
        <SubcategoryField
          control={control}
          errors={errors}
          setValue={setValue}
          selectedCategory={selectedCategory}
          showSubcategories={showSubcategories}
        />

        {/* Date Field */}
        <DateField control={control} errors={errors} mode="edit" />

        {/* Note Field */}
        <NoteField control={control} errors={errors} />

        {/* Summary Field */}
        <SummaryField
          watch={watch}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          mode="edit"
        />

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Actualizando...</span>
              </div>
            ) : (
              "Actualizar Gasto"
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(HOME)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2 ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
};

export default ExpenseEditForm;
