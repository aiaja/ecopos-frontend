import { BASE_URL } from "./BASE_URL"
import axios from "axios";

type Voucher = {
  id: string;
  outlet_id: string;
  code: string;
  name: string;
  type: string;
  nominal: number;
  start_date: string;
  expired_date: string;
  minimum_buying: number;
  status: string;
};

const getVouchers = async (outletId: string): Promise<Voucher[]> => {
    const response = await fetch(`${BASE_URL}/outlets/${outletId}/vouchers`, {
        method: 'GET',
        headers: {  
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        }
    );
    if (response.status === 500) {
        throw new Error('Failed to fetch vouchers');
    }
    const data = await response.json();
    console.log("hsl",data)
    return data;
}

const getVoucherById = async (outletId:string, id: string): Promise<Voucher> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.get(`${BASE_URL}/outlets/${outletId}/vouchers/${id}`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.category) {
        throw new Error('Voucher not found');
    }
    const data = await response.data;
    return data;
}

const createVoucher = async (outletId: string, voucher: Omit<Voucher, 'id'>): Promise<Voucher> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.post(`${BASE_URL}/outlets/${outletId}/vouchers`, {
        ...voucher,
        outlet_id: outletId,
    }, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    console.log("Create Voucher Response:", response);
    if (!response.data || !response.data.voucher) {
        throw new Error('Failed to create voucher');
    }
    const data = await response.data;
    return data;
}

const updateVoucher = async (outletId: string, id: string, voucher: Omit<Voucher, 'id'>): Promise<Voucher> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.put(`${BASE_URL}/outlets/${outletId}/vouchers/${id}`, {
        ...voucher,
        outlet_id: outletId,
    }, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.voucher) {
        throw new Error('Failed to update voucher');
    }
    const data = await response.data;
    return data.voucher;
}

export const deleteVoucher = async (outletId: string, id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/outlets/${outletId}/vouchers/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
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