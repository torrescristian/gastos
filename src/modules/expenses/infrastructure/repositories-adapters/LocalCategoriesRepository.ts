import { CategoriesRepository } from "@/expenses/domain/repositories/CategoriesRepository";
import { Category } from "@/expenses/domain/entities/Category";

export default class LocalCategoriesRepository implements CategoriesRepository {
  async getAll(): Promise<Category[]> {
    return [...newCategories, ...legacyCategories];
  }
}
// New taxonomy
const newCategories: Category[] = [
  {
    id: "compras",
    name: "Compras",
    icon: "🛍️",
    subcategories: [
      { id: "compras.supermercado", name: "Supermercado", icon: "🛒" },
      { id: "compras.ropa", name: "Ropa", icon: "👕" },
      { id: "compras.gustos", name: "Gustos", icon: "🍫" },
      { id: "compras.electro", name: "Electrónica/Electro", icon: "📺" },
      { id: "compras.juguetes", name: "Entretenimiento/Juguetes", icon: "🎲" },
      { id: "compras.hogar", name: "Hogar", icon: "🏠" },
      { id: "compras.mascotas", name: "Mascotas", icon: "🐾" },
      { id: "compras.regalos", name: "Regalos/Donaciones", icon: "🎁" },
      { id: "compras.otros", name: "Otros", icon: "💰" },
    ],
  },
  {
    id: "servicios",
    name: "Servicios y suscripciones",
    icon: "🔁",
    subcategories: [
      { id: "servicios.luz", name: "Luz", icon: "💡" },
      { id: "servicios.agua", name: "Agua", icon: "🚰" },
      { id: "servicios.gas", name: "Gas", icon: "🔥" },
      { id: "servicios.internet", name: "Internet", icon: "🌐" },
      { id: "servicios.celular", name: "Celular", icon: "📱" },
      { id: "servicios.streaming", name: "Streaming", icon: "📺" },
      { id: "servicios.software", name: "Software", icon: "💻" },
      { id: "servicios.gimnasio", name: "Gimnasio", icon: "🏋️" },
      { id: "servicios.seguros", name: "Seguros", icon: "🛡️" },
      { id: "servicios.educacion", name: "Educación", icon: "📚" },
      { id: "servicios.profesional", name: "Profesional/Trabajo", icon: "💼" },
      { id: "servicios.otros", name: "Otros", icon: "💰" },
    ],
  },
  {
    id: "mantenimiento",
    name: "Mantenimiento",
    icon: "🛠️",
    subcategories: [
      { id: "mantenimiento.vehiculo", name: "Vehículo", icon: "🚗" },
      { id: "mantenimiento.hogar", name: "Hogar", icon: "🏠" },
      { id: "mantenimiento.electro", name: "Electrodomésticos", icon: "🔧" },
      { id: "mantenimiento.personal", name: "Personal", icon: "✂️" },
      { id: "mantenimiento.otros", name: "Otros", icon: "💰" },
    ],
  },
  {
    id: "movilidad",
    name: "Movilidad",
    icon: "🚗",
    subcategories: [
      { id: "movilidad.combustible", name: "Combustible", icon: "⛽" },
      { id: "movilidad.taxi", name: "Taxi/App", icon: "🚕" },
      { id: "movilidad.publico", name: "Transporte público", icon: "🚌" },
      {
        id: "movilidad.estacionamiento",
        name: "Estacionamiento/Peajes",
        icon: "🅿️",
      },
      { id: "movilidad.otros", name: "Otros", icon: "💰" },
    ],
  },
  {
    id: "salud",
    name: "Salud y bienestar",
    icon: "🩺",
    subcategories: [
      { id: "salud.medicamentos", name: "Medicamentos", icon: "💊" },
      { id: "salud.consultas", name: "Consultas", icon: "👨‍⚕️" },
      { id: "salud.terapias", name: "Terapias", icon: "💆‍♂️" },
      { id: "salud.otros", name: "Otros", icon: "💰" },
    ],
  },
  {
    id: "finanzas",
    name: "Finanzas y obligaciones",
    icon: "🧾",
    subcategories: [
      { id: "finanzas.alquiler", name: "Alquiler/Hipoteca", icon: "🏠" },
      { id: "finanzas.prestamos", name: "Préstamos", icon: "💸" },
      { id: "finanzas.tarjeta", name: "Tarjeta (pago)", icon: "💳" },
      { id: "finanzas.impuestos", name: "Impuestos/Tasas", icon: "🧾" },
      { id: "finanzas.otros", name: "Otros", icon: "💰" },
    ],
  },
  {
    id: "profesional",
    name: "Profesional/Trabajo",
    icon: "💼",
    subcategories: [
      { id: "profesional.materiales", name: "Materiales", icon: "📦" },
      { id: "profesional.herramientas", name: "Herramientas", icon: "🛠️" },
      { id: "profesional.cursos", name: "Cursos", icon: "🎓" },
      { id: "profesional.otros", name: "Otros", icon: "💰" },
    ],
  },
  {
    id: "otros",
    name: "Otros",
    icon: "📦",
    subcategories: [],
  },
];

// Legacy categories preserved for data consistency but hidden from new selections
const legacyCategories: Category[] = [
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
    isLegacy: true,
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
    isLegacy: true,
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
    isLegacy: true,
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
    isLegacy: true,
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
    isLegacy: true,
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
    isLegacy: true,
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
    isLegacy: true,
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
    isLegacy: true,
  },
];
