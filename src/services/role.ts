import { BASE_URL } from "./BASE_URL";
import axios from "axios";
import { Role } from "@/datas/roles";

type RolePayload = {
    name: string;
    permissions: string[];
}

// Helper untuk mengekstrak pesan error dari Axios
const getAxiosErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data.message || "An unexpected error occurred.";
  }
  return "An unexpected network error occurred.";
};

const getRoles = async (): Promise<Role[]> => {
    const response = await fetch(`${BASE_URL}/roles`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch roles');
    }
    const data = await response.json();
    return data.roles;
}

const getRoleById = async (id: string): Promise<Role> => {
    try {
        const response = await axios.get(`${BASE_URL}/roles/${id}`, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json',
            },
        });
        if (!response.data || !response.data.role) {
            throw new Error('Role not found');
        }
        return response.data.role;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

const createRole = async (roleData: RolePayload): Promise<Role> => {
    try {
        const response = await axios.post(`${BASE_URL}/roles`, roleData, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        if (!response.data || !response.data.role) {
            throw new Error('Failed to create role');
        }
        return response.data.role;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

const updateRole = async (id: string, roleData: RolePayload): Promise<Role> => {
    try {
        const response = await axios.put(`${BASE_URL}/roles/${id}`, roleData, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        if (!response.data || !response.data.role) {
            throw new Error('Failed to update role');
        }
        return response.data.role;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

const deleteRole = async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/roles/${id}`, {
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
        },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to delete role." }));
        throw new Error(errorData.message);
    }
}


export const RoleService = {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
};