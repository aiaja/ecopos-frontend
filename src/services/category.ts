import { BASE_URL } from "./BASE_URL"
import axios from "axios";
import { Category } from "@/datas/categories";

type CategoryPayload = Omit<Category, 'id' | 'outlet_id'>;

const getCategories = async (outletId: string): Promise<Category[]> => {
    const response = await fetch(`${BASE_URL}/outlets/${outletId}/categories`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.categories;
}

const getCategoryById = async (outletId:string, id: string): Promise<Category> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.get(`${BASE_URL}/outlets/${outletId}/categories/${id}`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.category) {
        throw new Error('Category not found');
    }
    const data = await response.data;
    return data.category;

}

const createCategory = async (outletId: string, category: Omit<Category, 'id'>): Promise<Category> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.post(`${BASE_URL}/outlets/${outletId}/categories`, {
        ...category,
        outlet_id: outletId,
    }, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.category) {
        throw new Error('Failed to create category');
    }
    const data = await response.data;
    return data.category;
}

const updateCategory = async (outletId: string, id: string, category: Omit<Category, 'id'>): Promise<Category> => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.put(`${BASE_URL}/outlets/${outletId}/categories/${id}`, {
        ...category,
        outlet_id: outletId,
    }, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.category) {
        throw new Error('Failed to update category');
    }
    const data = await response.data;
    return data.category;
}

const deleteCategory = async (outletId: string, id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/outlets/${outletId}/categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
        let errorMessage = 'Failed to delete category.';
        try {
            const errorData = await response.json();
            errorMessage = `Error ${response.status}: ${errorData.message || 'Unknown server error'}`;
        } catch (e) {
            errorMessage = `Failed with status: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }
}

export const CategoryService = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
}