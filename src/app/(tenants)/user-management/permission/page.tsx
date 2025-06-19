// File: src/app/(tenants)/user-management/permission/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Permission } from "@/datas/permissions";
import { PermissionService } from "@/services/permission";
import { PermissionTable } from "@/components/users/permission/permission-table";

export default function PermissionsPage() {
    // Siapkan state untuk menampung data permissions dan status loading
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fungsi untuk mengambil data dari API
    const fetchPermissions = async () => {
        setIsLoading(true);
        try {
            const data = await PermissionService.getPermissions();
            setPermissions(data);
        } catch (error) {
            console.error("Failed to fetch permissions:", error);
            alert("Gagal memuat data permissions.");
        } finally {
            setIsLoading(false);
        }
    };

    // Panggil fungsi fetchPermissions saat komponen pertama kali dimuat
    useEffect(() => {
        fetchPermissions();
    }, []);

    // Tampilkan loading jika data belum siap
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading permissions...</div>;
    }

    // Jika data sudah siap, tampilkan komponen tabel dan kirimkan data sebagai props
    return (
        <div className="flex flex-col gap-4 p-4">
            <PermissionTable permissions={permissions} />
        </div>
    );
}