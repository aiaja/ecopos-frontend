import { BASE_URL } from "./BASE_URL";
import axios from "axios";
import { User } from "@/datas/users"; 

// Tipe data payload yang dikirim ke API.
type ApiUserPayload = {
    username: string;
    email: string;
    role: string; 
    outlet_id?: string | null;
    password?: string;
    password_confirmation?: string; 
};

/**
 * Mengambil semua data user dari backend
 */
const getUsers = async (): Promise<User[]> => {
    const response = await fetch(`${BASE_URL}/users`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data.users;
}

/**
 * Mengambil detail satu user berdasarkan ID
 */
const getUserById = async (id: string): Promise<User> => {
    const response = await axios.get(`${BASE_URL}/users/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.data) {
        throw new Error('No data received from server');
    }

    // --- PERBAIKAN FINAL BERDASARKAN JSON BARU ---
    // Berdasarkan respons API, objek user ada di dalam `response.data.users`
    const userData = response.data.users;

    // Validasi akhir untuk memastikan objek user-nya valid
    if (!userData || typeof userData !== 'object' || !userData.id) {
         const backendMessage = response.data.message || 'The API response does not contain a valid user object inside the "users" property.';
         throw new Error(`Failed to get user details: ${backendMessage}`);
    }

    return userData;
}


/**
 * Membuat user baru
 */
const createUser = async (userData: ApiUserPayload): Promise<User> => {
    const response = await axios.post(`${BASE_URL}/users`, userData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.user) {
        throw new Error('Failed to create user');
    }
    return response.data.user;
}

/**
 * Mengupdate data user
 */
const updateUser = async (id: string, userData: Partial<ApiUserPayload>): Promise<User> => {
    const response = await axios.put(`${BASE_URL}/users/${id}`, userData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.data || !response.data.user) {
        throw new Error('Failed to update user');
    }
    return response.data.user;
}

/**
 * Menghapus user
 */
const deleteUser = async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (!response.ok) {
        let errorMessage = 'Failed to delete user.';
        try {
            const errorData = await response.json();
            errorMessage = `Error ${response.status}: ${errorData.message || 'Unknown server error'}`;
        } catch (e) {
            errorMessage = `Failed with status: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }
}

// Kumpulkan semua fungsi ke dalam satu object
export const UserService = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
