import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { HOME } from "@/common/consts/pages-urls";

import { useCategoriesQuery } from "../../infrastructure/react-adapters/useCategoriesQuery";
import { useCreateExpenseMutation } from "../../infrastructure/react-adapters/useCreateExpenseMutation";
import { useUpdateExpenseMutation } from "../../infrastructure/react-adapters/useUpdateExpenseMutation";
import {
  ExpenseFormSchema,
  ExpenseFormData,
} from "../../domain/schemas/ExpenseSchema";
import { Expense } from "../../domain/entities/Expense";

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

interface UseExpenseFormProps {
  mode: "create" | "edit";
  initialData?: Expense;
  expenseId?: string;
  onSuccess?: () => void;
}

export const useExpenseForm = ({
  mode,
  initialData,
  expenseId,
  onSuccess,
}: UseExpenseFormProps) => {
  const navigate = useNavigate();

  // Form configuration
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      amount: initialData?.amount?.toString() || "",
      categoryId: initialData?.categoryId || "",
      subcategoryId: initialData?.subcategoryId || "",
      isCardPayment: initialData?.isCardPayment || false,
      note: initialData?.note || "",
      date: initialData?.date
        ? initialData.date.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  // Watch form fields
  const watchedCategoryId = watch("categoryId") || "";
  const watchedSubcategoryId = watch("subcategoryId") || "";

  // Queries and mutations
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategoriesQuery();
  const createExpenseMutation = useCreateExpenseMutation();
  const updateExpenseMutation = useUpdateExpenseMutation();

  // Toast state
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  // Derived state
  const selectedCategory =
    categories.find((cat) => cat.id.toString() === watchedCategoryId) || null;
  const selectedSubcategory =
    selectedCategory?.subcategories.find(
      (sub) => sub.id.toString() === watchedSubcategoryId
    ) || null;

  const showSubcategories = Boolean(
    selectedCategory && selectedCategory.subcategories.length > 0
  );

  // Effects
  useEffect(() => {
    // Reset form with initial data when it becomes available (for edit mode)
    if (mode === "edit" && initialData) {
      reset({
        amount: initialData.amount?.toString() || "",
        categoryId: initialData.categoryId || "",
        subcategoryId: initialData.subcategoryId || "",
        isCardPayment: initialData.isCardPayment || false,
        note: initialData.note || "",
        date: initialData.date
          ? initialData.date.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [mode, initialData, reset]);

  useEffect(() => {
    // Clear subcategory when category changes
    if (watchedCategoryId && selectedCategory?.subcategories.length === 0) {
      setValue("subcategoryId", "");
    }
    if (!watchedCategoryId) {
      setValue("subcategoryId", "");
    }
  }, [watchedCategoryId, selectedCategory, setValue]);

  useEffect(() => {
    // Hide toast after 3 seconds
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((currentToast) => ({ ...currentToast, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Form submission
  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const expenseData = {
        amount: parseFloat(data.amount),
        categoryId: data.categoryId,
        subcategoryId:
          data.subcategoryId && data.subcategoryId.trim() !== ""
            ? data.subcategoryId
            : "",
        isCardPayment: data.isCardPayment,
        note: data.note && data.note.trim() !== "" ? data.note : undefined,
        date: new Date(data.date),
      };

      if (mode === "create") {
        await createExpenseMutation.mutateAsync(expenseData);

        // Reset form on success
        reset({
          amount: "",
          categoryId: "",
          subcategoryId: "",
          isCardPayment: false,
          note: "",
          date: new Date().toISOString().split("T")[0],
        });

        setToast({
          show: true,
          message: "¡Gasto registrado exitosamente!",
          type: "success",
        });
      } else {
        if (!expenseId) {
          throw new Error("ID del gasto requerido para editar");
        }

        await updateExpenseMutation.mutateAsync({ id: expenseId, expenseData });

        setToast({
          show: true,
          message: "¡Gasto actualizado exitosamente!",
          type: "success",
        });
      }

      // Handle success callback or default navigation
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          navigate(HOME);
        }, 1500);
      }
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} expense:`,
        error
      );

      setToast({
        show: true,
        message: `Error al ${
          mode === "create" ? "registrar" : "actualizar"
        } el gasto. Intenta nuevamente.`,
        type: "error",
      });
    }
  };

  // Show toast manually
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
  };

  return {
    // Form
    form,
    control,
    handleSubmit: handleSubmit(onSubmit),
    watch,
    reset,
    setValue,
    errors,
    isSubmitting:
      isSubmitting ||
      createExpenseMutation.isPending ||
      updateExpenseMutation.isPending,

    // Categories
    categories,
    categoriesLoading,
    categoriesError,
    selectedCategory,
    selectedSubcategory,
    showSubcategories,

    // Toast
    toast,
    showToast,

    // Mode
    mode,
  };
};
