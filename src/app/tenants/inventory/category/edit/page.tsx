"use client";
import { useParams, useRouter } from "next/navigation";
import { categories } from "@/datas/categories";
import { CategoryForm } from "@/components/category-form";

export default function CategoryEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const category = Array.isArray(categories)
    ? categories.find((c) => c.id === id)
    : undefined;

  if (!category) {
    return <div className="max-w-xl mx-auto mt-8">Category not found.</div>;
  }

  return (
    <CategoryForm
      mode="edit"
      defaultValues={{ name: category.name }}
      onSubmit={() => router.push("/tenants/inventory/category")}
    />
  );
}
