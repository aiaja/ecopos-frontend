"use client"

import { useEffect, useState } from "react";
import { Role } from "@/datas/roles";
import { RoleService } from "@/services/role";
import { RolesTable } from "@/components/users/role/role-table"; // Pastikan nama import-nya jamak: RolesTable

// Ganti nama fungsi default agar lebih deskriptif
export default function RolesPage() {
    // 1. Siapkan "wadah" (state) untuk menampung data roles dan status loading
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 2. Buat fungsi untuk "mencari sinyal" (mengambil data dari API)
    const fetchRoles = async () => {
        setIsLoading(true);
        try {
            const data = await RoleService.getRoles();
            setRoles(data); // Masukkan data ke dalam state
        } catch (error) {
            console.error("Failed to fetch roles:", error);
            alert("Gagal memuat data roles.");
        } finally {
            setIsLoading(false); // Selesai loading, baik berhasil maupun gagal
        }
    };

    // 3. Jalankan fungsi pencari sinyal saat komponen pertama kali dimuat
    useEffect(() => {
        fetchRoles();
    }, []); // Array kosong berarti hanya dijalankan sekali

    // 4. Buat fungsi untuk "aksi remote" (menangani saat tombol delete diklik)
    const handleDeleteRole = async (id: number) => {
        if (window.confirm(`Yakin ingin menghapus role dengan ID: ${id}?`)) {
            try {
                await RoleService.deleteRole(id.toString());
                alert("Role berhasil dihapus!");
                // Ambil ulang data terbaru dari server untuk merefresh tabel
                fetchRoles();
            } catch (error) {
                console.error("Failed to delete role:", error);
                alert("Gagal menghapus role.");
            }
        }
    };

    // Tampilkan pesan loading selagi "mencari sinyal"
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // 5. Setelah sinyal didapat, tampilkan TV dan berikan "sinyal" serta "remote"-nya
    return (
        <div className="flex flex-col gap-4 p-4">
            <RolesTable roles={roles} onDelete={handleDeleteRole} />
        </div>
    );
}