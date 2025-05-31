import React from "react";
import { Link } from "react-router-dom";
import ExpenseRegistrationForm from "../components/organisms/ExpenseRegistrationForm";
import { HOME } from "@/common/consts/pages-urls";

const ExpensesPage: React.FC = () => {
  return (
    <div className="px-4 py-6 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Registrar Gasto</h1>
            <p className="text-gray-400 mt-1">
              Añade un nuevo gasto a tu registro
            </p>
          </div>
          <Link
            to={HOME}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Volver
          </Link>
        </div>
      </header>

      <ExpenseRegistrationForm />
    </div>
  );
};

export default ExpensesPage;
