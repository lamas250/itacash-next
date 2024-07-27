"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { Plus } from "lucide-react";

import { columns } from "@/app/(dashboard)/categories/columns";
import { DataTable } from "@/components/data-table";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { Skeleton } from "@/components/ui/skeleton";


const CategoriesPage = () => {
  const newCategory = useNewCategory();

  const categoriesQuery = useGetCategories();
  const accounts = categoriesQuery.data || [];

  if (categoriesQuery.isLoading) {
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
            Categorias
          </CardTitle>
          <Button size={'sm'} onClick={newCategory.onOpen}>
            <Plus className="size-4 mr-2" />
            Novo
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={accounts}
            filterKey="nome"
            onDelete={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoriesPage;