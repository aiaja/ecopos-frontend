"use client";

import ProductsTable from "@/components/inventory/products/products-table";
import { Product } from "@/datas/products";
import { ProductService } from "@/services/products";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const outletId = localStorage.getItem("outlet_id") || "";
      const response = await ProductService.getProducts(outletId);
      setProducts(response || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fungsi untuk menangani penghapusan produk, akan dikirim ke tabel
  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm(`Are you sure you want to delete this product?`)) {
      try {
        const outletId = localStorage.getItem("outlet_id") || "";
        await ProductService.deleteProduct(outletId, productId);
        alert("Product deleted successfully!");
        fetchProducts(); // Ambil ulang data terbaru untuk merefresh tabel
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  // Fungsi untuk menangani toggle status, akan dikirim ke tabel
  const handleToggleStockStatus = async (productId: string, newStatus: boolean) => {
    // Simpan state lama untuk fallback jika terjadi error
    const originalProducts = [...products];

    // Optimistic UI Update (langsung ubah tampilan di frontend)
    setProducts(currentProducts =>
      currentProducts.map(p =>
        p.id === productId ? { ...p, is_non_stock: newStatus } : p
      )
    );

    try {
      // 1. Cari data lengkap produk yang mau diupdate dari state kita
      const productToUpdate = originalProducts.find(p => p.id === productId);
      if (!productToUpdate) {
        throw new Error("Product not found in local state.");
      }

      // 2. Buat FormData, sama seperti di form edit
      const formData = new FormData();
      formData.append("name", productToUpdate.name);
      formData.append("category_id", productToUpdate.category_id);
      formData.append("stock", productToUpdate.stock.toString());
      formData.append("initial_price", productToUpdate.initial_price);
      formData.append("selling_price", productToUpdate.selling_price);
      if (productToUpdate.unit) {
        formData.append("unit", productToUpdate.unit);
      }
      formData.append("is_non_stock", newStatus ? "1" : "0");
      const outletId = localStorage.getItem("outlet_id") || "";
      await ProductService.updateProduct(outletId, productId, formData);

    } catch (error) {
      console.error("Failed to toggle stock status:", error);
      alert("Failed to update status, reverting changes.");
      // Jika Gagal: Kembalikan UI ke kondisi semula
      setProducts(originalProducts);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Kirim data dan semua fungsi aksi sebagai props ke komponen tabel */}
      <ProductsTable
        products={products}
        onDelete={handleDeleteProduct}
        onToggleStock={handleToggleStockStatus}
      />
    </div>
  );
}