"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useTransactionBulkDelete } from "@/features/transactions/api/use-bulk-delete-transactions";
import { columns } from "@/app/dashboard/transactions/columns";


const TransactionsPage = () => {
  const { onOpen} = useNewTransaction();

  const transactionsQuery = useGetTransactions();
  const deleteTransactions = useTransactionBulkDelete();

  const transactions = transactionsQuery.data || [];

  const isDisabled =
    transactionsQuery.isLoading ||
    deleteTransactions.isPending;

  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="w-48 h-8" />
          </CardHeader>
          <CardContent>
            <Skeleton className="w-full h-64" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card
        className="border-none drop-shadow-sm"
      >
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Historico de Transações
          </CardTitle>
          <div className="flex flex-row gap-x-2">
            <Button
              size={'sm'}
              onClick={() => onOpen('expense')}
              className="bg-rose-500 hover:bg-rose-500/70"
            >
              <Plus className="size-4 mr-2" />
              Despesa
            </Button>
            <Button
              size={'sm'}
              onClick={() => onOpen('income')}
              className="bg-emerald-500 hover:bg-emerald-500/70"
            >
              <Plus className="size-4 mr-2" />
              Receita
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            filterKey="name"
            filterLabel="nome"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disable={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionsPage;