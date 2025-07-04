"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

import { categorySchema} from "@/datas/categories";
import { toast } from 'sonner';

import { CategoryService } from "@/services/category";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CategoryFormProps {
    mode?: "create" | "edit";
    categoryId?: string;
}

export function CategoryForm({ mode = "create", categoryId }: CategoryFormProps) {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            // Hanya fetch data jika mode 'edit' dan categoryId ada
            if (mode === 'edit' && categoryId) {
                const outletId = localStorage.getItem("outlet_id") || "";
                const response = await CategoryService.getCategoryById(
                    outletId,
                    categoryId
                );
                // untuk mengisi form dengan data dari server
                form.reset({
                    name: response.name,
                });
            }
        } catch (error: any) {
            toast.error(`Gagal memuat data kategori: ${error.message}`);
            router.back();
        } finally {
            // Set loading ke false setelah semua proses selesai
            setIsLoading(false);
        }
    };

    fetchInitialData();
  }, [mode, categoryId, form, router]);

  async function handleSubmit(values: z.infer<typeof categorySchema>) {
    const promise = () => new Promise(async (resolve, reject) => {
        try {
            const outletId = localStorage.getItem("outlet_id") || "";
            if (!outletId) {
                return reject("Outlet ID tidak ditemukan. Mohon login ulang.");
            }

            if (mode === "create") {
                const newCategory = { name: values.name };
                await CategoryService.createCategory(outletId, newCategory);
            } else if (mode === "edit" && categoryId) {
                const updatedCategory = { name: values.name };
                await CategoryService.updateCategory(outletId, categoryId, updatedCategory);
            }
            resolve("Data berhasil disimpan!");
        } catch (error: any) {
            reject(error.message);
        }
    });

    toast.promise(promise, {
        loading: 'Menyimpan category...',
        success: (message) => {
            router.back(); 
            const successMessage = mode === 'edit' ? 'Kategori berhasil diperbarui!' : 'Kategori baru berhasil dibuat!';
            return successMessage;
        },
        error: (errorMessage) => {
            return errorMessage;
        },
    });
  }

  if (isLoading && mode === 'edit') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const { isSubmitting } = form.formState;
  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">
          {mode === "edit" ? "Edit Category" : "New Category"}
        </h1>
      </div>
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : (mode === "edit" ? "Update" : "Simpan")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
