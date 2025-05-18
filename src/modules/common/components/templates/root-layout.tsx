import { Link, Outlet, useLocation } from "react-router-dom";

import ErrorBoundary from "../molecules/error-boundary";
import { EXPENSES, HOME } from "@/common/consts/pages-urls";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white pb-16">
        <main className="flex-1">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </ErrorBoundary>
  );
}

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg">
      <div className="flex justify-around items-center h-16">
        <NavLink to={HOME} isActive={currentPath === HOME}>
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>Inicio</span>
        </NavLink>

        <NavLink to={EXPENSES} isActive={currentPath === EXPENSES}>
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Gastos</span>
        </NavLink>
      </div>
    </nav>
  );
};

// Componente auxiliar para los enlaces de navegación
const NavLink = ({
  to,
  children,
  isActive,
}: {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
}) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center w-full py-1 transition-colors duration-200 ${
        isActive ? "text-blue-400" : "text-gray-400 hover:text-gray-200"
      }`}
    >
      {children}
    </Link>
  );
};
