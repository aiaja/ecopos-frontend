import { z } from "zod";
import { Category } from "./categories";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export type Product = {
  id?: string;
  name: string;
  stock: number;
  initial_price: string;
  selling_price: string;
  unit: string;
  hero_images: string | null;
  is_non_stock: boolean;
  outlet_id?: string;
  category_id: string;
  category?: Category;
};

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  category_id: z.string().min(1, "Please select a category."),
  stock: z.coerce.number().int().min(0, "Stock must be a non-negative integer."),
  unit: z.string().min(1, "Unit wajib diisi."),
  initial_price: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Initial price must be a valid number." }),
  selling_price: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Selling price must be a valid number." }),
  is_non_stock: z.boolean(),
  hero_images: z
    .any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .jpg, .jpeg, .png and .webp formats are supported.")
});

export const netProfit = (product: Product): number => {
  const sellingPrice = parseFloat(product.selling_price);
  const initialPrice = parseFloat(product.initial_price);
  if (isNaN(sellingPrice) || isNaN(initialPrice)) return 0;
  return sellingPrice - initialPrice;
};