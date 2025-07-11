import { BASE_URL } from "./BASE_URL"
import axios from "axios";
import { Category } from "@/datas/categories";

// Helper untuk mengekstrak pesan error dari Axios
const getAxiosErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error) && error.response) {
    // Pesan error dari body response backend, e.g., { message: "Role Denied" }
    return error.response.data.message || "An unexpected error occurred.";
  }
  return "An unexpected network error occurred.";
};

// Menggunakan 'fetch' untuk GET ALL
const getCategories = async (outletId: string): Promise<Category[]> => {
    const response = await fetch(`${BASE_URL}/outlets/${outletId}/categories`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
        },
    });
    if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || "Terjadi kesalahan pada server.");
    }
    const data = await response.json();
    return data.categories;
};

// Menggunakan 'axios' untuk GET BY ID
const getCategoryById = async (outletId:string, id: string): Promise<Category> => {
    try{
        const response = await axios.get(
            `${BASE_URL}/outlets/${outletId}/categories/${id}`, 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        );
        if (!response.data || !response.data.category) {
            throw new Error('Category not found');
        }
        const data = await response.data;
        return data.category;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
};

// Menggunakan 'axios'
const createCategory = async (outletId: string, category: Omit<Category, 'id'>): Promise<Category> => {
    try{
        const response = await axios.post(
            `${BASE_URL}/outlets/${outletId}/categories`,
            {
                ...category,
                outlet_id: outletId,
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            }
        );
        if (!response.data || !response.data.category) {
            throw new Error('Failed to create category');
        }
        const data = await response.data;
        return data.category;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
};

// Menggunakan 'axios'
const updateCategory = async (outletId: string, id: string, category: Omit<Category, 'id'>): Promise<Category> => {
    try{
        const response = await axios.put(
            `${BASE_URL}/outlets/${outletId}/categories/${id}`,
            {
                ...category,
                outlet_id: outletId,
            }, 
            {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        if (!response.data || !response.data.category) {
            throw new Error('Failed to update category');
        }
        const data = await response.data;
        return data.category;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
};

// Menggunakan 'fetch' untuk DELETE
const deleteCategory = async (outletId: string, id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/outlets/${outletId}/categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to delete Category." }));
        throw new Error(errorData.message);
    }
};

export const CategoryService = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};