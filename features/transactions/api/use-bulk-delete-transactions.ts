import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.transactions['bulk-delete']["$post"]>["json"];
type ResponseType = InferResponseType<typeof client.api.transactions['bulk-delete']["$post"]>;

export const useTransactionBulkDelete = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
    >({
      mutationFn: async (json) => {
        const response = await client.api.transactions['bulk-delete']['$post']({ json });
        return response.json();
      },
      onSuccess: () => {
        toast.success('Transações deletadas com sucesso');
        queryClient.invalidateQueries({ queryKey: ["transactions"]});
        // TODO: Invalidate transactions summary
      },
      onError: (error) => {
        toast.error('Erro ao deletar transações');
      }
    })
  return mutation
}