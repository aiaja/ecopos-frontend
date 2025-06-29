import { BASE_URL } from "./BASE_URL";
import axios from "axios";
import { Product } from "@/datas/products";

// Helper untuk mengekstrak pesan error dari Axios
const getAxiosErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error) && error.response) {
    // Pesan error dari body response backend, e.g., { message: "Role Denied" }
    return error.response.data.message || "An unexpected error occurred.";
  }
  return "An unexpected network error occurred.";
};

// Menggunakan 'fetch' untuk GET ALL
const getProducts = async (outletId: string): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/outlets/${outletId}/products`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json(); 
    throw new Error(errorData.message || "Terjadi kesalahan pada server.");
  }
  
  const data = await response.json();
  return data.products;
};

// Menggunakan 'axios' untuk GET BY ID
const getProductById = async (outletId: string, id: string): Promise<Product> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/outlets/${outletId}/products/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Accept': 'application/json',
        },
      }
    );
    // Cek data product bisa dipindah ke sini
    if (!response.data || !response.data.product) {
      throw new Error("Product not found");
    }
    return response.data.product;
  } catch (error) {
    // Gunakan helper untuk standarisasi error
    throw new Error(getAxiosErrorMessage(error));
  }
};

// Menggunakan 'axios' dan 'FormData' untuk Create (karena ada file gambar)
const createProduct = async (outletId: string, productData: FormData): Promise<Product> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/outlets/${outletId}/products`,
      productData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Accept': 'application/json',
        },
      }
    );
    if (!response.data || !response.data.product) {
            throw new Error('Failed to create product');
        }
        const data = await response.data;
        return data.product;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
};


// Menggunakan 'axios' dan 'FormData' untuk Update
const updateProduct = async (outletId: string, productId: string, productData: FormData): Promise<Product> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/outlets/${outletId}/products/${productId}`,
      productData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Accept': 'application/json',
        },
      }
    );
    return response.data.product;
  } catch (error) {
    throw new Error(getAxiosErrorMessage(error));
  }
};

// Menggunakan 'fetch' untuk DELETE
const deleteProduct = async (outletId: string, id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/outlets/${outletId}/products/${id}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to delete product." }));
    throw new Error(errorData.message);
  }
};

//fungsi handle is_non_stock
const toggleStockStatus = async (outletId: string, productId: string, newStatus: boolean): Promise<Product> => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/outlets/${outletId}/products/${productId}/toggle-stock-status`,
      { is_non_stock: newStatus },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    return response.data.product;
  } catch (error) {
    throw new Error(getAxiosErrorMessage(error));
  }
};

export const ProductService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleStockStatus,
};