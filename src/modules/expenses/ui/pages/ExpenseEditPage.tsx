import React from "react";
import ExpenseEditForm from "@/expenses/ui/components/organisms/ExpenseEditForm";

const ExpenseEditPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 px-4 py-6">
      <div className="max-w-md mx-auto">
        <ExpenseEditForm />
      </div>
    </div>
  );
};

export default ExpenseEditPage;
