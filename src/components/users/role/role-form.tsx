"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { roleSchema } from "@/datas/roles";
import { Search } from "@/components/ui/search";
import users from '@/datas/users';
import roles from '@/datas/roles';
import { permissionsWeb, permissionsMobile, Permission } from '@/datas/permissions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function RoleForm({ mode = "create", rolesId }: { mode?: "create" | "edit"; rolesId?: string }) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set());

  // Combine permissions and group by guardName
  const allPermissions = [...permissionsWeb, ...permissionsMobile];

  // Filter permissions based on search query
  useEffect(() => {
    const filtered = allPermissions.filter((perm) =>
      perm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perm.guardName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPermissions(filtered);
  }, [searchQuery]);

  // Default form values including permissions
  let defaultValues = {
    id: "",
    name: "",
    permissions: [] as number[],
  };

  // If edit mode, load role data and permissions
  useEffect(() => {
    if (mode === "edit" && rolesId) {
      const roleToEdit = roles.find((role) => role.value === rolesId);
      if (roleToEdit) {
        defaultValues = {
          id: roleToEdit.value,
          name: roleToEdit.label,
          permissions: [], // TODO: load actual permissions for the role if available
        };
        setSelectedPermissions(new Set(defaultValues.permissions));
        form.reset(defaultValues);
      }
    }
  }, [mode, rolesId]);

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues,
  });

  function togglePermission(id: number) {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPermissions(newSelected);
  }

  function handleSubmit(values: z.infer<typeof roleSchema>) {
    const dataToSubmit = {
      ...values,
      permissions: Array.from(selectedPermissions),
    };
    console.log("Data yang di-submit:", dataToSubmit);
    alert("Cek console browser untuk melihat data yang disubmit!");
  }

  // Group permissions by guardName for display in columns
  const groupedPermissions: { [key: string]: Permission[] } = {};
  filteredPermissions.forEach((perm) => {
    if (!groupedPermissions[perm.guardName]) {
      groupedPermissions[perm.guardName] = [];
    }
    groupedPermissions[perm.guardName].push(perm);
  });

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">{mode === "edit" ? "Edit Role" : "New Role"}</h1>
      </div>
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name<span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Role name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Search</FormLabel>
              <Search
              placeholder="Search permissions"
              onSearch={(value) => setSearchQuery(value)}
              className="max-w mt-2"
            />
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto border rounded p-2">
              {Object.entries(groupedPermissions).map(([guardName, perms]) => (
                <div key={guardName}>
                  <h3 className="font-semibold mb-2 capitalize">{guardName} Permissions</h3>
                  {perms.map((perm) => (
                    <label key={perm.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.has(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                      />
                      <span>{perm.name}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="cursor-pointer">{mode === "edit" ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" className="cursor-pointer" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
