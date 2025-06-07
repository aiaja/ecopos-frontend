import { z } from "zod";

export const paymentMethodSchema = z.object({
    id: z.string(),
    name: z.string().min(2, { message: "Name is required" }),
    hero_image: z.string().min(2, { message: "Hero image is required" }),
    stock: z.number().min(0, { message: "Stock must be a positive number" }),
    selling_price: z.number().min(0, { message: "Selling price must be a positive number" }),
});

export const addToCartSchema = z.object({
    productId: z.string().min(1, { message: "Product ID is required" }),
    quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
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

export interface AddToCart {
    productId: string;
    quantity: number;
}
  
  // Mock order data
  const mockOrders: Order[] = []; // Replace with actual order data

  export { mockOrders };