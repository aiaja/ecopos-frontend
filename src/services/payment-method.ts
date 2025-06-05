import { BASE_URL } from "./BASE_URL"
import axios from "axios";

type PaymentMethod = {
    id?: string;
    name: string;
    outlet_id?: string;
}


const getPaymentMethods = async (outletId: string): Promise<PaymentMethod[]> => {
    const response = await fetch(`${BASE_URL}/outlets/${outletId}/payment-methods`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    }
    );
    if (response.status === 500) {
        throw new Error('Failed to fetch payment methods');
    }
    const data = await response.json();
    return data.payment_methods;
}

const getPaymentMethodById = async (outletId:string, id: string): Promise<PaymentMethod> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.get(`${BASE_URL}/outlets/${outletId}/payment-methods/${id}`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.payment_method) {
        throw new Error('Payment method not found');
    }
    const data = await response.data;
    return data.payment_method;

}

const createPaymentMethod = async (outletId: string, paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.post(`${BASE_URL}/outlets/${outletId}/payment-methods`, {
        ...paymentMethod,
        outlet_id: outletId,
    }, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.payment_method) {
        throw new Error('Failed to create payment method');
    }
    const data = response.data;
    return data.payment_method;
}

const updatePaymentMethod = async (outletId: string, id: string, paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.put(`${BASE_URL}/outlets/${outletId}/payment-methods/${id}`, {
        ...paymentMethod,
        outlet_id: outletId,
    }, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.payment_method) {
        throw new Error('Failed to update payment method');
    }
    const data = await response.data;
    return data.payment_method;
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