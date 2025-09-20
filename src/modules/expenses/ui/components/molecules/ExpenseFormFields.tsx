import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Switch, Transition } from "@headlessui/react";
import { ExpenseFormData } from "@/expenses/domain/schemas/ExpenseSchema";
import { Category, Subcategory } from "@/expenses/domain/entities/Category";
import { CurrencyInput } from "@/common/components/atoms/currency-input";
import MobileDropdown from "./MobileDropdown";
import { useTranslation } from "@/common/hooks/useTranslation";

export const AmountField: React.FC<{
  control: Control<ExpenseFormData>;
  errors: FieldErrors<ExpenseFormData>;
}> = ({ control, errors }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700">
      <div className="text-center">
        <label htmlFor="amount" className="text-gray-400 text-sm block mb-2">
          💰 {t("amount")}
        </label>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <CurrencyInput
              id="amount"
              value={field.value || ""}
              onChange={(value) => {
                if (value === "") {
                  field.onChange("");
                } else {
                  field.onChange(String(value as number));
                }
              }}
              placeholder="0"
              className="w-full text-5xl p-4 bg-transparent text-white text-center border-none outline-none shadow-none ring-0 focus-visible:ring-0 focus-visible:border-none"
              showCurrencySymbol={false}
            />
          )}
        />
        {errors.amount && (
          <p className="text-red-400 text-sm mt-2">{errors.amount.message}</p>
        )}
      </div>
    </div>
  );
};

export const PaymentMethodField: React.FC<{
  control: Control<ExpenseFormData>;
  errors: FieldErrors<ExpenseFormData>;
}> = ({ control, errors }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700">
      <div className="flex items-center justify-between">
        <span className="text-white font-medium">{t("paymentMethod")}</span>
        <div className="flex items-center space-x-4">
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
                  {t("cash")}
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
                  <span className="sr-only">{t("paymentMethod")}</span>
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
                  {t("card")}
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
  );
};

export const CategoryField: React.FC<{
  control: Control<ExpenseFormData>;
  errors: FieldErrors<ExpenseFormData>;
  setValue: (name: keyof ExpenseFormData, value: string) => void;
  categories: Category[];
}> = ({ control, errors, setValue, categories }) => {
  const { t, tCategory } = useTranslation();

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700">
      <h3 className="text-white font-semibold mb-4">{t("category")}</h3>
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <MobileDropdown
            value={field.value || ""}
            onChange={(value) => {
              field.onChange(value || "");
              setValue("subcategoryId", "");
            }}
            placeholder={t("selectCategory")}
            options={categories.filter(
              (c) => !c.isLegacy || c.id.toString() === (field.value || "")
            )}
            renderSelected={(category: Category) => (
              <>
                <span className="text-xl mr-3">{category.icon}</span>
                <span className="block truncate text-white font-medium">
                  {tCategory(category.name)}
                </span>
              </>
            )}
            renderOption={(category: Category, isSelected: boolean) => (
              <div className="flex items-center">
                <span className="text-xl mr-3">{category.icon}</span>
                <span
                  className={`block truncate ${
                    isSelected ? "font-medium" : "font-normal"
                  }`}
                >
                  {tCategory(category.name)}
                </span>
              </div>
            )}
          />
        )}
      />
      {errors.categoryId && (
        <p className="text-red-400 text-sm mt-2">{errors.categoryId.message}</p>
      )}
    </div>
  );
};

export const SubcategoryField: React.FC<{
  control: Control<ExpenseFormData>;
  errors: FieldErrors<ExpenseFormData>;
  setValue: (name: keyof ExpenseFormData, value: string) => void;
  selectedCategory: Category | null;
  showSubcategories: boolean;
}> = ({ control, errors, setValue, selectedCategory, showSubcategories }) => {
  const { t, tCategory } = useTranslation();

  return (
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
            {t("subcategory")}{" "}
            {selectedCategory ? tCategory(selectedCategory.name) : ""}
          </h3>
          <button
            type="button"
            onClick={() => setValue("subcategoryId", "")}
            className="text-gray-400 hover:text-white p-1 rounded touch-manipulation"
          >
            ✕
          </button>
        </div>
        <Controller
          name="subcategoryId"
          control={control}
          render={({ field }) => (
            <MobileDropdown
              value={field.value || ""}
              onChange={(value) => field.onChange(value || "")}
              placeholder={t("selectSubcategoryOptional")}
              options={(selectedCategory?.subcategories || []).filter(
                () => true
              )}
              renderSelected={(subcategory: Subcategory) => (
                <>
                  <span className="text-lg mr-3">{subcategory.icon}</span>
                  <span className="block truncate text-white font-medium">
                    {tCategory(subcategory.name)}
                  </span>
                </>
              )}
              renderOption={(subcategory: Subcategory, isSelected: boolean) => (
                <div className="flex items-center">
                  <span className="text-lg mr-3">{subcategory.icon}</span>
                  <span
                    className={`block truncate ${
                      isSelected ? "font-medium" : "font-normal"
                    }`}
                  >
                    {tCategory(subcategory.name)}
                  </span>
                </div>
              )}
            />
          )}
        />
        {errors.subcategoryId && (
          <p className="text-red-400 text-sm mt-2">
            {errors.subcategoryId.message}
          </p>
        )}
      </div>
    </Transition>
  );
};

