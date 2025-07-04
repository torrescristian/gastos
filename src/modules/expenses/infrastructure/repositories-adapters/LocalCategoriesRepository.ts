import { CategoriesRepository } from "@/expenses/domain/repositories/CategoriesRepository";
import { Category } from "@/expenses/domain/entities/Category";

export default class LocalCategoriesRepository implements CategoriesRepository {
  async getAll(): Promise<Category[]> {
    return categories;
  }
}
const categories: Category[] = [
  {
    id: "1",
    name: "Deudas Fijas", // Renombrado para mejor organización
    icon: "📅",
    subcategories: [
      { id: "1", name: "Alquiler", icon: "🏠" },
      { id: "2", name: "Préstamos", icon: "💸" },
      { id: "3", name: "Tarjeta (pagos)", icon: "💳" },
      // Nuevo: Mantenimiento general del hogar
    ],
  },
  {
    id: "2",
    name: "Servicios",
    icon: "💡",
    subcategories: [
      { id: "4", name: "Luz", icon: "💡" },
      { id: "5", name: "Agua", icon: "🚰" },
      { id: "6", name: "Gas", icon: "🔥" },
      { id: "7", name: "Internet", icon: "🌐" },
      { id: "8", name: "Celular", icon: "📱" },
    ],
  },
  {
    id: "3",
    name: "Comida e Higiene",
    icon: "🍔",
    subcategories: [
      { id: "9", name: "Supermercado", icon: "🛒" },
      { id: "10", name: "Higiene & Limpieza", icon: "🧼" },
      { id: "11", name: "Gustos", icon: "🍕🍭☕️" },
    ],
  },
  {
    id: "4",
    name: "Transporte",
    icon: "🚗",
    subcategories: [
      { id: "12", name: "Nafta", icon: "⛽" },
      { id: "13", name: "Mantenimiento", icon: "🔧" },
      { id: "14", name: "Taxi", icon: "🚕" },
      { id: "4.1", name: "Estacionamiento", icon: "🅿️" },
    ],
  },
  {
    id: "5",
    name: "Salud",
    icon: "🩺",
    subcategories: [
      { id: "15", name: "Medicamentos", icon: "💊" },
      { id: "16", name: "Consultas", icon: "👨‍⚕️" },
      { id: "17", name: "Seguro", icon: "🛡️" },
      { id: "5.1", name: "Terapias", icon: "💆‍♂️" },
    ],
  },
  {
    id: "6",
    name: "Gastos Profesionales",
    icon: "💼",
    subcategories: [
      { id: "18", name: "Materiales", icon: "📦" },
      { id: "19", name: "Herramientas", icon: "🛠️" },
      { id: "20", name: "Cursos", icon: "🎓" },
    ],
  },
  {
    id: "7",
    name: "Familia & Hogar",
    icon: "🏠",
    subcategories: [
      { id: "21", name: "Educación", icon: "📚" },
      { id: "22", name: "Ocio", icon: "🎲" },
      { id: "23", name: "Juguetes", icon: "🧸" },
      // Nuevo: Ropa integrada en Familia
      { id: "7.1", name: "Ropa", icon: "👕" },
      { id: "7.2", name: "Mantenimiento Hogar", icon: "🔧" },
      { id: "7.3", name: "Peluquería", icon: "✂️" },
      { id: "7.4", name: "Cuidado Personal", icon: "💄" },
    ],
  },
  // NUEVA CATEGORÍA (ID 8)
  {
    id: "8",
    name: "Electrodomésticos",
    icon: "📺",
    subcategories: [
      { id: "8.1", name: "Compras", icon: "🛒" },
      { id: "8.2", name: "Reparaciones & Mantenimiento", icon: "🔧" },
    ],
  },
];
