import { z } from "zod";

// Zod schema for voucher request (data sent when creating a voucher)
export const voucherSchema = z.object({    
  code: z.string().min(2, { message: "Code is required" }),
  name: z.string().min(3, { message: "Voucher name is required" }),
  type: z.string().min(2, { message: "Type must be 'percentage' or 'nominal'" }),
  nominal: z.string().refine(value => !isNaN(Number(value)) && Number(value) > 0, {
    message: "Nominal must be a positive number",
  }),
  start_date: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: "Start date is invalid",
  }),
  expired_date: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: "Expired date is invalid",
  }),
  minimum_buying: z.string().refine(value => !isNaN(Number(value)) && Number(value) > 0, {
    message: "Minimum buying amount must be a positive number",
  }),
  status: z.string().min(2, { message: "Status must be 'active' or 'inactive'" }),
});

export interface Voucher {
    id: string;
  code: string;
  name: string;
  type: string;
  nominal: string;  // Nominal value in string format (to handle both percentage and nominal values)
  start_date: string;  // Date in 'YYYY-MM-DD' format
  expired_date: string;  // Date in 'YYYY-MM-DD' format
  minimum_buying: string;  // Minimum purchase required in string format
  status: string;
}

export const vouchers: Voucher[] = [
    { 
        id: "string",
  code: "string",
  name: "string",
  type: 'percentage',
  nominal: "10",
  start_date: "2025-10-11",  // Date in 'YYYY-MM-DD' format,
  expired_date: "2025-11-10",
  minimum_buying: "10000",
  status: 'active',
}
];