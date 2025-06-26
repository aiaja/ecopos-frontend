import { BASE_URL } from "../BASE_URL";
import axios from "axios";

type CartItem = {
    id?: string;
    productId?: string;
    product?: ProductCart;
    qty?: number;
    quantity?: number;
};

type ProductCart = {
    productId: string;
    name: string;
    selling_price: number;
}

const getCartItems = async (outletId: string): Promise<CartItem[]> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.get(`${BASE_URL}/outlets/${outletId}/cart`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (response.status === 500) {
        throw new Error('Failed to fetch cart items');
    }
    return response.data.cart ?? [];
};

const updateCartItem = async (outletId: string, id: string, item: Partial<CartItem>): Promise<CartItem> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.put(`${BASE_URL}/outlets/${outletId}/cart/${id}`, {
        ...item,
        outlet_id: outletId,
    }, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.cartItem) {
        throw new Error('Failed to update cart item');
    }
    const data = await response.data;
    return data.cartItem;
}


export const deleteCartItem = async (outletId: string, id: string): Promise<void> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.delete(`${BASE_URL}/outlets/${outletId}/cart/${id}`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (response.status !== 200 && response.status !== 204) {
        throw new Error('Failed to delete cart item');
    }
}

const clearCart = async (outletId: string): Promise<void> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await fetch(`${BASE_URL}/outlets/${outletId}/cart`, {
        method: 'DELETE',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to clear cart');
    }
};

export const CartService = {
    getCartItems,
    updateCartItem,
    deleteCartItem,
    clearCart,
};