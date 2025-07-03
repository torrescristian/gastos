import React from "react";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";

type CurrencyInputProps = {
  value?: number | string;
  onChange: (value: number | "") => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showCurrencySymbol?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function CurrencyInput({
  value,
  onChange,
  placeholder = "0",
  className,
  disabled = false,
  showCurrencySymbol = false,
  ...props
}: CurrencyInputProps) {
  // Formatear el valor para mostrar
  const formatValue = (val: number | string | undefined): string => {
    if (val === undefined || val === null || val === "") return "";
    const numValue = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(numValue)) return "";
    return new Intl.NumberFormat("es-ES").format(numValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remover todos los caracteres que no sean números
    const rawValue = inputValue.replace(/\D/g, "");

    if (rawValue === "") {
      onChange("");
    } else {
      onChange(Number(rawValue));
    }
  };

  const displayValue = formatValue(value);

  if (showCurrencySymbol) {
    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          $
        </span>
        <Input
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("pl-7", className)}
          {...props}
        />
      </div>
    );
  }

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      {...props}
    />
  );
}
