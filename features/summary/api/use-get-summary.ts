import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";
import { convertAmountFromCents } from "@/lib/utils";

export const useGetSummary = () => {
  const params = useSearchParams();
  const month = params.get('month') || '';
  const year = params.get('year') || '';

  const query = useQuery({
    queryKey: ["summary", { month, year }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          month,
          year
        }
      });

      if(!response.ok) {
        throw new Error('Failed to fetch summary');
      }

      const { data } = await response.json();
      return {
        ...data,
        incomeAmount: convertAmountFromCents(data.incomeAmount),
        expenseAmount: convertAmountFromCents(data.expenseAmount),
        remainingAmount: convertAmountFromCents(data.remainingAmount),
        categories: data.categories.map((category: any) => ({
          ...category,
          amount: convertAmountFromCents(category.amount)
        })),
        days: data.days.map((day: any) => ({
          ...day,
          amount: convertAmountFromCents(day.amount)
        }))
      };
    }
  });
  return query;
}