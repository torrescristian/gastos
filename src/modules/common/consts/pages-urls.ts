export const HOME = "/";
export const EXPENSES = "/gastos";
export const EXPENSES_EDIT = "/gastos/editar/:id";
export const EXPENSES_FILTER = "/filtros";

// Helper function to generate edit expense URL
export const getExpenseEditUrl = (id: string) => `/gastos/editar/${id}`;
