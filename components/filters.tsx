'use client';

import { MonthFilter } from "@/components/month-filter";

export const Filters = ({ date, onChange }: any) => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-y-2">
      <MonthFilter />
    </div>
  )
}