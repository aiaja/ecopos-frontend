"use client";

import { RoleForm } from "@/components/users/role/role-form";

// Perhatikan bagaimana kita mendefinisikan props yang diterima halaman ini
interface EditRolePageProps {
  params: {
    roleId: string; // Properti ini harus sama dengan nama folder dinamismu: [roleId]
  };
}

// Komponen halaman sekarang menerima 'params'
export default function EditRolePage({ params }: EditRolePageProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Kita render RoleForm dan berikan 2 props penting:
        1. mode="edit" -> Memberitahu RoleForm untuk berperilaku sebagai form edit.
        2. rolesId={params.roleId} -> Memberikan ID yang kita dapat dari URL ke RoleForm.
      */}
      <RoleForm mode="edit" rolesId={params.roleId} />
    </div>
  );
}