"use client";

import ProductsTable from "@/components/inventory/products/products-table";
import { Product } from "@/datas/products";
import { ProductService } from "@/services/products";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const outletId = localStorage.getItem("outlet_id") || "";
      const response = await ProductService.getProducts(outletId);
      setProducts(response || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fungsi untuk menangani penghapusan produk, akan dikirim ke tabel
  const handleDeleteProduct = (productId: string) => {
      const performDelete = async () => {
          try {
              const outletId = localStorage.getItem("outlet_id") || "";
              await ProductService.deleteProduct(outletId, productId);
              toast.success("Produk berhasil dihapus!");
              fetchProducts(); // Refresh data setelah berhasil
          } catch (error: any) {
              // Jika penghapusan gagal, tampilkan pesan error
              toast.error(error.message);
          }
      };

      // Tampilkan notifikasi konfirmasi
      toast("Konfirmasi Penghapusan", {
          description: "Apakah Anda yakin ingin menghapus produk ini?",
          action: {
              label: "Hapus",
              onClick: () => performDelete(), // Panggil fungsi hapus saat diklik
          },
          // Tombol untuk membatalkan
          cancel: {
              label: "Batal",
              onClick: () => {
                  // Tidak perlu melakukan apa-apa, toast akan otomatis tertutup
              },
          },
          duration: Infinity, 
      });
  };

  // Fungsi untuk menangani toggle status, akan dikirim ke tabel
  const handleToggleStockStatus = async (productId: string, newStatus: boolean) => {
    // Simpan state lama untuk fallback jika terjadi error
    const originalProducts = [...products];

    setProducts(currentProducts =>
      currentProducts.map(p =>
        p.id === productId ? { ...p, is_non_stock: newStatus } : p
      )
    );

    try {
      // Cari data lengkap produk yang mau diupdate
      const productToUpdate = originalProducts.find(p => p.id === productId);
      if (!productToUpdate) {
        throw new Error("Product not found in local state.");
      }

      // Buat FormData
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

      toast.success("Status produk berhasil diubah.");
    } catch (error: any) {
    toast.error(error.message);
    setProducts(originalProducts);
  }
};

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <ProductsTable
        products={products}
        onDelete={handleDeleteProduct}
        onToggleStock={handleToggleStockStatus}
      />
    </div>
  );
}