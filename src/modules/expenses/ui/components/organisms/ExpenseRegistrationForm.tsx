import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Switch,
  Transition,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

import { useCategoriesQuery } from "@/expenses/infrastructure/react-adapters/useCategoriesQuery";
import { useCreateExpenseMutation } from "@/expenses/infrastructure/react-adapters/useCreateExpenseMutation";
import {
  ExpenseFormSchema,
  ExpenseFormData,
} from "@/expenses/domain/schemas/ExpenseSchema";

const ExpenseRegistrationForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      amount: "",
      categoryId: "",
      subcategoryId: "",
      isCardPayment: false,
      note: "",
    },
    mode: "onChange",
  });

  const watchedCategoryId = watch("categoryId") || "";
  const watchedSubcategoryId = watch("subcategoryId") || "";

  // Usar react-query para obtener las categorías
  const { data: categories = [], isLoading, error } = useCategoriesQuery();

  // Mutation para crear gastos
  const createExpenseMutation = useCreateExpenseMutation();

  // Encontrar la categoría seleccionada
  const selectedCategory =
    categories.find((cat) => cat.id.toString() === watchedCategoryId) || null;
  const selectedSubcategory =
    selectedCategory?.subcategories.find(
      (sub) => sub.id.toString() === watchedSubcategoryId
    ) || null;

  // Mostrar subcategorías si hay una categoría seleccionada con subcategorías
  const showSubcategories = Boolean(
    selectedCategory && selectedCategory.subcategories.length > 0
  );

  useEffect(() => {
    // Limpiar subcategoría cuando cambia la categoría
    if (watchedCategoryId && selectedCategory?.subcategories.length === 0) {
      setValue("subcategoryId", "");
    }
    // Si no hay categoría seleccionada, limpiar subcategoría también
    if (!watchedCategoryId) {
      setValue("subcategoryId", "");
    }
  }, [watchedCategoryId, selectedCategory, setValue]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const expenseData = {
        amount: parseFloat(data.amount),
        categoryId: data.categoryId,
        subcategoryId:
          data.subcategoryId && data.subcategoryId.trim() !== ""
            ? data.subcategoryId
            : undefined,
        isCardPayment: data.isCardPayment,
        note: data.note && data.note.trim() !== "" ? data.note : undefined,
        date: new Date(),
      };

      await createExpenseMutation.mutateAsync(expenseData);

      // Reset form on success
      reset({
        amount: "",
        categoryId: "",
        subcategoryId: "",
        isCardPayment: false,
        note: "",
      });

      // TODO: Show success message or redirect
      alert("¡Gasto registrado exitosamente!");
    } catch (error) {
      console.error("Error creating expense:", error);
      // TODO: Show error message
      alert("Error al registrar el gasto. Intenta nuevamente.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p>Cargando categorías...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-white">
          <div className="text-red-400 text-2xl mb-2">⚠️</div>
          <p>Error al cargar categorías</p>
          <p className="text-sm text-gray-400 mt-1">
            {error instanceof Error ? error.message : "Error desconocido"}
          </p>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-white">
          <div className="text-yellow-400 text-2xl mb-2">📂</div>
          <p>No hay categorías disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Amount Input Section */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700">
        <div className="text-center">
          <label className="text-gray-400 text-sm block mb-2">Monto</label>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                inputMode="decimal"
                step="0.01"
                className="w-full text-5xl p-4 bg-transparent text-white text-center border-none outline-none"
                placeholder="0"
              />
            )}
          />
          {errors.amount && (
            <p className="text-red-400 text-sm mt-2">{errors.amount.message}</p>
          )}
        </div>
      </div>

      {/* Payment Method Toggle */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">Método de Pago</span>
          </div>

          <div className="flex items-center space-x-3">
            <Controller
              name="isCardPayment"
              control={control}
              render={({ field }) => (
                <>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      !field.value ? "text-white" : "text-gray-400"
                    }`}
                  >
                    Contado
                  </span>
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    className={`${
                      field.value
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                        : "bg-gray-600"
                    } relative inline-flex h-7 w-12 items-center rounded-full transition-colors`}
                  >
                    <span className="sr-only">Método de pago</span>
                    <span
                      className={`${
                        field.value ? "translate-x-6" : "translate-x-1"
                      } inline-block h-5 w-5 rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      field.value ? "text-white" : "text-gray-400"
                    }`}
                  >
                    Tarjeta
                  </span>
                </>
              )}
            />
          </div>
        </div>
        {errors.isCardPayment && (
          <p className="text-red-400 text-sm mt-2">
            {errors.isCardPayment.message}
          </p>
        )}
      </div>

      {/* Categories Dropdown */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-4">Categoría</h3>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Listbox
              value={field.value || ""}
              onChange={(value) => {
                field.onChange(value || "");
                // Clear subcategory when category changes
                setValue("subcategoryId", "");
              }}
            >
              <div className="relative">
                <ListboxButton className="relative w-full cursor-default rounded-lg bg-gray-700 py-3 pl-4 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="flex items-center">
                    {selectedCategory ? (
                      <>
                        <span className="text-xl mr-3">
                          {selectedCategory.icon}
                        </span>
                        <span className="block truncate text-white font-medium">
                          {selectedCategory.name}
                        </span>
                      </>
                    ) : (
                      <span className="block truncate text-gray-400">
                        Selecciona una categoría
                      </span>
                    )}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </ListboxButton>
                <Transition
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {categories.map((category) => (
                      <ListboxOption
                        key={category.id}
                        className={({ selected }) =>
                          `relative cursor-default select-none py-3 pl-4 pr-10 ${
                            selected
                              ? "bg-gray-600 text-white"
                              : "text-gray-200"
                          }`
                        }
                        value={category.id.toString()}
                      >
                        {({ selected }) => (
                          <>
                            <div className="flex items-center">
                              <span className="text-xl mr-3">
                                {category.icon}
                              </span>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {category.name}
                              </span>
                            </div>
                            {selected ? (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-400">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Transition>
              </div>
            </Listbox>
          )}
        />
        {errors.categoryId && (
          <p className="text-red-400 text-sm mt-2">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Subcategories Dropdown */}
      <Transition
        show={showSubcategories}
        enter="transition-all duration-300 ease-out"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all duration-200 ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-2"
      >
        <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">
              Subcategoría de {selectedCategory?.name}
            </h3>
            <button
              type="button"
              onClick={() => setValue("subcategoryId", "")}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <Controller
            name="subcategoryId"
            control={control}
            render={({ field }) => (
              <Listbox
                value={field.value || ""}
                onChange={(value) => field.onChange(value || "")}
              >
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-default rounded-lg bg-gray-700 py-3 pl-4 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="flex items-center">
                      {selectedSubcategory ? (
                        <>
                          <span className="text-lg mr-3">
                            {selectedSubcategory.icon}
                          </span>
                          <span className="block truncate text-white font-medium">
                            {selectedSubcategory.name}
                          </span>
                        </>
                      ) : (
                        <span className="block truncate text-gray-400">
                          Selecciona una subcategoría (opcional)
                        </span>
                      )}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </ListboxButton>
                  <Transition
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {selectedCategory?.subcategories.map((subcategory) => (
                        <ListboxOption
                          key={subcategory.id}
                          className={({ selected }) =>
                            `relative cursor-default select-none py-3 pl-4 pr-10 ${
                              selected
                                ? "bg-gray-600 text-white"
                                : "text-gray-200"
                            }`
                          }
                          value={subcategory.id.toString()}
                        >
                          {({ selected }) => (
                            <>
                              <div className="flex items-center">
                                <span className="text-lg mr-3">
                                  {subcategory.icon}
                                </span>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {subcategory.name}
                                </span>
                              </div>
                              {selected ? (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-400">
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              </Listbox>
            )}
          />
          {errors.subcategoryId && (
            <p className="text-red-400 text-sm mt-2">
              {errors.subcategoryId.message}
            </p>
          )}
        </div>
      </Transition>

      {/* Note Field (Optional) */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700">
        <h3 className="text-white font-semibold mb-4">Nota (opcional)</h3>
        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
              rows={3}
              placeholder="Agregar una nota sobre este gasto..."
            />
          )}
        />
        {errors.note && (
          <p className="text-red-400 text-sm mt-2">{errors.note.message}</p>
        )}
      </div>

      {/* Selected Items Summary */}
      {(watch("amount") || selectedCategory || selectedSubcategory) && (
        <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700 border-l-4 border-l-green-500">
          <h3 className="text-white font-semibold mb-3">Resumen</h3>
          <div className="space-y-2 text-sm">
            {watch("amount") && (
              <div className="flex justify-between">
                <span className="text-gray-400">Monto:</span>
                <span className="text-white font-semibold">
                  ${watch("amount")}
                </span>
              </div>
            )}
            {selectedCategory && (
              <div className="flex justify-between">
                <span className="text-gray-400">Categoría:</span>
                <div className="flex items-center space-x-2">
                  <span>{selectedCategory.icon}</span>
                  <span className="text-white">{selectedCategory.name}</span>
                </div>
              </div>
            )}
            {selectedSubcategory && (
              <div className="flex justify-between">
                <span className="text-gray-400">Subcategoría:</span>
                <div className="flex items-center space-x-2">
                  <span>{selectedSubcategory.icon}</span>
                  <span className="text-white">{selectedSubcategory.name}</span>
                </div>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Método de pago:</span>
              <span
                className={`font-semibold ${
                  watch("isCardPayment") ? "text-orange-400" : "text-green-400"
                }`}
              >
                {watch("isCardPayment") ? "💳 Tarjeta" : "💵 Contado"}
              </span>
            </div>
            {watch("note") && (
              <div className="flex justify-between">
                <span className="text-gray-400">Nota:</span>
                <span className="text-white text-right max-w-48 truncate">
                  {watch("note")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        type="submit"
        disabled={isSubmitting || createExpenseMutation.isPending}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
      >
        {isSubmitting || createExpenseMutation.isPending ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Registrando...</span>
          </div>
        ) : (
          "Registrar Gasto"
        )}
      </button>
    </form>
  );
};

export default ExpenseRegistrationForm;
