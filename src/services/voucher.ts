import { BASE_URL } from "./BASE_URL";
import axios from "axios";

type Voucher = {
    id?: string;
  code: string;
  name: string;
  type: string;
  nominal: string;  // Nominal value in string format (to handle both percentage and nominal values)
  start_date: string;  // Date in 'YYYY-MM-DD' format
  expired_date: string;  // Date in 'YYYY-MM-DD' format
  minimum_buying: string;  // Minimum purchase required in string format
  status: string;
  outlet_id?: string;
}


const getVouchers = async (outletId: string): Promise<Voucher[]> => {
    const rawToken = localStorage.getItem('token');
    if (!rawToken) {
        throw new Error('User is not authenticated. Token not found.');
    }
    // Optionally, check if the token is expired here and refresh if needed

    const token = `Bearer ${rawToken}`;
    try {
        const response = await axios.get(`${BASE_URL}/outlets/${outletId}/vouchers`, {
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
        throw new Error(error.message || 'Failed to fetch vouchers');
    }
}

const getVoucherById = async (outletId:string, id: string): Promise<Voucher> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.get(`${BASE_URL}/outlets/${outletId}/vouchers/${id}`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data) {
        throw new Error('Voucher not found');
    }
    const data = await response.data;
    return data.data;

}

const createVoucher = async (outletId: string, voucher: Omit<Voucher, 'id'>): Promise<Voucher> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.post(`${BASE_URL}/outlets/${outletId}/vouchers`, 
        voucher, 
        {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
        }
    );
    const data = await response.data;
    if (!data) {
        throw new Error('Failed to create voucher');
    }
    return response.data;
}

const updateVoucher = async (outletId: string, id: string, voucher: Omit<Voucher, 'id'>): Promise<Voucher> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.put(`${BASE_URL}/outlets/${outletId}/vouchers/${id}`, voucher,
    {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.data;
    if (!data) {
        throw new Error('Failed to update voucher');
    }
    return response.data;
}

export const deleteVoucher = async (outletId: string, id: string): Promise<void> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.delete(`${BASE_URL}/outlets/${outletId}/vouchers/${id}`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (response.status !== 200 && response.status !== 204) {
        throw new Error('Failed to delete voucher');
    }
}

export const VoucherService = {
    getVouchers,
    getVoucherById,
    createVoucher,
    updateVoucher,
    deleteVoucher,
}