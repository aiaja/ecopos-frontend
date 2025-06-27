"use client";

import { useEffect, useState } from "react";
import { Category } from "@/datas/categories";
import { CategoryService } from "@/services/category";
import { CategoriesTable } from "@/components/inventory/category/category-table";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const outletId = localStorage.getItem("outlet_id") || "";
      const response = await CategoryService.getCategories(outletId);
      setCategories(response || []); // Sederhanakan ini
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (categoryId: string) => {
    // Tambahkan konfirmasi dan try-catch
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const outletId = localStorage.getItem("outlet_id") || "";
        await CategoryService.deleteCategory(outletId, categoryId);
        alert("Category deleted successfully!");
        fetchCategories(); // Paling aman: ambil ulang data dari server
      } catch (error: any) {
        console.error("Failed to delete category:", error);
        alert(error.message); // Tampilkan pesan error detail dari service
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <CategoriesTable categories={categories} onDelete={handleDeleteCategory} />
    </div>
  );
}