import { BASE_URL } from "../BASE_URL";
import axios from "axios";

type ProductCard = {
    id?: string;
    name?: string;
    hero_images?: string;
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
    hero_images?: string;
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
    // Set default hero_images if null or undefined
    return (response.data.products as ProductCard[]).map(product => ({
        ...product,
        hero_images: product.hero_images ?? "/product_default.svg"
    }));
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
    // Filter products by category_id on the client side and set default hero_images if null or undefined
    const products: ProductByCategory[] = response.data.products || [];
    return products
        .filter(product => product.category_id === categoryId)
        .map(product => ({
            ...product,
            hero_images: product.hero_images ?? "/product_default.svg"
        }));
};

export const ProductCardsService = { getProductCards, addToCart, getProductByCategory };
