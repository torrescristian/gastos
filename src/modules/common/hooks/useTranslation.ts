import { useLanguage } from "../contexts/language-context";
import {
  translations,
  getCategoryTranslation,
  formatDateForDisplay,
  parseDateFromDisplay,
} from "../lib/translations";

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: keyof typeof translations.es): string => {
    return translations[language][key] || translations.es[key] || key;
  };

  const tCategory = (categoryName: string): string => {
    return getCategoryTranslation(categoryName, language);
  };

  const formatDate = (dateString: string): string => {
    return formatDateForDisplay(dateString, language);
  };

  const parseDate = (displayDate: string): string => {
    return parseDateFromDisplay(displayDate, language);
  };

  return { t, tCategory, language, formatDate, parseDate };
}
