import { ProductsForm } from "@/components/inventory/products/products-form";

export default function EditProductPage({ params }: { params: { productId: string } }) {
 
  return (
    <div className="flex flex-col gap-4 p-4">
      <ProductsForm mode="edit" productId={params.productId} />
    </div>
  );
  
}