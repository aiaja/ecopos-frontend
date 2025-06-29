"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { createUserSchema, updateUserSchema, User } from "@/datas/users";
import { Role } from "@/datas/roles";
import { UserService } from "@/services/user";
import { RoleService } from "@/services/role";
import { Outlet } from "@/datas/outlets";
import { OutletService } from "@/services/outlets";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type UserFormValues = z.infer<typeof createUserSchema> | z.infer<typeof updateUserSchema>;

export function UserForm({ mode = "create", userId }: { mode?: "create" | "edit"; userId?: string }) {
  const router = useRouter();
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [allOutlets, setAllOutlets] = useState<Outlet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const currentSchema = mode === "create" ? createUserSchema : updateUserSchema;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      username: "",
      email: "",
      role_id: "",
      outlet_id: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [rolesData, outletsData] = await Promise.all([
          RoleService.getRoles(),
          OutletService.getOutlets(),
        ]);
        setAllRoles(rolesData || []);
        setAllOutlets(outletsData || []);

        if (mode === "edit" && userId) {
          const userData = await UserService.getUserById(userId);
          const currentRoleId =
            userData.roles && userData.roles.length > 0 ? userData.roles[0].id.toString() : "";

          form.reset({
            username: userData.username,
            email: userData.email,
            role_id: currentRoleId,
            outlet_id: userData.outlet_id || "",
          });
        }
      } catch (error: any) {
        toast.error(`Gagal memuat data: ${error.message}`);
        router.back();
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [mode, userId]);

  async function onSubmit(values: UserFormValues) {
    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const selectedRole = allRoles.find((role) => role.id.toString() === values.role_id);
          if (!selectedRole) return reject("Role yang dipilih tidak valid!");

          const payload = {
            username: values.username,
            email: values.email,
            role: selectedRole.name,
            outlet_id: values.outlet_id,
            ...((values as any).password &&
              (values as any).password.length > 0 && {
                password: (values as any).password,
                password_confirmation: (values as any).confirmPassword,
              }),
          };

          if (mode === "create") {
            await UserService.createUser(payload);
          } else if (mode === "edit" && userId) {
            await UserService.updateUser(userId, payload);
          }

          resolve("Data pengguna berhasil disimpan!");
        } catch (error: any) {
          reject(error.message);
        }
      });

    toast.promise(promise, {
      loading: "Menyimpan data pengguna...",
      success: () => {
        router.push("/user-management/user");
        router.refresh();
        return mode === "edit" ? "Pengguna berhasil diperbarui!" : "Pengguna baru berhasil dibuat!";
      },
      error: (errorMessage) => errorMessage,
    });
  }

  async function handleCreateAndNew(values: UserFormValues) {
    const promise = () =>
        new Promise(async (resolve, reject) => {
        try {
            const selectedRole = allRoles.find((role) => role.id.toString() === values.role_id);
            if (!selectedRole) return reject("Role yang dipilih tidak valid!");

            const payload = {
            username: values.username,
            email: values.email,
            role: selectedRole.name,
            outlet_id: values.outlet_id,
            ...((values as any).password &&
                (values as any).password.length > 0 && {
                password: (values as any).password,
                password_confirmation: (values as any).confirmPassword,
                }),
            };

            await UserService.createUser(payload);

            form.reset(); // Reset form setelah simpan
            resolve("Pengguna berhasil dibuat! Silakan tambah pengguna lain.");
        } catch (error: any) {
            reject(error.message);
        }
        });

    toast.promise(promise, {
        loading: "Menyimpan data pengguna...",
        success: (msg) => String(msg),
        error: (msg) => msg,
    });
    }


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading form data...</div>;
  }

  const { isSubmitting } = form.formState;

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">{mode === "edit" ? "Edit User" : "New User"}</h1>
      </div>
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Username <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contoh@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password {mode === "create" && <span className="text-destructive">*</span>}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={
                            mode === "edit"
                              ? "Kosongkan jika tidak ingin mengubah"
                              : "Masukkan password"
                          }
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirm Password{" "}
                      {mode === "create" && <span className="text-destructive">*</span>}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={
                            mode === "edit"
                              ? "Kosongkan jika tidak ingin mengubah"
                              : "Konfirmasi password"
                          }
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Role <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih satu peran" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Outlet */}
              <FormField
                control={form.control}
                name="outlet_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Outlet <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih outlet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allOutlets.map((outlet) => (
                          <SelectItem key={outlet.id} value={outlet.id}>
                            {outlet.outlet_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Menyimpan..." : mode === "edit" ? "Update User" : "Create User"}
                </Button>

                {mode === "create" && (
                    <Button
                    type="button"
                    variant="outline"
                    onClick={form.handleSubmit(handleCreateAndNew)}
                    disabled={isSubmitting}
                    >
                    {isSubmitting ? "Menyimpan..." : "Simpan & Buat Baru"}
                    </Button>
                )}

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}
