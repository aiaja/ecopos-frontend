import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string()
    .min(1, { message: "Email tidak boleh kosong." })
    .email({ message: "Format email tidak valid." }),
  password: z.string()
    .min(1, { message: "Password tidak boleh kosong." })
    .min(6, { message: "Password minimal 6 karakter." })
});

export type LoginSchemaValues = z.infer<typeof LoginSchema>;