"use client";

import { Button } from "@/components/ui/button";
import { useGetCategories } from "@/features/categories/api/use-get-categories";

import { UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const user = useUser();
  const { data: categories, isLoading } = useGetCategories();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <p>{user.user?.id}</p>
      <ul>
        {categories?.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
      <Button>Click me</Button>
    </main>
  );
}
