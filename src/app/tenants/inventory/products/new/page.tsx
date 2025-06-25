import { ProductsForm } from "@/components/products-form";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <ProductsForm mode="create" />
    </div>
  );
}
