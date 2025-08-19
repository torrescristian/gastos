import React from "react";
import { Link } from "react-router-dom";
import { EXPENSES } from "@/common/consts/pages-urls";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  showAddButton?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showAddButton = true,
}) => {
  return (
    <>
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 mt-1">{subtitle}</p>
          </div>
        </div>
      </header>

      {/* Botón de acción flotante */}
      {showAddButton && (
        <Link
          to={EXPENSES}
          className="fixed bottom-20 right-4 bg-gradient-to-r from-blue-500 to-indigo-600 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </Link>
      )}
    </>
  );
};

export default PageHeader;
