import React from "react";

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

const ExpenseRegistrationForm: React.FC = () => {
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
    mode: "create",
  });

  // Loading state
  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p>Cargando categorías...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (categoriesError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-white">
          <div className="text-red-400 text-2xl mb-2">⚠️</div>
          <p>Error al cargar categorías</p>
          <p className="text-sm text-gray-400 mt-1">
            {categoriesError instanceof Error
              ? categoriesError.message
              : "Error desconocido"}
          </p>
        </div>
      </div>
    );
  }

  // No categories state
  if (!categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-white">
          <div className="text-yellow-400 text-2xl mb-2">📂</div>
          <p>No hay categorías disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
        <DateField control={control} errors={errors} mode="create" />

        {/* Note Field */}
        <NoteField control={control} errors={errors} />

        {/* Summary Field */}
        <SummaryField
          watch={watch}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          mode="create"
        />

        {/* Save Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Registrando...</span>
            </div>
          ) : (
            "Registrar Gasto"
          )}
        </button>
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

export default ExpenseRegistrationForm;
