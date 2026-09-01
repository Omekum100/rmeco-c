import { format } from "date-fns";

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number(value));
}

export function formatDisplayDate(value: Date | string) {
  return format(new Date(value), "dd MMM yyyy");
}

export function toDateInputValue(value: Date | string) {
  return format(new Date(value), "yyyy-MM-dd");
}

export function humanizeEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
