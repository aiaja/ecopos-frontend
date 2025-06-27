import {z} from "zod";

export const addToCartSchema = z.object({
    id: z.string().min(1, { message: "ID is required" }),
    productId: z.string().min(1, { message: "Product ID is required" }),
    qty: z.number().min(1, { message: "Quantity must be at least 1" }),
});
export interface addToCart {
    id: string;
    productId: string;
    qty: number;
}

export const cartSchema = z.object({
    id: z.string().min(1, { message: "ID is required" }),
    productId: z.string().min(1, { message: "Product ID is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    qty: z.number().min(1, { message: "Quantity must be at least 1" }),
    selling_price: z.number().min(0, { message: "Selling price must be a positive number" }),
});

export interface CartItem {
    product: any;
    id: string;
    productId: string;
    name: string;
    qty?: number;
    quantity: number;
    selling_price: number;
}

export interface customerDetails {
    member: string | null;
    note: string | null;
    voucher: string | null;
};

export interface PaymentDetails {
    subTotal: number;
    tax: number;
    total: number;
    moneyChanges: number;
}

export const customerDetails = {
    member: null,
    note: null,
    voucher: null
}

export const paymentDetails = {
    subTotal: 0,
    tax: 0,
    total: 0,
    moneyChanges: 0
}