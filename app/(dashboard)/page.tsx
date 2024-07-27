"use client";

import { Button } from "@/components/ui/button";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";

import { useUser } from "@clerk/nextjs";

export default function Home() {
  const user = useUser();
  const { data: categories, isLoading } = useGetCategories();
  const { isOpen, onOpen } = useNewCategory();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <p>{isOpen ? 'true' : 'false'}</p>
      <Button onClick={onOpen}>Click me</Button>
      <p>{user.user?.id}</p>
      <ul>
        {categories?.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </main>
  );
}
