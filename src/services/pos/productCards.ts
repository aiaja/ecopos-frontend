import { BASE_URL } from "../BASE_URL";
import axios from "axios";

type ProductCard = {
    id?: string;
    name?: string;
    hero_image?: string;
    stock?: number;
    selling_price?: number;
};

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

export const ProductCardsService = { getProductCards };
