import { z } from "zod";

export const roleSchema = z.object({
  id: z.string(),
  name: z.string().min(3, { message: "Nama harus memiliki minimal 3 karakter." }),
})

export interface Role {
  value: string;
  label: string;
}

const roles: Role[] = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "staff", label: "Staff" },
  { value: "viewer", label: "Viewer" },
];

export default roles;