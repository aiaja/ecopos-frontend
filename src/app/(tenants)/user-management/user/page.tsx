"use client";

import { UsersTable } from "@/components/users/user/user-table";
import { useEffect, useState } from "react";
import { User } from "@/datas/users";
import { UserService } from "@/services/user";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fungsi untuk mengambil data user dari API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await UserService.getUsers();
      setUsers(response || []);
    } catch (error: any) {
      toast.error(error.message || "Gagal memuat data pengguna.");
      setUsers([]); // Kosongkan data jika gagal
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fungsi untuk menangani penghapusan user
  const handleDeleteUser = async (userId: string) => {
    const performDelete = async () => {
      try {
        await UserService.deleteUser(userId);
        toast.success("Pengguna berhasil dihapus!");
        fetchUsers();
      } catch (error: any) {
        toast.error(error.message || "Gagal menghapus pengguna.");
      }
    };

    toast("Konfirmasi Penghapusan", {
        description: "Apakah Anda yakin ingin menghapus pengguna ini?",
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
      <UsersTable users={users} onDelete={handleDeleteUser} />
    </div>
  );
}
