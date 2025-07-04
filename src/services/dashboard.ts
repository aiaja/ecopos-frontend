import { BASE_URL } from "./BASE_URL"
import axios from "axios";
import { Product } from "@/datas/dashboard";

type TodaySell = {
  id?: string;
  sale: number;
  date: string;
  outletId?: string;
};

type TodayIncome = {
    id?:string;
    income: number;
    date: string;
    outletId?: string;
}

type BestSellingProduct = {
  product: Product;
  qty: number;
}


const getTodaySells = async (outletId: string): Promise<TodaySell> => {
  const token = `Bearer ${localStorage.getItem("token")}`;
  try {
    const response = await axios.get(`${BASE_URL}/outlets/${outletId}/transactions/today/sells`, {
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
      },
    });

    // Check if response data is in the correct structure (single object, not array)
    if (response.data && response.data.data && typeof response.data.data.sell === "number") {
      return {
        sale: response.data.data.sell,
        date: response.data.data.date,
      };
    } else {
      throw new Error("Unexpected API response structure");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized: Invalid or expired token.");
    }
    throw new Error(error.message || "Failed to fetch today's sells");
  }
};

const getTodayIncomes = async (outletId: string): Promise<TodayIncome> => {
  const token = `Bearer ${localStorage.getItem("token")}`;
  try {
    const response = await axios.get(`${BASE_URL}/outlets/${outletId}/transactions/today/income`, {
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
      },
    });

    // Check if response data is in the correct structure (single object, not array)
    if (response.data && response.data.data && typeof response.data.data.income === "number") {
      return {
        income: response.data.data.income,
        date: response.data.data.date,
      };
    } else {
      throw new Error("Unexpected API response structure");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized: Invalid or expired token.");
    }
    throw new Error(error.message || "Failed to fetch today's sells");
  }
};

const getBestSellingProducts = async (outletId: string): Promise<BestSellingProduct[]> => {
  const token = `Bearer ${localStorage.getItem("token")}`;
  try {
    const response = await axios.get(`${BASE_URL}/outlets/${outletId}/transactions/today/best-product`, {
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
      },
    });

    // Check if the response data is in the correct structure
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data.map((item: any) => ({
        product: item.product,
        qty: item.qty,
      }));
    } else {
      throw new Error("Unexpected API response structure");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized: Invalid or expired token.");
    }
    throw new Error(error.message || "Failed to fetch best-selling products");
  }
};

export const DashboardService ={
    getTodaySells,
    getTodayIncomes,
    getBestSellingProducts
}
