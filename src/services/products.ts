import { BASE_URL } from "./BASE_URL";
import axios from "axios";
import { Product } from "@/datas/products";

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

    const response = await axios.post( // Tetap gunakan .post
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

//fungsi handle is_non_stock
const toggleStockStatus = async (outletId: string, productId: string, newStatus: boolean): Promise<Product> => {
    const response = await axios.patch( // Gunakan .patch jika backend membuatnya dengan method PATCH
        `${BASE_URL}/outlets/${outletId}/products/${productId}/toggle-stock-status`,
        { is_non_stock: newStatus }, // Kirim data simpel, bukan FormData
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data.product;
};

export const ProductService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleStockStatus,
};