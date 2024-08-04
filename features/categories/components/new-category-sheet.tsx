import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { insertCategorySchema } from "@/db/schema";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { CategoryForm } from "@/features/categories/components/category-form";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { z } from "zod";

const formSchema = insertCategorySchema.pick({
  name: true,
  icon: true,
  type: true,
  parentCategoryId: true
});

type FormValues = z.input<typeof formSchema>;

export const NewCategorySheet = () => {
  const { isOpen, onClose, parentId } = useNewCategory();
  const mutation = useCreateCategory();

  const onSubmit = (values: FormValues) => {
    mutation.mutate({
      ...values,
      parentCategoryId: parentId || '',
      type: values.type || ''
    }, {
      onSuccess: () => {
        onClose();
      }
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            Nova categoria
          </SheetTitle>
          <SheetDescription>
            Crie uma nova categoria para organizar suas transações
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          parentId={parentId}
          onSubmit={onSubmit}
          defaultValues={{
            name: '',
            icon: '',
            type: ''
          }}
        />
      </SheetContent>
    </Sheet>
  )
}