import { z } from "zod";

// Schema untuk transaksi
export const CreateTransactionSchema = z.object({
    date: z.string().min(1, { message: "Date is required" }),
    note: z.string().optional(),
    voucher_id: z.string().nullable(),
    discount_price: z.number().min(0, { message: "Discount price must be a positive number" }),
    payed_money: z.number().min(0, { message: "Paid money must be a positive number" }),
    money_changes: z.number().min(0, { message: "Money changes must be a positive number" }),
    total_price: z.number().min(0, { message: "Total price must be a positive number" }),
    total_cost: z.number().min(0, { message: "Total cost must be a positive number" }),
    payment_method_id: z.string().uuid({ message: "Invalid payment method ID" }),
    tax: z.number().min(0, { message: "Tax must be a positive number" }),
    tax_price: z.number().min(0, { message: "Tax price must be a positive number" }),
    total_qty: z.number().min(0, { message: "Total quantity must be a positive number" }),
    products: z.array(
        z.object({
            product_id: z.string().uuid({ message: "Invalid product ID" }),
            qty: z.number().min(1, { message: "Quantity must be at least 1" }),
        })
    ),
});

// Interface untuk transaksi
export interface Transaction {
    date: string;
    note?: string;
    voucher_id: string | null;
    discount_price: number;
    payed_money: number;
    money_changes: number;
    total_price: number;
    total_cost: number;
    payment_method_id: string;
    tax: number;
    tax_price: number;
    total_qty: number;
    products: { product_id: string; qty: number }[];
}

