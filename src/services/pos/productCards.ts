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

type ProductByCategory = {
    category_id?: string;
    category_name?: string;
    id?: string;
    name?: string;
    hero_image?: string;
    stock?: number;
    selling_price?: number;
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

const getProductByCategory = async (outletId: string, categoryId: string): Promise<ProductByCategory[]> => {
    const response = await axios.get(`${BASE_URL}/outlets/${outletId}/products`,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        }
    );
    if (response.status === 500) {
        throw new Error('Failed to fetch products');
    }
    // Filter products by category_id on the client side
    const products: ProductByCategory[] = response.data.products || [];
    return products.filter(product => product.category_id === categoryId);
};

export const ProductCardsService = { getProductCards, addToCart, getProductByCategory };
