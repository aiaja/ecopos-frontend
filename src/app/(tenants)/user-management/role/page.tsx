"use client"

import { useEffect, useState } from "react";
import { Role } from "@/datas/roles";
import { RoleService } from "@/services/role";
import { RolesTable } from "@/components/users/role/role-table";
import { toast } from "sonner";

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchRoles = async () => {
        setIsLoading(true);
        try {
            // Asumsi RoleService tidak butuh outletId
            const data = await RoleService.getRoles();
            setRoles(data || []); // Masukkan data ke dalam state, fallback ke array kosong
        } catch (error: any) {
            toast.error(error.message);
            setRoles([]); // Kosongkan data jika gagal
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleDeleteRole = async (id: number) => {
        const performDelete = async () => {
            try {
                await RoleService.deleteRole(id.toString());
                toast.success("Role berhasil dihapus!");
                fetchRoles(); // Refresh data setelah berhasil
            } catch (error: any) {
                toast.error(error.message);
            }
        };

        toast("Konfirmasi Penghapusan", {
            description: `Apakah Anda yakin ingin menghapus role ini (ID: ${id})?`,
            action: {
                label: "Hapus",
                onClick: () => performDelete(),
            },
            cancel: {
                label: "Batal",
                onClick: () => {},
            },
            duration: Infinity,
        });
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <RolesTable roles={roles} onDelete={handleDeleteRole} />
        </div>
    );
}