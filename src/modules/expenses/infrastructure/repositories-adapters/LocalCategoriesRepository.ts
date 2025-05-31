import { CategoriesRepository } from "@/expenses/domain/repositories/CategoriesRepository";
import { Category } from "@/expenses/domain/entities/Category";

const categories: Category[] = [
  {
    id: "1",
    name: "Deudas Fijas",
    icon: "🏠",
    subcategories: [
      { id: "1", name: "Alquiler", icon: "🏠" },
      { id: "2", name: "Préstamos", icon: "💸" },
      { id: "3", name: "Tarjeta (pagos)", icon: "💳" },
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
    name: "Supermercado",
    icon: "🛒",
    subcategories: [
      { id: "9", name: "Comida", icon: "🍞" },
      { id: "10", name: "Limpieza", icon: "🧼" },
      { id: "11", name: "Extras (golosinas)", icon: "🍬" },
    ],
  },
  {
    id: "4",
    name: "Transporte",
    icon: "🛢️",
    subcategories: [
      { id: "12", name: "Nafta", icon: "⛽" },
      { id: "13", name: "Mantenimiento", icon: "🔧" },
      { id: "14", name: "Sube", icon: "🚍" },
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
    name: "Familia",
    icon: "👩‍👧‍👦",
    subcategories: [
      { id: "21", name: "Educación", icon: "📚" },
      { id: "22", name: "Ocio", icon: "🎲" },
      { id: "23", name: "Juguetes", icon: "🧸" },
    ],
  },
];

export default class LocalCategoriesRepository implements CategoriesRepository {
  async getAll(): Promise<Category[]> {
    return categories;
  }
}
