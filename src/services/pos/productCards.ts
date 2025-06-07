import { BASE_URL } from "../BASE_URL";
import axios from "axios";

type ProductCard = {
    id?: string;
    name?: string;
    hero_image?: string;
    stock?: number;
    selling_price?: number;
};

type AddToCart = {
    productId?: string;
    quantity: number;
}

const getProductCards = async (outletId: string): Promise<ProductCard[]> => {
    const response = await axios.get(`${BASE_URL}/outlets/${outletId}/products`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    });
    if (response.status === 500) {
        throw new Error('Failed to fetch product cards');
    }
    return response.data.products;
}

const addToCart = async (outletId: string, item: AddToCart): Promise<any> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.post(
        `${BASE_URL}/outlets/${outletId}/cart`,
        { ...item },
        {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
        }
    );
    if (!response.data) {
        throw new Error('Failed to add to cart');
    }
    return response.data;
}

export const ProductCardsService = { getProductCards, addToCart };
