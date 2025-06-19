import { z } from "zod";
import { Permission } from "./permissions"; // Kita butuh tipe Permission di sini

// Skema ini HANYA untuk validasi input di form.
// Hanya ada 'name' karena 'permissions' kita kelola dengan checkbox, bukan input langsung.
export const roleSchema = z.object({
  name: z.string().min(3, { message: "Role name must be at least 3 characters." }),
});

// Interface ini mendefinisikan bentuk data 'Role' yang kita terima dari backend.
// Ini harus cocok dengan response API di Postman.
export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  // Ini properti PENTING yang kita harapkan ada saat mengambil detail satu role,
  // untuk mengisi checkbox di form edit.
  permissions?: Permission[]; 
}