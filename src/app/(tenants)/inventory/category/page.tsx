"use client";

import { useEffect, useState } from "react";
import { Category } from "@/datas/categories";
import { CategoryService } from "@/services/category";
import { CategoriesTable } from "@/components/inventory/category/category-table";
import { toast } from "sonner";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const outletId = localStorage.getItem("outlet_id") || "";
      const response = await CategoryService.getCategories(outletId);
      setCategories(response || []);
    } catch (error: any) {
      toast.error(error.message);
      setCategories([]); // Kosongkan data jika gagal
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = (categoryId: string) => { 
      
      const performDelete = async () => {
          try {
              const outletId = localStorage.getItem("outlet_id") || "";
              await CategoryService.deleteCategory(outletId, categoryId);
              toast.success("Kategori berhasil dihapus!");
              fetchCategories(); // Refresh data setelah berhasil
          } catch (error: any) {
              toast.error(error.message);
          }
      };

      // Tampilkan notifikasi konfirmasi
      toast("Konfirmasi Penghapusan", {
          description: "Apakah Anda yakin ingin menghapus kategori ini?",
          // Tombol aksi utama (misal: tombol yang berbahaya/destruktif)
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
          // Atur agar notifikasi tidak hilang otomatis sampai user memilih
          duration: Infinity, 
      });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <CategoriesTable 
        categories={categories} 
         onDelete={handleDeleteCategory}
      />
    </div>
  );
}