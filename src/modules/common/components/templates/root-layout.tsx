import { Link, Outlet, useLocation } from "react-router-dom";

import ErrorBoundary from "../molecules/error-boundary";
import { HOME } from "@/common/consts/pages-urls";

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
  const search = location.search;
  const isHome = currentPath === HOME;
  const isFilterMode =
    isHome && new URLSearchParams(search).get("filters") === "1";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg">
      <div className="flex justify-around items-center h-16">
        <NavLink to={HOME} isActive={isHome && !isFilterMode}>
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
          <span>Gastos</span>
        </NavLink>

        <NavLink to={`${HOME}?filters=1`} isActive={isFilterMode}>
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 12.414V20a1 1 0 01-1.447.894l-4-2A1 1 0 018 18v-5.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          <span>Filtrar</span>
        </NavLink>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ to, isActive, children }) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
        isActive
          ? "text-blue-400 bg-gray-700"
          : "text-gray-400 hover:text-white hover:bg-gray-700"
      }`}
    >
      {children}
    </Link>
  );
};
