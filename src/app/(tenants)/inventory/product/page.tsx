import { ProductsTable } from "@/components/inventory/products/products-table";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <ProductsTable />
    </div>
  );
}
