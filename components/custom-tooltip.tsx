import { Separator } from '@/components/ui/separator';
import { convertAmountFromCents, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns'


export const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload) return null

  const date = payload[0].payload.date;
  const income = payload[0].payload.income;
  const expenses = payload[1].payload.expenses;

  return (
    <div className='rounded-sm bg-white shadow-sm border overflow-hidden'>
      <div className='text-sm p-2 px-3 bg-muted text-muted-foreground'>
        {format(date, 'dd MMM yyyy')}
      </div>
      <Separator />
      <div className='p-2 px-3 space-y-1'>
        <div className='flex items-center justify-between gap-x-4'>
          <div className='flex items-center gap-x-2'>
            <div className='size-1.5 bg-blue-500 rounded-full' />
              <p className='text-sm text-muted-foreground'>
                Receita
              </p>
            <p className='text-sm text-right font-medium'>
              {formatCurrency(convertAmountFromCents(income))}
            </p>
          </div>
          <div className='flex items-center gap-x-2'>
            <div className='size-1.5 bg-rose-500 rounded-full' />
              <p className='text-sm text-muted-foreground'>
                Despesa
              </p>
            <p className='text-sm text-right font-medium'>
              {formatCurrency(convertAmountFromCents(expenses))}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}