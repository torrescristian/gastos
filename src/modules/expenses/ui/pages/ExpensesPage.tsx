import React from "react";
import ExpenseRegistrationForm from "../components/organisms/ExpenseRegistrationForm";

const ExpensesPage: React.FC = () => (
  <div className="px-4 py-6 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
    {/* Header */}
    <header className="mb-6">
      <h1 className="text-3xl font-bold text-white">Registrar Gasto</h1>
      <p className="text-gray-400 mt-1">Añade un nuevo gasto a tu registro</p>
    </header>

    <ExpenseRegistrationForm />
  </div>
);

export default ExpensesPage;
