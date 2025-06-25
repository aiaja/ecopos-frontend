import { nullable, z } from "zod";

export const openBillsSchema = z.object({
    id: z.string().min(1, { message: "ID is required" }),
    code: z.string().min(1, { message: "code is required" }),
    customer_name: z.string().min(1, { message: "Customer name is required" }),
    date: z.string().min(1, { message: "Date is required" }),
    voucher_id: z.string().nullable(),
    discout_price: z.number().nullable(),
    total_price: z.number(),
    total_qty: z.number(),
    products: z.array(
        z.object({
            product_id: z.string().min(1, { message: "Product ID is required" }),
            qty: z.number().min(1, { message: "Quantity must be at least 1" }),
        })
    ),
});

export interface OpenBills {
    id: string,
    code: string;
    customer_name: string;
    date: string;
    voucher_id: string | null;
    discout_price: number | null;
    total_price: number;
    total_qty: number;
    products: {
        product_id: string;
        qty: number;
    }[];
}