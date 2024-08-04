import { Actions } from "@/app/dashboard/categories/actions";
import { AddSubCategory } from "@/app/dashboard/categories/add-subcategory";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Category = {
    id: string;
    name: string;
    icon: string;
    type: string;
    parentCategoryId: string | null;
    subcategories?: Category[];
}

type Props = {
  type: string;
  setType: (type: string) => void;
  categories: Category[];
};

export default function CategoryList({ type, setType, categories }: Props) {
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories);

  useEffect(() => {
    const categoriesWithSubcategories = categories.map((category) => {
      const subcategories = categories.filter((c) => c.parentCategoryId === category.id);
      return {
        ...category,
        subcategories,
      };
    });
    setFilteredCategories(categoriesWithSubcategories.filter((category) => category.type === type && !category.parentCategoryId));
  },[categories, type]);

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="flex flex-row items-center justify-between bg-gray-200/70 h-11 rounded-md w-full">
          <Button
            variant={'ghost'}
            size={'sm'}
            className={cn(
              "w-1/2 p-2 ml-1 bg-slate-100 hover:bg-rose-300/50 transition-colors",
              type === 'expense' && 'bg-rose-500'
            )}
            onClick={() => setType('expense')}
          >
            Despesas
          </Button>
          <Button
            variant={'ghost'}
            size={'sm'}
            className={cn(
              "w-1/2 p-2 mr-1 bg-slate-100 hover:bg-emerald-300/50 transition-colors",
              type === 'income' && 'bg-emerald-500'
            )}
            onClick={() => setType('income')}
          >
            Receitas
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          {filteredCategories.length > 0 ? (
            <div className="py-2">
              {filteredCategories.map((category) => (
                <div key={category.id}>
                  <div
                    className="flex items-center justify-between py-2 border-b border-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <p className="w-5 h-5">{category.icon}</p>
                      </div>
                      <span className="ml-2">{category.name}</span>
                    </div>
                    <div className="flex flex-row gap-x-2">
                      <AddSubCategory parentId={category.id} parentType={category.type} />
                      <Actions categoryType={category.type} id={category.id} />
                    </div>
                  </div>
                  {(category.subcategories && category.subcategories.length > 0) && category.subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className="pl-6 flex items-center justify-between py-2 border-b border-gray-100"
                    >
                      <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                          <p className="w-4 h-4">{subcategory.icon}</p>
                        </div>
                        <span className="ml-2 text-sm">{subcategory.name}</span>
                      </div>
                      <div>
                        <Actions categoryType={subcategory.type} id={category.id} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-2 text-center">Nenhuma categoria encontrada</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}