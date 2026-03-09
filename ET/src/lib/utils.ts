import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeFormatDate(value: string | null | undefined, fallback: string = "\u2014"): string {
  if (!value) return fallback;
  const date = new Date(value);
  if (isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString();
}

export function safeFormatDateTime(value: string | null | undefined, fallback: string = "\u2014"): string {
  if (!value) return fallback;
  const date = new Date(value);
  if (isNaN(date.getTime())) return fallback;
  return date.toLocaleString();
}
