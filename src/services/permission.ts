import { BASE_URL } from "./BASE_URL";
import { Permission } from "@/datas/permissions";

const getPermissions = async (): Promise<Permission[]> => {
    const response = await fetch(`${BASE_URL}/permissions`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch permissions');
    }

    const data = await response.json();
    return data.permissions; 
}

export const PermissionService = {
    getPermissions,
}