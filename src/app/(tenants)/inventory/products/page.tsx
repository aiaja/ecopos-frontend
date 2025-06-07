// import { ProductsTable } from "@/components/inventory/products/products-table";

// export default function Home() {
//   return (
//     <div className="flex flex-col gap-4 p-4">
//       <ProductsTable />
//     </div>
//   );
// }

"use client";
import ProductsTable from "@/components/inventory/products/products-table";
import { Product } from "@/datas/products";
import { ProductService } from "@/services/products";
import {ca} from "date-fns/locale";
import { use, useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getProducts(localStorage.getItem("outlet_id") || "");
      if (response) {
        setProducts(response as Product[]);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      <ProductsTable products={products} />
    </div>
  );
}
