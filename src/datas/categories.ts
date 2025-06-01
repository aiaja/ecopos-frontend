import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "Name is required" }),
});

export interface Category {
  id: string;
  name: string;
}

export const categories: Category[] = [
  { id: "1", name: "Minuman" },
  { id: "2", name: "Makanan" },
];
