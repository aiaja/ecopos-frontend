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

// Helper untuk mengekstrak pesan error dari Axios
const getAxiosErrorMessage = (error: any): string => {
    if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data;
        if (typeof data === 'string') return data;
        if (data?.message) return data.message;
    }
    return "An unexpected network error occurred.";
};

// GET ALL USERS - fetch
const getUsers = async (): Promise<User[]> => {
    try {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch users');
        }

        const data = await response.json();
        return data.users;
    } catch (error: any) {
        throw new Error(error.message || 'An unexpected error occurred while fetching users.');
    }
};

// GET USER BY ID - axios
const getUserById = async (id: string): Promise<User> => {
    try {
        const response = await axios.get(`${BASE_URL}/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json',
            },
        });

        const userData = response.data.user || response.data.users;

        if (!userData || typeof userData !== 'object' || !userData.id) {
            throw new Error('User data not found or invalid in API response.');
        }

        return userData;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
};

// CREATE USER - axios
const createUser = async (userData: ApiUserPayload): Promise<User> => {
    try {
        const response = await axios.post(`${BASE_URL}/users`, userData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const createdUser = response.data.user || response.data.users;

        if (!createdUser || typeof createdUser !== 'object') {
            throw new Error('Failed to create user: Invalid response structure');
        }

        return createdUser;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
};

// UPDATE USER - axios
const updateUser = async (id: string, userData: Partial<ApiUserPayload>): Promise<User> => {
    try {
        const response = await axios.put(`${BASE_URL}/users/${id}`, userData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const updatedUser = response.data.user || response.data.users;

        if (!updatedUser || typeof updatedUser !== 'object') {
            throw new Error('Failed to update user: Invalid response structure');
        }

        return updatedUser;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
};

// DELETE USER - fetch
const deleteUser = async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to delete user." }));
        throw new Error(errorData.message);
    }
};

export const UserService = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
