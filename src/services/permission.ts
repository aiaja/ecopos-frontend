import { BASE_URL } from "./BASE_URL";
import { Permission } from "@/datas/permissions";
import axios from "axios";

// Helper untuk mengekstrak pesan error dari Axios
const getAxiosErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data.message || "An unexpected error occurred.";
  }
  return "An unexpected network error occurred.";
};

const getPermissions = async (): Promise<Permission[]> => {
    const response = await fetch(`${BASE_URL}/permissions`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch permissions');
    }

    const data = await response.json();
    return data.permissions; 
}

export const PermissionService = {
    getPermissions,
}