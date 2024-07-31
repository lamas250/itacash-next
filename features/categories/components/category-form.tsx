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


const formSchema = insertCategorySchema.pick({
  name: true,
  icon: true
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export const CategoryForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  })

  const handleSubmit = (values: FormValues) => {
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
                          <p className='text-xs text-muted-foreground'>Clique para mudar</p>
                        </div>
                      ) : (
                        <div className='flex flex-col items-center gap-2'>
                          <CircleOff className='text-3lx' />
                          <p className='text-xs text-muted-foreground'>Clique para selecionar</p>
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
                <p className='text-xs text-muted-foreground'>Escolha um icone para a categoria</p>
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