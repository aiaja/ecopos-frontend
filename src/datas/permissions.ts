export interface Permission {
  id: number;
  name: string;
  guard_name: string; // Perhatikan, di API menggunakan snake_case
  created_at: string;
  updated_at: string;
}