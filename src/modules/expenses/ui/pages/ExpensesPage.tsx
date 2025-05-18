import React from "react";
import ExpenseRegistrationForm from "../components/organisms/ExpenseRegistrationForm";

const ExpensesPage: React.FC = () => (
  <div className="container mx-auto p-4 max-w-md">
    <h1 className="text-2xl font-bold mb-4 text-center text-white">
      Registrar Gasto
    </h1>
    <ExpenseRegistrationForm />
  </div>
);

export default ExpensesPage;
