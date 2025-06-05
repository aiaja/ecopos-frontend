import { BASE_URL } from "./BASE_URL"
import axios from "axios";

type PaymentMethod = {
    id?: string;
    name: string;
    outlet_id?: string;
}


const getPaymentMethods = async (outletId: string): Promise<PaymentMethod[]> => {
    const rawToken = localStorage.getItem('token');
    if (!rawToken) {
        throw new Error('User is not authenticated. Token not found.');
    }
    // Optionally, check if the token is expired here and refresh if needed

    const token = `Bearer ${rawToken}`;
    try {
        const response = await axios.get(`${BASE_URL}/outlets/${outletId}/payment-methods`, {
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
        throw new Error(error.message || 'Failed to fetch payment methods');
    }
}

const getPaymentMethodById = async (outletId:string, id: string): Promise<PaymentMethod> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.get(`${BASE_URL}/outlets/${outletId}/payment-methods/${id}`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data) {
        throw new Error('Payment method not found');
    }
    const data = await response.data;
    return data.data;

}

const createPaymentMethod = async (outletId: string, paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.post(`${BASE_URL}/outlets/${outletId}/payment-methods`, 
        paymentMethod, 
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

const updatePaymentMethod = async (outletId: string, id: string, paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.put(`${BASE_URL}/outlets/${outletId}/payment-methods/${id}`, paymentMethod,
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

const deletePaymentMethod = async (outletId: string, id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/outlets/${outletId}/payment-methods/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete payment method');
    }
}

export const PaymentMethodService = {
    getPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
}