"use client";
import { useParams } from "next/navigation";
import { ProductsForm } from "@/components/products-form";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="p-4">
      <ProductsForm mode="edit" productId={id} />
    </div>
  );
}
