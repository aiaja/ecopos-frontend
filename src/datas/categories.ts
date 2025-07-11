import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
});

export interface Category {
  id: string;
  name: string;
}
