"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';

import { createUserSchema, updateUserSchema } from '@/datas/users';
import { Role } from '@/datas/roles';
import { UserService } from '@/services/user';
import { RoleService } from '@/services/role';
import { Outlet } from '@/datas/outlets';
import { OutletService } from '@/services/outlets'; 

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface UserFormProps {
    mode?: "create" | "edit";
    userId?: string;
}

// Support both create and update schema types
type UserFormValues = z.infer<typeof createUserSchema> | z.infer<typeof updateUserSchema>;

export function UserForm({ mode = "create", userId }: { mode?: "create" | "edit"; userId?: string }) {
    const router = useRouter();
    const [allRoles, setAllRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [allOutlets, setAllOutlets] = useState<Outlet[]>([]);

    // Pilih skema validasi secara dinamis
    const currentSchema = mode === 'create' ? createUserSchema : updateUserSchema;

    const form = useForm<UserFormValues>({
      resolver: zodResolver(currentSchema),
      defaultValues: {
          username: "",
          email: "",
          role_id: "",
          outlet_id: "",
      },
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [rolesData, outletsData] = await Promise.all([
                    RoleService.getRoles(),
                    OutletService.getOutlets()
                ]);
                setAllRoles(rolesData || []);
                setAllOutlets(outletsData || []);

                if (mode === 'edit' && userId) {
                    const userData = await UserService.getUserById(userId);
                    form.reset({
                        username: userData.username,
                        email: userData.email,
                        // Ambil ID dari role pertama di dalam array (karena cuma ada satu)
                        role_id: userData.roles[0]?.id.toString() || "", 
                        outlet_id: userData.outlet_id || "",
                    });
                }
            } catch (error) {
                console.error("Failed to load data for form:", error);
                alert("Gagal memuat data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [mode, userId, form]);

    async function onSubmit(values: z.infer<typeof createUserSchema>) {
    // --- LOGIKA PENERJEMAHAN DIMULAI DI SINI ---

    // 1. Cari objek role lengkap berdasarkan ID yang dipilih di form
    const selectedRole = allRoles.find(role => role.id.toString() === values.role_id);
    if (!selectedRole) {
        alert("Role yang dipilih tidak valid!");
        return;
    }

    // 2. Siapkan payload yang 100% cocok dengan Postman
    const payload = {
        username: values.username,
        email: values.email,
        
        // Backend mau 'role' berisi NAMA, bukan 'role_ids' berisi array ID
        role: selectedRole.name, 

        outlet_id: values.outlet_id === "NONE" ? null : values.outlet_id,
        
        // Jika password diisi, sertakan 'password' dan 'password_confirmation'
        ...(values.password && values.password.length > 0 && {
            password: values.password,
            password_confirmation: values.confirmPassword
        })
    };

    // --- LOGIKA PENGIRIMAN (TIDAK BERUBAH) ---
    try {
        setIsLoading(true);
        if (mode === "create") {
            await UserService.createUser(payload);
            alert("User berhasil dibuat!");
        } else if (mode === "edit" && userId) {
            // Untuk update, kita hanya kirim data yang diubah.
            // Backend di contoh Postman hanya update username, jadi kita sesuaikan.
            // Jika backend bisa terima semua data, gunakan 'payload' seperti di atas.
            // Untuk sekarang, kita buat fleksibel:
            const updatePayload = { username: payload.username, role: payload.role, outlet_id: payload.outlet_id };
            await UserService.updateUser(userId, updatePayload);
            alert("User berhasil diupdate!");
        }
        router.push("/user-management//users");
        router.refresh();
    } catch (error: any) {
        if (error.response?.data?.errors) {
            const validationErrors = error.response.data.errors;
            let errorMessage = "Terdapat kesalahan validasi:\n";
            for (const key in validationErrors) {
                errorMessage += `- ${validationErrors[key].join(', ')}\n`;
            }
            alert(errorMessage);
        } else {
            // Menangkap pesan error tunggal seperti "email has already been taken"
            const message = error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.";
            alert(message);
        }
    } finally {
        setIsLoading(false);
    }
}

    if (isLoading && mode === 'edit') {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

  return (
    <div>
     <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">{mode === "edit" ? "Edit User" : "New User"}</h1>
      </div>
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel>Username <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input placeholder="Masukkan username" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {/* Email */}
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input type="email" placeholder="contoh@email.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Password */}
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password {mode === 'create' && <span className="text-destructive">*</span>}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder={mode === 'edit' ? "Kosongkan jika tidak ingin mengubah" : "Masukkan password"} 
                        {...field} 
                      />
                      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password {mode === 'create' && <span className="text-destructive">*</span>}</FormLabel>
                   <FormControl>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder={mode === 'edit' ? "Kosongkan jika tidak ingin mengubah" : "Konfirmasi password"}
                        {...field} 
                      />
                      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Roles */}
              <FormField control={form.control} name="role_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role<span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih satu peran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allRoles.map((role) => (
                        // value dari SelectItem harus string
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                     ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* DROPDOWN BARU UNTUK OUTLET */}
                            <FormField
                                control={form.control}
                                name="outlet_id"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Outlet</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih outlet (opsional)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="NONE">Tidak Terikat Outlet</SelectItem>
                                            {allOutlets.map((outlet) => (
                                                <SelectItem key={outlet.id} value={outlet.id}>
                                                    {outlet.outlet_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />


            </div>

            
            
            {/* Action buttons */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="cursor-pointer">{mode === "edit" ? "Update User" : "Create"}</Button>
              {mode === "create" && (
                <Button type="button" variant="outline" className="cursor-pointer">Create & create another</Button>
              )}
              <Button type="button" variant="outline" onClick={() => router.back()} className="cursor-pointer">Cancel</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}