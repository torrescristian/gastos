import React from "react";
import { useTranslation } from "../../hooks/useTranslation";

interface DateDisplayProps {
  readonly dateString: string;
  readonly className?: string;
}

export function DateDisplay({ dateString, className = "" }: DateDisplayProps) {
  const { formatDate } = useTranslation();

  return <span className={className}>{formatDate(dateString)}</span>;
}
