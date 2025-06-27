import { Product } from "@/datas/products";
import { BASE_URL } from "./BASE_URL";
import axios from "axios";

type OpenBills = {
    id: string;
    customer_name: string;
    code?: string;
    date: string;
    voucher_id: string | null;
    discout_price: number | null;
    total_price: number;
    total_qty: number;
    products?: {
        product_id: string,
        qty: number,
    }[] | [];
    details?:{
        id: string,
        code: string,
        open_bill_id: string,
        product_id: string,
        price: number,
        cost: number,
        qty: number,
        product: Product[],
    }[] | [];
};

const getOpenBills = async (outletId: string): Promise<OpenBills[]> => {
    const rawToken = localStorage.getItem("token");
    if (!rawToken) {
        throw new Error("User is not authenticated. Token not found.");
    }

    const token = `Bearer ${rawToken}`;
    try {
        const response = await axios.get(`${BASE_URL}/outlets/${outletId}/open-bills`, {
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
            },
        });
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            throw new Error("Unexpected API response structure");
        }
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            throw new Error("Unauthorized: Invalid or expired token.");
        }
        throw new Error(error.message || "Failed to fetch open bills");
    }
};

const createOpenBills = async (outletId: string, OpenBills: Omit<OpenBills, "id">): Promise<OpenBills> => {
    const token = `Bearer ${localStorage.getItem("token")}`;
    const response = await axios.post(`${BASE_URL}/outlets/${outletId}/open-bills`, OpenBills, {
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

const getOpenBillById = async (outletId: string, id: string): Promise<OpenBills> => {
    const token = `Bearer ${localStorage.getItem("token")}`;
    const response = await axios.get(`${BASE_URL}/outlets/${outletId}/open-bills/${id}`, {
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
    });
    if (!response.data) {
        throw new Error("Open Bills not found");
    }
    return response.data.data;
};

const updateOpenBills = async (outletId: string, id: string, item: Partial<OpenBills | any>): Promise<OpenBills> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.put(`${BASE_URL}/outlets/${outletId}/open-bills/${id}`, {
        ...item,
        outlet_id: outletId,
    }, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.openBills) {
        throw new Error('Failed to update cart item');
    }
    const data = await response.data;
    return data.openBills;
}


export const deleteOpenBills = async (outletId: string, id: string): Promise<void> => {
    const token = `Bearer ${localStorage.getItem("token")}`;
    const response = await axios.delete(`${BASE_URL}/outlets/${outletId}/open-bills/${id}`, {
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
    });
    if (response.status !== 200 && response.status !== 204) {
        throw new Error("Failed to delete open bill");
    }
};

export const OpenBillsService = {
    getOpenBills,
    getOpenBillById,
    createOpenBills,
    updateOpenBills,
    deleteOpenBills,
};
