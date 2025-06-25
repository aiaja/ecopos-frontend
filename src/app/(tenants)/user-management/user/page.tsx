"use client";

import { UsersTable } from "@/components/users/user/user-table";
import { useEffect, useState } from "react";
import { User } from "@/datas/users";
import { UserService } from "@/services/user";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fungsi untuk mengambil data user dari API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await UserService.getUsers();
      setUsers(response || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

   // Fungsi untuk menangani penghapusan user
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await UserService.deleteUser(userId);
        alert("User deleted successfully!");
        fetchUsers(); // Ambil ulang data terbaru
      } catch (error: any) {
        console.error("Failed to delete user:", error);
        alert(error.message || "Failed to delete user.");
      }
    }
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
