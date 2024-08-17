import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Info, MinusCircle, PlusCircle } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';

type Props = {
  value: string,
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  amountType?: 'income' | 'expense';
}

export const AmountInput = ({
  value,
  onChange,
  placeholder,
  disabled,
  amountType
}: Props) => {
  const isIncome = amountType === 'income';
  const isExpense = amountType === 'expense';

  const onReverseValue = () => {
    if (!value) {
      return;
    }
    const newValue = (parseFloat(value) * -1).toString();
    onChange(newValue);
  };

  return (
    <div className='relative'>
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type='button'
              onClick={onReverseValue}
              className={cn(
                "bg-slate-400 hover:bg-slate absolute top-1.5",
                "left-1.5 rounded-md p-2 flex justify-center items-center transition",
                isIncome && "bg-emerald-500 hover:bg-emerald-600",
                isExpense && "bg-rose-500 hover:bg-rose-600",
              )}
            >
              {isIncome && <PlusCircle className='size-4  text-white' />}
              {isExpense && <MinusCircle className='size-4  text-white' />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {isIncome && 'Essa transação sera uma receita'}
            {isExpense && 'Essa transação sera uma despesa'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CurrencyInput
        prefix=' R$ '
        className="pl-11 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder}
        disabled={disabled}
        value={value ? value.replace('-', '') : value}
        decimalsLimit={2}
        onValueChange={onChange}
        decimalScale={2}
        intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
      />
      <p className='text-xs text-muted-foreground mt-2'>
        {isIncome && 'A transacação sera uma receita'}
        {isExpense && 'A transação sera uma despesa'}
      </p>
    </div>
  )
}