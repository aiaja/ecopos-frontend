import { BASE_URL } from "./BASE_URL"
import axios from "axios";

type OpenBills = {
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


const getOpenBills = async (outletId: string): Promise<OpenBills[]> => {
    const rawToken = localStorage.getItem('token');
    if (!rawToken) {
        throw new Error('User is not authenticated. Token not found.');
    }
    // Optionally, check if the token is expired here and refresh if needed

    const token = `Bearer ${rawToken}`;
    try {
        const response = await axios.get(`${BASE_URL}/outlets/${outletId}/open-bills`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
        });
        // Adjust according to your API response structure
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        } else if (Array.isArray(response.data)) {
            return response.data;
        } else {
            throw new Error('Unexpected API response structure');
        }
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            throw new Error('Unauthorized: Invalid or expired token.');
        }
        throw new Error(error.message || 'Failed to fetch open bills');
    }
}

const createOpenBills = async (outletId: string, OpenBills: Omit<OpenBills, 'id'>): Promise<OpenBills> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.post(`${BASE_URL}/outlets/${outletId}/open-bills`, 
        OpenBills, 
        {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
        }
    );
    const data = await response.data;
    if (!data) {
        throw new Error('Failed to create payment method');
    }
    return response.data;
}

const updateOpenBills = async (outletId: string, id: string, OpenBills: Omit<OpenBills, 'id'>): Promise<OpenBills> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.put(`${BASE_URL}/outlets/${outletId}/open-bills/${id}`, OpenBills,
    {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.data;
    if (!data) {
        throw new Error('Failed to update payment method');
    }
    return response.data;
}

const getClosedBills = async (outletId: string): Promise<OpenBills[]> => {
    const rawToken = localStorage.getItem('token');
    if (!rawToken) {
        throw new Error('User is not authenticated. Token not found.');
    }
    const token = `Bearer ${rawToken}`;
    try {
        const response = await axios.get(`${BASE_URL}/outlets/${outletId}/closed-bills`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
        });
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        } else if (Array.isArray(response.data)) {
            return response.data;
        } else {
            throw new Error('Unexpected API response structure');
        }
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            throw new Error('Unauthorized: Invalid or expired token.');
        }
        throw new Error(error.message || 'Failed to fetch closed bills');
    }
}

export const deleteOpenBills = async (outletId: string, id: string): Promise<void> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.delete(`${BASE_URL}/outlets/${outletId}/open-billss/${id}`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (response.status !== 200 && response.status !== 204) {
        throw new Error('Failed to delete payment method');
    }
}

export const OpenBillsService = {
    getOpenBills,
    createOpenBills,
    updateOpenBills,
    getClosedBills,
    deleteOpenBills
}