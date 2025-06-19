import { BASE_URL } from "./BASE_URL";
import axios from "axios";
import { Role } from "@/datas/roles";

type RolePayload = {
    name: string;
    permissions: string[];
}


const getRoles = async (): Promise<Role[]> => {
    const response = await fetch(`${BASE_URL}/roles`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) throw new Error('Failed to fetch roles');
    const data = await response.json();
    return data.roles;
}

const getRoleById = async (id: string): Promise<Role> => {
    const response = await axios.get(`${BASE_URL}/roles/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.data || !response.data.role) throw new Error('Role not found');
    return response.data.role; // Asumsi response: { role: { id, name, permissions: [...] } }
}

const createRole = async (roleData: RolePayload): Promise<Role> => {
    const response = await axios.post(`${BASE_URL}/roles`, roleData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.data || !response.data.role) throw new Error('Failed to create role');
    return response.data.role;
}

const updateRole = async (id: string, roleData: RolePayload): Promise<Role> => {
    const response = await axios.put(`${BASE_URL}/roles/${id}`, roleData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.data || !response.data.role) throw new Error('Failed to update role');
    return response.data.role;
}

const deleteRole = async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/roles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to delete role');
}

export const RoleService = {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
};