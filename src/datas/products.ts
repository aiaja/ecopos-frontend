import { z } from "zod";
import { Category } from "./categories"; // Kita juga butuh tipe Category di sini

// Konstanta untuk validasi gambar
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export type Product = {
  id?: string;
  name: string;
  stock: number;
  initial_price: number;
  selling_price: number;
  unit: string;
  hero_image?: string | null;
  outlet_id?: string;
  category_id: string;
  category?: Category;
};

export const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  stock: z.coerce.number().min(0, { message: "Stock must be a positive number." }),
  initial_price: z.coerce.number().min(0, { message: "Initial price must be a positive number." }),
  selling_price: z.coerce.number().min(0, { message: "Selling price must be a positive number." }),
  unit: z.string().min(1, { message: "Unit is required." }),
  category_id: z.string({ required_error: "Please select a category." }),
  hero_image: z
    .any()
    .refine((files) => {
        if (!files || files.length === 0) return true; // Opsional, jadi lewati jika tidak ada file
        return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => {
        if (!files || files.length === 0) return true; // Opsional, jadi lewati jika tidak ada file
        return ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type);
      },
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
});

// Ganti fungsi lama dengan yang ini di file datas/products.ts

export const netProfit = (product: Product): number => {
  // 1. Ubah harga dari string ke number
  const sellingPrice = Number(product.selling_price);
  const initialPrice = Number(product.initial_price);

  // 2. Lakukan pengecekan apakah konversi berhasil (bukan NaN - Not a Number)
  if (isNaN(sellingPrice) || isNaN(initialPrice)) {
    return 0; // Jika salah satu harga tidak valid, kembalikan 0
  }

  // 3. Lakukan kalkulasi dengan data yang sudah menjadi number
  return sellingPrice - initialPrice;
};