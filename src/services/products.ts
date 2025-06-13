import { BASE_URL } from "./BASE_URL";
import axios from "axios";
import { Category } from "@/datas/categories";

export type Product = {
  id?: string;
  name: string;
  stock: number;
  initial_price: number;
  selling_price: number;
  unit: string;
  hero_image?: string | null;
  outlet_id?: string;
  category_id: string;
  category?: Category;
};

// Menggunakan 'fetch' untuk GET ALL
const getProducts = async (outletId: string): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/outlets/${outletId}/products`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const data = await response.json();
  return data.products;
};

// Menggunakan 'axios' untuk GET BY ID
const getProductById = async (outletId: string, id: string): Promise<Product> => {
  const response = await axios.get(
    `${BASE_URL}/outlets/${outletId}/products/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.data || !response.data.product) {
    throw new Error("Product not found");
  }
  return response.data.product;
};

// Menggunakan 'axios' dan 'FormData' untuk Create (karena ada file gambar)
const createProduct = async (outletId: string, productData: FormData): Promise<Product> => {
  const response = await axios.post(
    `${BASE_URL}/outlets/${outletId}/products`,
    productData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data.product;
};

// Menggunakan 'axios' dan 'FormData' untuk Update
const updateProduct = async (outletId: string, productId: string, productData: FormData): Promise<Product> => {
  const response = await axios.post(
    `${BASE_URL}/outlets/${outletId}/products/${productId}`,
    productData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data.product;
};

// Menggunakan 'fetch' untuk DELETE
const deleteProduct = async (outletId: string, id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/outlets/${outletId}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
};

export const ProductService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};