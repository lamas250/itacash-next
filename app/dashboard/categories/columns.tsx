"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Plus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { InferResponseType } from "hono"
import { client } from "@/lib/hono"
import { Actions } from "@/app/dashboard/categories/actions"
import { AddSubCategory } from "@/app/dashboard/categories/add-subcategory"

export type ResponseType = InferResponseType<typeof client.api.categories.$get, 200>["data"][0]

export const columns: ColumnDef<ResponseType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "icon",
    header: 'Icone',
    cell: ({ row }) => {
      return (
        <span className="text-2xl" role="img">
          {row.original.icon}
        </span>
      )
    }
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-x-2">
          <Actions id={row.original.id} />
          <AddSubCategory parentId={row.original.id} />
        </div>
      )
    },
  }
]
