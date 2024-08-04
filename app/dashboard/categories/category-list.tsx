import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  type: string;
  setType: (type: string) => void;
};

export default function CategoryList({ type, setType }: Props) {
  return (
    <div className="flex items-center py-4">
      <div className="flex flex-row items-center justify-between bg-gray-100 h-10 rounded-md w-full">
        <Button
          variant={'ghost'}
          size={'sm'}
          className={cn(
            "w-1/2 p-2 ml-1 bg-slate-100 hover:bg-slate-300/70 transition-colors",
            type === 'expense' && 'bg-slate-300'
          )}
          onClick={() => setType('expense')}
        >
          Despesas
        </Button>
        <Button
          variant={'ghost'}
          size={'sm'}
          className={cn(
            "w-1/2 p-2 ml-1 bg-slate-100 hover:bg-slate-300/70 transition-colors",
            type === 'income' && 'bg-slate-300'
          )}
          onClick={() => setType('income')}
        >
          Receitas
        </Button>
      </div>
    </div>
  )
}