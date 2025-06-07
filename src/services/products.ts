import { Category } from "@/datas/categories";
import { BASE_URL } from "./BASE_URL"
import axios from "axios";

type Product = {
  id: string;
  outlet_id: string;
  category_id: string | null;
  name: string;
  stock: number;
  is_non_stock: boolean;
  initial_price: string;
  selling_price: string;
  unit: string | null;
  hero_images: string | null;
  category: Category;
};

const getProducts = async (outletId: string): Promise<Product[]> => {
    const response = await fetch(`${BASE_URL}/outlets/${outletId}/products`, {
        method: 'GET',
        headers: {  
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        }
    );
    if (response.status === 500) {
        throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.products;
}

const getProductById = async (outletId:string, id: string): Promise<Product> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.get(`${BASE_URL}/outlets/${outletId}/products/${id}`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.category) {
        throw new Error('Product not found');
    }
    const data = await response.data;
    return data.product;
}

const createProduct = async (outletId: string, product: Omit<Product, 'id'>): Promise<Product> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.post(`${BASE_URL}/outlets/${outletId}/products`, {
        ...product,
        outlet_id: outletId,
    }, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.product) {
        throw new Error('Failed to create product');
    }
    const data = await response.data;
    return data.product;
}

const updateProduct = async (outletId: string, id: string, product: Omit<Product, 'id'>): Promise<Product> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.put(`${BASE_URL}/outlets/${outletId}/products/${id}`, {
        ...product,
        outlet_id: outletId,
    }, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.product) {
        throw new Error('Failed to update product');
    }
    const data = await response.data;
    return data.product;
}

const deleteProduct = async (outletId: string, id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/outlets/${outletId}/products/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete product');
    }
}

export const ProductService = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
}