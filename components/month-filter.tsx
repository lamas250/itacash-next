'use client';

import qs from 'query-string';
import {
  useRouter,
  usePathname,
  useSearchParams
} from 'next/navigation';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { formatMonthFilterLabel } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import MonthPicker from '@/components/month-picker';
import { useEffect, useState } from 'react';
import { useGetSummary } from '@/features/summary/api/use-get-summary';
import { Skeleton } from '@/components/ui/skeleton';

export const MonthFilter = ({ dateProps, onChange }: any) => {
  const [date, setDate] = useState(new Date());

  const router = useRouter();
  const pathname = usePathname();

  const {
    isLoading: isLoadingSummary
  } = useGetSummary();

  const params = useSearchParams();
  const month = params.get('month');
  const year = params.get('year');
  console.log('params', params.get('month'), params.get('year'));

  const defaultTo = month && year ? new Date(`${year}-${month}-01`) : new Date();
  console.log('defaultTo', defaultTo);

  const onChangeDate = (newDate: Date) => {
    setDate(newDate);
  }

  useEffect(() => {
    setDate(defaultTo);
  }, [isLoadingSummary])

  const pushToUrl = (date: Date) => {
    const query = {
      month: date.getMonth() + 1,
      year: date.getFullYear()
    }

    const url = qs.stringifyUrl({
      url: pathname,
      query
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  }

  if (isLoadingSummary) {
    return (
      <div className='lg:w-[150px] w-full mt-2  h-9 rounded-md px-3 bg-orange-500/20'>
        <Skeleton />
      </div>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild className='mt-2'>
        <Button
          disabled={false}
          size='sm'
          variant={'outline'}
          className='lg:w-auto w-full h-9 rounded-md px-3
            font-normal bg-orange-500/20 hover:bg-orange-500/40 hover:text-gray-800 border-none
            focus:ring-2 focus:ring-transparent outline-none text-gray-800 focus:bg-orange-500/50 transition'
        >
          <span className='capitalize font-md'>{formatMonthFilterLabel(date)}</span>
          <ChevronDown className='size-5 ml-2 opacity-60' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='lg:w-auto w-full p-0' align='start'>
        <MonthPicker currentMonth={date} onMonthChange={onChangeDate} />
        <PopoverClose className='w-full p-2 pt-0'>
          <Button
            variant={'outline'}
            className='w-full h-9 rounded-md
            font-normal bg-blue-500/20 hover:bg-blue-500/40 hover:text-gray-800 border-none
            focus:ring-2 focus:ring-transparent outline-none text-gray-800 focus:bg-blue-500/50 transition'
            onClick={() => pushToUrl(date)}
          >
            Buscar
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}