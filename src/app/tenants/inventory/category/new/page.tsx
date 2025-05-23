import { CategoryForm } from "@/components/category-form";

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <CategoryForm mode="create" />
    </div>
  );
}

