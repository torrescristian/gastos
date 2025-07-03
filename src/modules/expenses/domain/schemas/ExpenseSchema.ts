import { z } from "zod";

export const ExpenseSchema = z.object({
  amount: z
    .number({
      required_error: "El monto es obligatorio",
      invalid_type_error: "El monto debe ser un número válido",
    })
    .positive("El monto debe ser mayor a 0")
    .max(999999999, "El monto es demasiado grande"),

  categoryId: z
    .string({
      required_error: "La categoría es obligatoria",
      invalid_type_error: "Debe seleccionar una categoría válida",
    })
    .min(1, "La categoría es obligatoria"),

  subcategoryId: z.string().min(1, "La subcategoría es obligatoria"),

  isCardPayment: z.boolean({
    required_error: "El método de pago es obligatorio",
    invalid_type_error: "Método de pago debe ser verdadero o falso",
  }),

  note: z
    .string()
    .max(500, "La nota no puede exceder 500 caracteres")
    .optional()
    .nullable(),

  date: z
    .date({
      required_error: "La fecha es obligatoria",
      invalid_type_error: "Fecha inválida",
    })
    .refine((date) => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours buffer
      return date <= tomorrow;
    }, "La fecha no puede ser futura"),
});

// Esquema para el formulario (con string para amount y date)
export const ExpenseFormSchema = z.object({
  amount: z
    .string({
      required_error: "El monto es obligatorio",
    })
    .min(1, "El monto es obligatorio")
    .regex(/^\d+(\.\d{1,2})?$/, "Formato de monto inválido")
    .refine((val) => parseFloat(val) > 0, "El monto debe ser mayor a 0")
    .refine(
      (val) => parseFloat(val) <= 999999999,
      "El monto es demasiado grande"
    ),

  categoryId: z
    .string({
      required_error: "La categoría es obligatoria",
      invalid_type_error: "Debe seleccionar una categoría válida",
    })
    .min(1, "Debe seleccionar una categoría"),

  subcategoryId: z.string().optional(),

  isCardPayment: z.boolean({
    required_error: "El método de pago es obligatorio",
    invalid_type_error: "Método de pago debe ser verdadero o falso",
  }),

  note: z
    .string()
    .max(500, "La nota no puede exceder 500 caracteres")
    .optional(),

  date: z
    .string({
      required_error: "La fecha es obligatoria",
    })
    .min(1, "La fecha es obligatoria")
    .refine((dateStr) => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, "Fecha inválida")
    .refine((dateStr) => {
      const date = new Date(dateStr);
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      return date <= tomorrow;
    }, "La fecha no puede ser futura"),
});

export type ExpenseFormData = z.infer<typeof ExpenseFormSchema>;
export type ExpenseData = z.infer<typeof ExpenseSchema>;
