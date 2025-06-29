"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

// Import "Single Source of Truth"
import { Category } from "@/datas/categories";
import { categorySchema} from "@/datas/categories";
import { toast } from 'sonner';

// Import Service Layer
import { CategoryService } from "@/services/category";

// Import Komponen UI dari shadcn/ui
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



export function CategoryForm({
  mode = "create",
  categoryId,
}: {
  mode?: "create" | "edit";
  categoryId?: string;
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    // Jika mode create, tidak perlu fetch data apa-apa
    if (mode === "create") {
      setIsLoading(false);
      return;
    }

    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        if (categoryId) {
          const outletId = localStorage.getItem("outlet_id") || "";
          const response = await CategoryService.getCategoryById(
            outletId,
            categoryId
          );
          // Gunakan form.reset untuk mengisi form dengan data dari server
          form.reset({
            name: response.name,
          });
        }
      } catch (error: any) {
        // Kirim toast kalau error
        toast.error(`Gagal memuat data kategori: ${error.message}`);
        // Kembalikan pengguna jika data gagal dimuat
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [mode, categoryId, form, router]);

// GANTI FUNGSI LAMA DENGAN VERSI DEBUGGING INI
async function handleSubmit(values: z.infer<typeof categorySchema>) {
    console.log("1. Tombol 'Simpan' diklik, handleSubmit terpanggil.");
    console.log("Data dari form (values):", values);

    // Definisikan promise yang akan dieksekusi
    const promise = () => new Promise(async (resolve, reject) => {
        console.log("2. Promise di dalam toast mulai dieksekusi.");
        try {
            console.log("3. Masuk ke blok try...catch.");
            const outletId = localStorage.getItem("outlet_id") || "";
            if (mode === "create") {
                console.log("4. Mode terdeteksi: CREATE. Memanggil service...");
                const newCategory = { name: values.name };
                await CategoryService.createCategory(outletId, newCategory);
            } else if (mode === "edit" && categoryId) {
                console.log("4. Mode terdeteksi: EDIT. Memanggil service...");
                const updatedCategory = { name: values.name };
                await CategoryService.updateCategory(outletId, categoryId, updatedCategory);
            }
            console.log("5. Panggilan service BERHASIL.");
            // Jika berhasil, resolve promise ini
            resolve("Data berhasil disimpan!");
        } catch (error: any) {
            console.error("6. Panggilan service GAGAL. Error:", error);
            // Jika gagal, reject promise dengan pesan error dari service
            reject(error.message);
        }
    });

    // Gunakan toast.promise untuk menampilkan notifikasi secara otomatis
    console.log("7. Memanggil toast.promise...");
    toast.promise(promise, {
        loading: 'Menyimpan data...',
        success: (message) => {
            console.log("8. Sukses! Menjalankan router.back()");
            router.back(); 
            const successMessage = mode === 'edit' ? 'Kategori berhasil diperbarui!' : 'Kategori baru berhasil dibuat!';
            return successMessage;
        },
        error: (errorMessage) => {
            console.error("9. Gagal! Menampilkan pesan error:", errorMessage);
            return errorMessage;
        },
    });
}


  // Bagian loading screen
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Ambil isSubmitting dari formState untuk menonaktifkan tombol secara otomatis, untuk mencegah klik ganda
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
