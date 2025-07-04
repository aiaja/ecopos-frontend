"use client";

import { use, useEffect } from "react";
import { useParams } from 'next/navigation';
import { RoleForm } from "@/components/users/role/role-form";

export default function EditRolePage() {

  const params = useParams();
  const roleId = params.roleId as string;

  return (
    <div className="flex flex-col gap-4 p-4">
      <RoleForm mode="edit" rolesId={roleId} />
    </div>
  );
}
