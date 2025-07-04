"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

// Import tipe data dan service yang diperlukan
import type { Permission } from "@/datas/permissions";
import { PermissionService } from "@/services/permission"; // Asumsi service ini ada
import { RoleService } from "@/services/role";

// Import komponen UI
import { PermissionTable } from "@/components/users/permission/permission-table";

// Komponen untuk menampilkan pesan loading (bisa diganti dengan spinner)
function LoadingState() {
  return <div className="flex justify-center items-center h-screen">Loading permissions...</div>;
}

// Komponen untuk menampilkan pesan error
function ErrorState({ message }: { message: string }) {
  return <div className="flex justify-center items-center h-screen text-red-500">{message}</div>;
}

export default function PermissionsPage() {
  // State untuk semua permission
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  // State untuk permission milik user
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect untuk mengambil semua data yang dibutuhkan saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Reset error setiap kali fetch dimulai

      try {
        const roleId = localStorage.getItem("role_id");
        if (!roleId) {
          throw new Error("Sesi tidak valid. Silakan login kembali.");
        }

        // Menggunakan Promise.all untuk mengambil data secara paralel (lebih cepat)
        const [allPermissionsData, userRoleData] = await Promise.all([
          PermissionService.getPermissions(),
          RoleService.getRoleById(roleId),
        ]);

        setAllPermissions(allPermissionsData);
        setUserPermissions(userRoleData.permissions || []); // Ambil array permissions dari role

      } catch (err: any) {
        const errorMessage = err.message || "Gagal memuat data.";
        setError(errorMessage);
        toast.error(errorMessage);
        setAllPermissions([]); // Kosongkan data jika gagal
        setUserPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Dependensi kosong agar hanya berjalan sekali

  // Tampilkan loading jika data belum siap
  if (isLoading) {
    return <LoadingState />;
  }

  // Tampilkan error jika terjadi kegagalan fetch
  if (error) {
    return <ErrorState message={error} />;
  }

  // Jika data sudah siap, tampilkan komponen tabel
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Kirimkan 'allPermissions' dan 'userPermissions' sebagai props */}
      <PermissionTable 
        permissions={allPermissions} 
        userPermissions={userPermissions} 
      />
    </div>
  );
}