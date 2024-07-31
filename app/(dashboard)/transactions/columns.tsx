"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { AlertTriangle, ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { InferResponseType } from "hono"
import { client } from "@/lib/hono"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Actions } from "@/app/(dashboard)/transactions/actions"
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction"

export type ResponseType = InferResponseType<typeof client.api.transactions.$get, 200>["data"][0]

export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Descrição
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span className="font-semibold">{row.getValue('title')}</span>
      )
    }
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => {
      if (row.original.categoryIcon === null) {
        return (
          <button className="flex flex-row items-center text-rose-600">
            <AlertTriangle className="text-2xl pr-1" />
            <span className="font-semibold">Sem categoria</span>
          </button>
        )
      }
      return (
        <div>
          {row.original.categoryIcon && (<span className="text-2xl pr-2" role="img">{row.original.categoryIcon}</span>)}
          <span className="font-semibold">{row.getValue('category')}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      return (
        <Badge
          variant={amount < 0 ? 'expense' : 'income'}
          className="text-xs font-medium px-2.5 py-1.5"
        >
          {formatCurrency(amount)}
        </Badge>
      )
    }
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => {
      const date = row.getValue('date') as Date;
      return (
        <span>{format(date, 'dd/MM/yyyy')}</span>
      )
    }
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      return (<Actions id={row.original.id} />)
    },
  }
]
