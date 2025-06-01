import { CategoryForm } from "@/components/inventory/category/category-form";

export default function EditCategoryPage({ params }: { params: { categoryId: string } }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <CategoryForm mode="edit" categoryId={params.categoryId} />
    </div>
  );
}