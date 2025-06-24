// voucherSchema.ts
import { z } from "zod";

export const voucherSchema = z.object({
  id: z.string(),
  outlet_id: z.string(),
  code: z.string().min(2, { message: "Code is required" }),
  name: z.string().min(2, { message: "Name is required" }),
  type: z.string().min(2, { message: "Type is required" }),
  nominal: z.number().min(0, { message: "Nominal must be a number" }), // Use number instead of string
  start_date: z.string().min(2, { message: "Start date is required" }),
  expired_date: z.string().min(2, { message: "Expired date is required" }),
  minimum_buying: z.number().min(0, { message: "Minimum Buying must be a number" }), // Use number instead of string
  status: z.string().min(2, { message: "Status is required" }),
});


export interface Voucher {
  id: string;
  outlet_id: string;
  code: string;
  name: string;
  type: string;
  nominal: number;
  start_date: string;
  expired_date: string;
  minimum_buying: number;
  status: string;
}

