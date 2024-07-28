import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";


type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<typeof client.api.transactions.$post>["json"];

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
    >({
      mutationFn: async (json) => {
        const response = await client.api.transactions.$post({ json });
        return response.json();
      },
      onSuccess: () => {
        toast.success('Transação criada com sucesso');
        queryClient.invalidateQueries({ queryKey: ["transactions"]});
      },
      onError: (error) => {
        toast.error('Erro ao criar transação');
      }
    })
  return mutation
}