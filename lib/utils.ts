import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertAmountInCents = (currency: number) => {
  return Math.round(currency * 100);
}

export const convertAmountFromCents = (currency: number) => {
  return currency / 100;
}