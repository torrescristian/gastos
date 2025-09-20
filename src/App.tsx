import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ExpensesPage from "@/expenses/ui/pages/ExpensesPage.tsx";
import ExpenseEditPage from "@/expenses/ui/pages/ExpenseEditPage.tsx";
import RootLayout from "@/common/components/templates/root-layout.tsx";
import {
  EXPENSES,
  EXPENSES_EDIT,
  EXPENSES_FILTER,
  HOME,
} from "@/common/consts/pages-urls.ts";

import PWABadge from "./PWABadge.tsx";
import ExpensesListPage from "@/home/pages/ExpensesListPage.tsx";
import ExpensesFilterPage from "@/home/pages/ExpensesFilterPage.tsx";
import { LanguageProvider } from "@/common/contexts/language-context.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: HOME,
        element: <ExpensesListPage />,
      },
      {
        path: EXPENSES_FILTER,
        element: <ExpensesFilterPage />,
      },
      {
        path: EXPENSES,
        element: <ExpensesPage />,
      },
      {
        path: EXPENSES_EDIT,
        element: <ExpenseEditPage />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RouterProvider router={router} />
        <PWABadge />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
