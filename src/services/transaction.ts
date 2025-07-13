import { BASE_URL } from "./BASE_URL"
import axios from "axios";

type Transaction = {
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

const createTransaction = async (outletId: string, Transaction: Omit<Transaction, "id">): Promise<Transaction> => {
    const token = `Bearer ${localStorage.getItem("token")}`;
    const response = await axios.post(`${BASE_URL}/outlets/${outletId}/transactions`, Transaction, {
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
    });
    const data = await response.data;
    if (!data) {
        throw new Error("Failed to create open bills");
    }
    return data;
};

export const TransactionService = {
    createTransaction,
}