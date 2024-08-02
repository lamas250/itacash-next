import { type ClassValue, clsx } from "clsx"
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { de } from "date-fns/locale";
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

export const formatCurrency = (currency: number) => {
  return currency.toLocaleString('pt-br', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
}

export const calculatePercentageChange = (
  current: number,
  previous: number
) => {
  if (previous === 0 || previous === null) {
    return previous === current ? 0 : 100;
  }
  return ((current - previous) / previous) * 100;
}


export function fillMissingDays(
  activeDays: { date: Date; income: number; expenses: number }[],
  startDate: Date,
  endDate: Date
) {
  if(activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate)
  });

  const transactionsByDay = allDays.map(day => {
    const found = activeDays.find((d) => isSameDay(d.date, day));

    if(found) {
      return found;
    } else {
      return {
        date: day,
        income: 0,
        expenses: 0
      }
    }
  })
  return transactionsByDay;
}

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
}

export function formatDateRange(period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if(!period?.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }

  if(period.to) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }

  return `${format(period.from, "LLL dd, y")}`;
}

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = {
    addPrefix: false
  }
) {
  const result = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    maximumFractionDigits: 2
  }).format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }

  return result;
}