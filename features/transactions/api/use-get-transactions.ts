import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";
import { convertAmountFromCents } from "@/lib/utils";

export const useGetTransactions = () => {
  const params = useSearchParams();
  const month = params.get('month') || '';
  const year = params.get('year') || '';

  const query = useQuery({
    queryKey: ["transactions", { month, year }],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          month,
          year
        }
      });

      if(!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const { data } = await response.json();
      return data.map((transaction) => {
        return {
          ...transaction,
          amount: convertAmountFromCents(transaction.amount)
        }
      });
    }
  });
  return query;
}