import { BASE_URL } from "./BASE_URL";
import axios from "axios";
import { User } from "@/datas/users"; 

// Tipe data untuk payload saat membuat atau mengupdate User
// Ini harus cocok dengan `userSchema` di file `datas/users.ts`
type UserPayload = {
    username: string;
    email: string;
    role_ids: string[]; // Backend kemungkinan mengharapkan array of ID
    password?: string; // Opsional, hanya untuk create atau saat ganti password
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
    return data.users; // Sesuai struktur API-mu
}

/**
 * Mengambil detail satu user berdasarkan ID
 */
const getUserById = async (id: string): Promise<User> => {
    const response = await axios.get(`${BASE_URL}/users/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.data || !response.data.user) {
        throw new Error('User not found');
    }
    // Asumsi backend mengirim { user: { ... } }
    return response.data.user;
}

/**
 * Membuat user baru
 */
const createUser = async (userData: UserPayload): Promise<User> => {
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
const updateUser = async (id: string, userData: Partial<UserPayload>): Promise<User> => {
    // Jika password kosong, hapus dari payload agar tidak mengupdate password jadi kosong
    if (userData.password === '') {
        delete userData.password;
    }

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