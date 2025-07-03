import { BASE_URL } from "./BASE_URL";
import axios from "axios";
import { Outlet } from "@/datas/outlets";

type OutletPayload = {
    outlet_name: string;
    address: string;
    phone_number: string;
    tax?: number;
};

// Helper untuk mengekstrak pesan error dari Axios
const getAxiosErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data.message || "An unexpected error occurred.";
  }
  return "An unexpected network error occurred.";
};

const getOutlets = async (): Promise<Outlet[]> => {
    const response = await fetch(`${BASE_URL}/outlets`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
         const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch outlets');
    }

    const data = await response.json();
    return data.outlets || []; // Kembalikan array kosong jika tidak ada outlets
}

const getOutletById = async (id: string): Promise<Outlet> => {
    try {
        const response = await axios.get(`${BASE_URL}/outlets/${id}`, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json',
            },
        });


        const outletData = response.data.outlet || response.data;

        if (!outletData || !outletData.id) {
            throw new Error('Outlet data not found in API response.');
        }
        return outletData;

    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

const updateOutlet = async (id: string, outletData: Partial<OutletPayload>): Promise<Outlet> => {
    try {
        const response = await axios.put(`${BASE_URL}/outlets/${id}`, outletData, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const updatedData = response.data.outlet || response.data;

        if (!updatedData || !updatedData.id) {
            throw new Error('Failed to get updated outlet data from API response.');
        }
        return updatedData;

    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

export const OutletService = {
    getOutlets,
    getOutletById,
    updateOutlet,
}