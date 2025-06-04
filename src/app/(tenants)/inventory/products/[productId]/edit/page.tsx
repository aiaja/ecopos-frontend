import { ProductsForm } from "@/components/inventory/products/products-form";

export default function EditProductPage({ params }: { params: { productId: string } }) {
 
  return (
    <div>
      <ProductsForm mode="edit" productId={params.productId} />
    </div>
  );
  
}