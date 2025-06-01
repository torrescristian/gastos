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
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Volver</span>
          </Link>
        </div>
      </header>

      <ExpenseRegistrationForm />
    </div>
  );
};

export default ExpensesPage;
