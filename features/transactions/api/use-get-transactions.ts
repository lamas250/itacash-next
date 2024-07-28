import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetTransactions = () => {
  const params = useSearchParams();
  const from = params.get('from') || '';
  const to = params.get('to') || '';

  const query = useQuery({
    queryKey: ["transactions", { from, to }],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          from,
          to
        }
      });

      if(!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const { data } = await response.json();
      return data;
    }
  });
  return query;
}