export const DateField: React.FC<{
  control: Control<ExpenseFormData>;
  errors: FieldErrors<ExpenseFormData>;
  mode: "create" | "edit";
}> = ({ control, errors }) => {
  const { t, language } = useTranslation();

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700">
      <h3 className="text-white font-semibold mb-4">📅 {t("expenseDate")}</h3>
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type="date"
            className="w-full p-3 text-white bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            lang={language === "en" ? "en-US" : "es-ES"}
          />
        )}
      />
      {errors.date && (
        <p className="text-red-400 text-sm mt-2">{errors.date.message}</p>
      )}
    </div>
  );
};

export const NoteField: React.FC<{
  control: Control<ExpenseFormData>;
  errors: FieldErrors<ExpenseFormData>;
}> = ({ control, errors }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700">
      <h3 className="text-white font-semibold mb-4">📝 {t("note")}</h3>
      <Controller
        name="note"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
            placeholder={t("addNotePlaceholder")}
          />
        )}
      />
      {errors.note && (
        <p className="text-red-400 text-sm mt-2">{errors.note.message}</p>
      )}
    </div>
  );
};

export const SummaryField: React.FC<{
  watch: (name: keyof ExpenseFormData) => string | boolean;
  selectedCategory: Category | null;
  selectedSubcategory: Subcategory | null;
  mode?: "create" | "edit";
}> = ({ watch, selectedCategory, selectedSubcategory, mode = "create" }) => {
  const { t, tCategory, formatDate } = useTranslation();
  const hasData = watch("amount") || selectedCategory || selectedSubcategory;

  if (!hasData) return null;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700 border-l-4 border-l-green-500">
      <h3 className="text-white font-semibold mb-3">{t("summary")}</h3>
      <div className="space-y-2 text-sm">
        {selectedCategory && (
          <div className="flex justify-between">
            <span className="text-gray-400">{t("category")}:</span>
            <div className="flex items-center space-x-2">
              <span>{selectedCategory.icon}</span>
              <span className="text-white">
                {tCategory(selectedCategory.name)}
              </span>
            </div>
          </div>
        )}
        {selectedSubcategory && (
          <div className="flex justify-between">
            <span className="text-gray-400">{t("subcategory")}:</span>
            <div className="flex items-center space-x-2">
              <span>{selectedSubcategory.icon}</span>
              <span className="text-white">
                {tCategory(selectedSubcategory.name)}
              </span>
            </div>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-400">{t("paymentMethodLabel")}</span>
          <span
            className={`font-semibold ${
              watch("isCardPayment") ? "text-orange-400" : "text-green-400"
            }`}
          >
            {watch("isCardPayment") ? `💳 ${t("card")}` : `💵 ${t("cash")}`}
          </span>
        </div>
        {mode === "edit" && watch("date") && (
          <div className="flex justify-between">
            <span className="text-gray-400">{t("dateLabel")}</span>
            <span className="text-white">
              {formatDate(watch("date") as string)}
            </span>
          </div>
        )}
        {watch("note") && (
          <div className="flex justify-between">
            <span className="text-gray-400">{t("noteLabel")}</span>
            <span className="text-white text-right max-w-48 truncate">
              {watch("note")}
            </span>
          </div>
        )}
        {watch("amount") && (
          <div className="flex justify-between border-t border-gray-600 pt-2 mt-2">
            <span className="text-gray-400">{t("amountLabel")}</span>
            <span className="text-white font-bold text-lg">
              ${watch("amount")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
