import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ExpensesPage from "@/expenses/ui/pages/ExpensesPage.tsx";
import ExpenseEditPage from "@/expenses/ui/pages/ExpenseEditPage.tsx";
import RootLayout from "@/common/components/templates/root-layout.tsx";
import { EXPENSES, EXPENSES_EDIT, HOME } from "@/common/consts/pages-urls.ts";

import PWABadge from "./PWABadge.tsx";
import HomePage from "@/home/pages/HomePage.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: HOME,
        element: <HomePage />,
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
      <RouterProvider router={router} />
      <PWABadge />
    </QueryClientProvider>
  );
}

export default App;
