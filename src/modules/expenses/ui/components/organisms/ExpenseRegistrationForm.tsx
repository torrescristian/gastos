import React, { useState, useEffect, useRef } from "react";
import { Switch, Transition, Dialog } from "@headlessui/react";

import { Category, Subcategory } from "@/expenses/domain/entities/Category";
import { useCategoriesQuery } from "@/expenses/infrastructure/react-adapters/useCategoriesQuery";

import NumericKeyboardModal from "../molecules/NumericKeyboardModal";

const ExpenseRegistrationForm: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [isCardPayment, setIsCardPayment] = useState<boolean>(false);
  const [showSubcategories, setShowSubcategories] = useState<boolean>(false);
  const [showNumericKeyboard, setShowNumericKeyboard] =
    useState<boolean>(false);
  const subcategoryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Usar react-query para obtener las categorías
  const { data: categories = [], isLoading } = useCategoriesQuery();

  useEffect(() => {
    if (selectedCategory && selectedCategory.subcategories.length > 0) {
      setShowSubcategories(true);

      // Set timer for 3 seconds
      subcategoryTimerRef.current = setTimeout(() => {
        setShowSubcategories(false);
      }, 3000);
    } else {
      setShowSubcategories(false);
    }

    return () => {
      if (subcategoryTimerRef.current) {
        clearTimeout(subcategoryTimerRef.current);
      }
    };
  }, [selectedCategory]);

  const handleCategorySelect = (category: Category) => {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(category);
      setSelectedSubcategory(null);
    }
  };

  const handleSubcategorySelect = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setShowSubcategories(false);
    if (subcategoryTimerRef.current) {
      clearTimeout(subcategoryTimerRef.current);
    }
  };

  const handleSaveExpense = () => {
    if (!amount || !selectedCategory) return;

    const expenseData = {
      amount: parseFloat(amount),
      categoryId: selectedCategory.id,
      subcategoryId: selectedSubcategory?.id,
      isCardPayment,
      date: new Date(),
    };

    console.log("Saving expense:", expenseData);
    // TODO: Implement actual save logic with your domain services

    // Reset form
    setAmount("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setIsCardPayment(false);
  };

  if (isLoading) {
    return <div className="text-center text-white">Cargando categorías...</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4">
      {/* Amount and Payment Method Row */}
      <div className="flex items-center mb-6">
        <div className="flex-grow mr-4">
          <input
            type="text"
            className="w-full text-4xl p-3 bg-gray-700 text-white rounded-lg text-right"
            placeholder="0.00"
            value={amount}
            readOnly
            onClick={() => setShowNumericKeyboard(true)}
          />
        </div>

        <div className="flex flex-col items-center">
          <label className="text-white text-xs mb-1">Tarjeta</label>
          <Switch
            checked={isCardPayment}
            onChange={setIsCardPayment}
            className={`${
              isCardPayment ? "bg-green-500" : "bg-red-500"
            } relative inline-flex h-8 w-14 items-center rounded-full`}
          >
            <span className="sr-only">Método de pago</span>
            <span
              className={`${
                isCardPayment ? "translate-x-7" : "translate-x-1"
              } inline-block h-6 w-6 rounded-full bg-white transition-transform`}
            >
              {isCardPayment ? "✅" : "❌"}
            </span>
          </Switch>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {categories.slice(0, 6).map((category: Category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category)}
            className={`p-4 rounded-lg flex flex-col items-center justify-center ${
              selectedCategory?.id === category.id
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            <span className="text-3xl mb-2">{category.icon}</span>
            <span className="text-sm">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Subcategories Panel (Conditional) */}
      <Transition
        show={showSubcategories && !!selectedCategory?.subcategories.length}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="bg-gray-700 p-3 rounded-lg mb-6">
          <h3 className="text-white text-sm mb-2">
            Subcategoría para {selectedCategory?.name}:
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {selectedCategory?.subcategories.map((subcat) => (
              <button
                key={subcat.id}
                onClick={() => handleSubcategorySelect(subcat)}
                className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded text-sm"
              >
                {subcat.name}
              </button>
            ))}
          </div>
        </div>
      </Transition>

      {/* Save Button */}
      <button
        onClick={handleSaveExpense}
        disabled={!amount || !selectedCategory}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
      >
        Registrar Gasto
      </button>

      {/* Numeric Keyboard Modal */}
      <Dialog
        open={showNumericKeyboard}
        onClose={() => setShowNumericKeyboard(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-800 rounded-lg p-4 w-full max-w-sm">
            <NumericKeyboardModal
              value={amount}
              onChange={setAmount}
              onConfirm={() => setShowNumericKeyboard(false)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ExpenseRegistrationForm;
