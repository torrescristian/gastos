export const HOME = "/";
export const EXPENSES = "/gastos";
export const EXPENSES_EDIT = "/gastos/editar/:id";

// Helper function to generate edit expense URL
export const getExpenseEditUrl = (id: string) => `/gastos/editar/${id}`;
