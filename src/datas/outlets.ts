import { z } from "zod";

// Interface ini mendefinisikan bentuk data Outlet sesuai API
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

// Skema Zod ini untuk validasi form Outlet nanti (kita siapkan sekarang)
export const outletSchema = z.object({
  outlet_name: z.string().min(3, "Outlet name is required and must be at least 3 characters."),
  address: z.string().min(5, "Address is required."),
  phone_number: z.string().min(10, "Phone number is required."),
  tax: z.coerce.number().min(0).optional(),
});