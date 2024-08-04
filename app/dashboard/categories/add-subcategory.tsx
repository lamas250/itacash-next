"use client";

import { Button } from "@/components/ui/button";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { Plus } from "lucide-react";

type Props = {
  parentId: string;
}

export const AddSubCategory = ({ parentId }: Props) => {
  const { onOpen } = useNewCategory();

  return (
    <>
      <Button
        variant="outline" size="sm"
        onClick={() => onOpen(parentId)}
      >
        <Plus className="size-4 mr-1" />
        Sub-categoria
      </Button>
    </>
  )
}