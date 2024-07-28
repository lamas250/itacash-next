import { z } from 'zod';
import { Trash } from 'lucide-react';
import { insertCategorySchema, insetTransactionSchema } from '@/db/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/select';


const formSchema = z.object({
  date: z.coerce.date(),
  amount: z.number().positive(),
  categoryId: z.string().nullable().optional(),
  title: z.string(),
});

const apiSchema = insetTransactionSchema.omit({
  id: true,
  createdAt: true
})

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  categoryOptions: { label: string, value: string }[];
  onCreateCategory: (name: string) => void;
}

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  categoryOptions,
  onCreateCategory
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  })

  const handleSubmit = (values: FormValues) => {
    console.log({values});
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4 pt-6"
      >
        <FormField
          name='categoryId'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Categoria
              </FormLabel>
              <FormControl>
                <Select
                  placeholder='Selecione uma categoria'
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        >

        </FormField>
        <FormField
          name='amount'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Valor
              </FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder='Supermercado, Casa, Serviços, etc.'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          className='w-full'
          disabled={disabled}>
          {id ? 'Editar categoria' : 'Criar categoria'}
        </Button>
        {!!id && (
          <Button
            className='w-full'
            type='button'
            disabled={disabled}
            onClick={handleDelete}
            variant={'outline'}
          >
            <Trash size={20} />
            Deletar categoria
          </Button>
        )}
      </form>
    </Form>
  )
}