import { BASE_URL } from "./BASE_URL";
// Kita pakai interface Outlet yang baru saja kita buat
import { Outlet } from "@/datas/outlets";

/**
 * Mengambil semua data outlet dari backend.
 * Fungsi ini akan kita pakai untuk mengisi dropdown di form user.
 */
const getOutlets = async (): Promise<Outlet[]> => {
    const response = await fetch(`${BASE_URL}/outlets`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch outlets');
    }

    const data = await response.json();
    return data.outlets || []; // Kembalikan array kosong jika tidak ada outlets
}

export const OutletService = {
    getOutlets,
}