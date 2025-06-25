import { z } from "zod";

// Skema dasar yang berlaku untuk create dan update
const baseUserSchema = z.object({
  username: z.string().min(3, { message: "Username harus memiliki minimal 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  // Saat mengirim, kita akan kirim array ID dari role yang dipilih.
  // Kita pakai string karena value dari <Select> biasanya string.
  role_id: z.string().min(1, { message: "Role harus dipilih." }),
  outlet_id: z.string().optional(),
});

// Skema KHUSUS untuk MEMBUAT user baru
export const createUserSchema = baseUserSchema.extend({
  // Di sini, password WAJIB diisi
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Password tidak cocok!",
    path: ["confirmPassword"],
});

// Skema KHUSUS untuk MENGUPDATE user
export const updateUserSchema = baseUserSchema.extend({
  // Di sini, password OPSIONAL. Hanya divalidasi jika diisi.
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
    // Jika password diisi, pastikan cocok dengan konfirmasi
    if (data.password && data.password.length > 0) {
      return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Password tidak cocok!",
    path: ["confirmPassword"],
}).refine(data => {
    // Jika password diisi, pastikan panjangnya cukup
    if (data.password && data.password.length > 0) {
        return data.password.length >= 6;
    }
    return true;
}, {
    message: "Password minimal 6 karakter.",
    path: ["password"],
});

export interface User {
  id: string;
  outlet_id: string | null;
  username: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  outlet: Outlet | null;
  roles: Role[];
}

export interface Outlet {
    id: string;
    outlet_name: string;
    address: string;
    phone_number: string;
    latitude: string | null;
    longitude: string | null;
    email: string | null;
    tax: string;
    created_at: string;
    updated_at: string | null;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}