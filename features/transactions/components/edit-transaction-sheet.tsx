import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { insetTransactionSchema } from "@/db/schema";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transactions";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transactions";
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { convertAmountFromCents, convertAmountInCents } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const formSchema = insetTransactionSchema.omit({
  id: true,
  createdAt: true,
  userId: true,
})

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();

  const [ConfirmDialog, confirm] = useConfirm(
    'Deseja realmente deletar esta transação?',
    'Confirmar exclusão',
  )

  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({
    name,
  })
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id
  }));

  const isPending = editMutation.isPending
    || deleteMutation.isPending
    || categoryQuery.isLoading
    || categoryMutation.isPending
    || transactionQuery.isLoading;

  const isLoading = transactionQuery.isLoading
    || categoryQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  }

  const defaultValues = transactionQuery.data ? {
    categoryId: transactionQuery.data.categoryId,
    amount: convertAmountFromCents(transactionQuery.data.amount).toString(),
    date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
    title: transactionQuery.data.title,
  } : {
    categoryId: '',
    amount: '',
    date: new Date(),
    title: '',
  }

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        }
      })
    }
  }

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Editar transação
            </SheetTitle>
            <SheetDescription>
              Edite os dados da transação.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
            />
          )}
        </SheetContent>
        </Sheet>
      </>
  )
}