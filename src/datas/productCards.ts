import { z } from "zod";

export const paymentMethodSchema = z.object({
    id: z.string(),
    name: z.string().min(2, { message: "Name is required" }),
    hero_image: z.string().min(2, { message: "Hero image is required" }),
    stock: z.number().min(0, { message: "Stock must be a positive number" }),
    selling_price: z.number().min(0, { message: "Selling price must be a positive number" }),
});
  
  // Define an interface for orders
export interface Order {
    id: number;
    product: string;
    quantity: number;
    price: number;
  }
  
  // Mock product data
export interface ProductCard {
    id: string;
    name: string;
    hero_image: string;
    stock: number;
    selling_price: number;
}

const productCards: ProductCard[] = [
    { id: "1", name: "pilmo", hero_image: "/next.svg", stock: 999, selling_price: 10000 },
    { id: "2", name: "kopop", hero_image: "/next.svg", stock: 13, selling_price: 15000 },
    { id: "3", name: "apaya", hero_image: "/next.svg", stock: 7000, selling_price: 20000 },
];
  
  // Mock order data
  const mockOrders: Order[] = []; // Replace with actual order data

  export { productCards, mockOrders };