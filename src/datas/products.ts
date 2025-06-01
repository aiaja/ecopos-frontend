import { z } from "zod";

export const productSchema = z.object({
  heroImages: z.any().optional(),
  name: z.string().min(2, { message: "Name is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  stock: z.coerce.number().min(0, { message: "Stock is required" }),
  unit: z.string().optional(),
  initialPrice: z.coerce.number().min(0, { message: "Initial price is required" }),
  sellingPrice: z.coerce.number().min(0, { message: "Selling price is required" }),
  nonStock: z.boolean().optional(),
});

export interface Product {
  id: number;
  heroImages?: FileList | null;
  categoryId: string;
  category: string;
  name: string;
  stock: number;
  unit?: string;
  initialPrice: number;
  sellingPrice: number;
  netProfit: number;
  nonStock?: boolean;
}

const products: Product[] = [
  {
    id: 123,
    heroImages: undefined,
    categoryId: '1',
    category: 'Minuman',
    name: 'Es Kopi Susu',
    stock: 30,
    unit: 'pcs',
    initialPrice: 8000,
    sellingPrice: 15000,
    netProfit: 7000,
    nonStock: false,
  },
  {
    id: 234,
    heroImages: undefined,
    categoryId: '2',
    category: 'Makanan',
    name: 'Roti Bakar Coklat Keju',
    stock: 20,
    unit: 'pcs',
    initialPrice: 10000,
    sellingPrice: 18000,
    netProfit: 8000,
    nonStock: false,
  },
  {
    id: 345,
    heroImages: undefined,
    categoryId: '1',
    category: 'Minuman',
    name: 'Matcha Latte Panas',
    stock: 25,
    unit: 'pcs',
    initialPrice: 9000,
    sellingPrice: 17000,
    netProfit: 8000,
    nonStock: false,
  },
  {
    id: 456,
    heroImages: undefined,
    categoryId: '1',
    category: 'Minuman',
    name: 'Es Kopi Susu',
    stock: 30,
    unit: 'pcs',
    initialPrice: 8000,
    sellingPrice: 15000,
    netProfit: 7000,
    nonStock: false,
  },
  {
    id: 567,
    heroImages: undefined,
    categoryId: '2',
    category: 'Makanan',
    name: 'Roti Bakar Coklat Keju',
    stock: 20,
    unit: 'pcs',
    initialPrice: 10000,
    sellingPrice: 18000,
    netProfit: 8000,
    nonStock: false,
  },
  {
    id: 678,
    heroImages: undefined,
    categoryId: '1',
    category: 'Minuman',
    name: 'Matcha Latte Panas',
    stock: 25,
    unit: 'pcs',
    initialPrice: 9000,
    sellingPrice: 17000,
    netProfit: 8000,
    nonStock: false,
  },
{
    id: 789,
    heroImages: undefined,
    categoryId: '1',
    category: 'Minuman',
    name: 'Es Kopi Susu',
    stock: 30,
    unit: 'pcs',
    initialPrice: 8000,
    sellingPrice: 15000,
    netProfit: 7000,
    nonStock: false,
  },
  {
    id: 890,
    heroImages: undefined,
    categoryId: '2',
    category: 'Makanan',
    name: 'Roti Bakar Coklat Keju',
    stock: 20,
    unit: 'pcs',
    initialPrice: 10000,
    sellingPrice: 18000,
    netProfit: 8000,
    nonStock: false,
  },
  {
    id: 987,
    heroImages: undefined,
    categoryId: '1',
    category: 'Minuman',
    name: 'Matcha Latte Panas',
    stock: 25,
    unit: 'pcs',
    initialPrice: 9000,
    sellingPrice: 17000,
    netProfit: 8000,
    nonStock: false,
  },
];

export default products;
