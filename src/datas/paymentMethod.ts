import { z } from "zod";

export const paymentMethodSchema = z.object({
    id: z.string(),
    name: z.string().min(2, { message: "Name is required" }),
});

export interface PaymentMethod {
    id: string;
    name: string;
}

export const paymentMethods: PaymentMethod[] = [
    { id: "1", name: "Cash" },
    { id: "2", name: "Debit Card" },
    { id: "3", name: "Credit Card" },
    { id: "4", name: "E-Wallet" },
];
