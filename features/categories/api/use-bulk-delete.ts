import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.categories['bulk-delete']["$post"]>["json"];
type ResponseType = InferResponseType<typeof client.api.categories['bulk-delete']["$post"]>;

export const useCategoryBulkDelete = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
    >({
      mutationFn: async (json) => {
        const response = await client.api.categories['bulk-delete']['$post']({ json });
        return response.json();
      },
      onSuccess: () => {
        toast.success('Categorias deletadas com sucesso');
        queryClient.invalidateQueries({ queryKey: ["categories"]});
        // TODO: Invalidate categories summary
      },
      onError: (error) => {
        toast.error('Erro ao deletar categorias');
      }
    })
  return mutation
}