import { BASE_URL } from "./BASE_URL";
import axios from "axios";
import { TransactionHistory } from "@/datas/sellingHistories";

const getTransactionHistory = async (outletId: string): Promise<TransactionHistory[]> => {
  const token = `Bearer ${localStorage.getItem("token")}`;
  try {
    const response = await axios.get(`${BASE_URL}/outlets/${outletId}/transactions`, {
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
      },
    });

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data.map((item: any) => ({
        id: item.id,
        code: item.code,
        transaction_id: item.transaction_id,
        product_id: item.product_id,
        price: item.price,
        cost: item.cost,
        qty: item.qty,
        created_at: item.created_at,
        updated_at: item.updated_at,
        transaction: item.transaction, // This contains the transaction details
        product: item.product, // This contains the product details
      }));
    } else {
      throw new Error("Unexpected API response structure");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized: Invalid or expired token.");
    }
    throw new Error(error.message || "Failed to fetch transaction history");
  }
};

export const TransactionHistoryService = {
  getTransactionHistory,
};
