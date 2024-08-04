import { z } from 'zod';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { CircleOff, Trash } from 'lucide-react';
import { insertCategorySchema } from '@/db/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';


const formSchema = insertCategorySchema.pick({
  name: true,
  icon: true,
  type: true
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  parentId?: string;
  parentType?: string;
  categoryType?: string;
}

export const CategoryForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  parentType,
  categoryType
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  })

  const handleSubmit = (values: FormValues) => {
    if (!form.getValues('name')) {
      toast.error('Nome da categoria é obrigatório');
      return;
    }
    if (!form.getValues('type')) {
      toast.error('Selecione um tipo de transação');
      return;
    }
    onSubmit(values);
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
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name
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
        <FormField
          name='type'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tipo de transação
              </FormLabel>
              <FormControl>
                <div className='flex flex-row gap-x-2'>
                  <Button
                    type='button'
                    variant='outline'
                    disabled={parentType === 'income' || categoryType === 'income'}
                    className={cn(
                      'w-full bg-rose-200 hover:bg-rose-600',
                      (field.value === 'expense' || categoryType === 'expense') && 'bg-rose-500'
                    )}
                    onClick={() => field.onChange('expense')}
                  >
                    Despesa
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    disabled={parentType === 'expense' || categoryType === 'expense'}
                    className={cn(
                      'w-full bg-emerald-200 hover:bg-emerald-600',
                      (field.value === 'income' || categoryType === 'income') && 'bg-emerald-500'
                    )}
                    onClick={() => field.onChange('income')}
                  >
                    Receita
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name='icon'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Icone
              </FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className='h-[100px] w-full'
                    >
                      {form.watch('icon') ? (
                        <div className='flex flex-col items-center gap-2'>
                          <span className='text-3xl' role='img'>
                            {field.value}
                          </span>
                          <span className='text-xs text-muted-foreground'>Clique para mudar</span>
                        </div>
                      ) : (
                        <div className='flex flex-col items-center gap-2'>
                          <CircleOff className='text-3lx' />
                          <span className='text-xs text-muted-foreground'>Clique para selecionar</span>
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full'>
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji: { native: string }) => {
                        field.onChange(emoji.native)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>
                <span className='text-xs text-muted-foreground'>Escolha um icone para a categoria</span>
              </FormDescription>
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