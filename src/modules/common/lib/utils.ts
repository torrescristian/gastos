import { clsx, type ClassValue } from "clsx";
import { addHours, format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const utcDate = (date: string | Date) => {
  const utcOffset = new Date().getTimezoneOffset() / 60;

  return addHours(typeof date === "string" ? new Date(date) : date, utcOffset);
};

export const utcFormatDate = (date?: string | Date) => {
  if (!date) return "-";

  const utcOffset = new Date().getTimezoneOffset() / 60;
  const formattedDate = format(
    addHours(typeof date === "string" ? new Date(date) : date, utcOffset),
    `dd/MM/yyyy`
  );
  return formattedDate;
};

export const millionsSeparator = (value: number) => {
  return new Intl.NumberFormat().format(value).replace(/,/g, ".");
};

export function formatCompactCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return amount.toString();
}

export const titleCaseWord = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

export const capitalizeEveryWord = (text: string): string => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => titleCaseWord(word))
    .join(" ");
};
