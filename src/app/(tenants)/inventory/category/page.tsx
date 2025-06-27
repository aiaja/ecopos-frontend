"use client"

import CategoriesTable from "@/components/inventory/category/category-table";
import { Category } from "@/datas/categories";
import { CategoryService } from "@/services/category";
import { ca } from "date-fns/locale";
import { use, useEffect, useState } from "react";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCategories = async () => {
    try{
      const response = await CategoryService.getCategories(localStorage.getItem("outlet_id") || "");
    if (response) {
      setCategories(response as Category[]);
    } else {
      console.error("Failed to fetch categories");
    }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      <CategoriesTable categories={categories} />

    </div>
  );
}
