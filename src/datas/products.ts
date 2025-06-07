import { z } from "zod";

export const productSchema = z.object({
  hero_images: z.any().optional(),
  name: z.string().min(2, { message: "Name is required" }),
  category_id: z.string().nullable(),
  stock: z.coerce.number().min(0, { message: "Stock is required" }),
  unit: z.string().optional(),
  initial_price: z.string().refine(val => !isNaN(parseFloat(val)), { message: "Initial price must be a number" }).transform(val => parseFloat(val).toString()),
  selling_price: z.string().refine(val => !isNaN(parseFloat(val)), { message: "Selling price must be a number" }).transform(val => parseFloat(val).toString()),
  is_non_stock: z.boolean().optional(),
  outlet_id: z.string().optional(),
  id: z.string().optional(),
  // created_at: z.date().optional(),
  // updated_at: z.date().nullable().optional(),
  net_profit: z.number().optional(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }).optional(),
});

export interface Product {
  id: string;
  outlet_id: string;
  category_id: string | null;
  name: string;
  stock: number;
  is_non_stock: boolean;
  initial_price: string;
  selling_price: string;
  unit: string | null;
  hero_images: string | null;
  // created_at: string;
  // updated_at: string | null;
  net_profit?: number;
  category: {
    id: string;
    name: string;
  };
}

export function netProfit(product: Product): number | undefined {
  const initialPrice = parseFloat(product.initial_price);
  const sellingPrice = parseFloat(product.selling_price);

  if (!isNaN(initialPrice) && !isNaN(sellingPrice)) {
    return sellingPrice - initialPrice;
  }
  else {
    return undefined;
  }
}


  // name: z.string().min(2, { message: "Name is required" }),
  // categoryId: z.string().min(1, { message: "Category is required" }),
  // stock: z.coerce.number().min(0, { message: "Stock is required" }),
  // unit: z.string().optional(),
  // initialPrice: z.coerce.number().min(0, { message: "Initial price is required" }),
  // sellingPrice: z.coerce.number().min(0, { message: "Selling price is required" }),
  // nonStock: z.boolean().optional(),