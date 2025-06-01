import { z } from "zod";


export const userSchema = z.object({
  name: z.string().min(3, { message: "Nama harus memiliki minimal 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  phone: z.string().min(10, { message: "Nomor telepon minimal 10 digit." }),
  address: z.string().min(5, { message: "Alamat minimal 5 karakter." }),
  role: z.string({ required_error: "Role harus dipilih." }),
  password: z.string().min(8, "Password minimal 8 karakter.").optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
})
.refine(data => {
    if (data.password) {
      return data.password === data.confirmPassword;
    }
    return true;
  }, {
    message: "Password tidak cocok!",
    path: ["confirmPassword"],
});

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  isOwner: boolean;
}

const users: User[] = [
  {
    id: 1,
    name: "Super Admin",
    email: "superadmin@example.com",
    phone: "081234567890",
    address: "Jl. Merdeka No. 1, Jakarta",
    role: "admin",
    isOwner: true,
  },
  {
    id: 2,
    name: "Budi Staff",
    email: "budi.staff@example.com",
    phone: "089876543210",
    address: "Jl. Sudirman No. 12, Bandung",
    role: "staff",
    isOwner: false,
  },
];

export default users;