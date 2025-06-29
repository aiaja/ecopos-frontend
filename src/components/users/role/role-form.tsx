"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { roleSchema } from "@/datas/roles";
import { Permission } from '@/datas/permissions';
import { PermissionService } from '@/services/permission';
import { RoleService } from '@/services/role';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from "@/components/ui/search";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface RoleFormProps {
    mode?: "create" | "edit";
    rolesId?: string;
}

export function RoleForm({ mode = "create", rolesId }: RoleFormProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    const form = useForm<z.infer<typeof roleSchema>>({
        resolver: zodResolver(roleSchema),
        defaultValues: { name: "" },
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const permissionsData = await PermissionService.getPermissions();
                setAllPermissions(permissionsData || []);

                if (mode === 'edit' && rolesId) {
                    const roleToEdit = await RoleService.getRoleById(rolesId);
                    form.reset({ name: roleToEdit.name });
                    
                    if (roleToEdit.permissions && roleToEdit.permissions.length > 0) {
                        const initialPermissionNames = roleToEdit.permissions.map(p => p.name);
                        setSelectedPermissions(new Set(initialPermissionNames));
                    }
                }
            } catch (error: any) {
                toast.error(`Gagal memuat data form: ${error.message}`);
                router.back();
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [mode, rolesId, form, router]);

    const filteredPermissions = useMemo(() => {
        if (!searchQuery) return allPermissions;
        return allPermissions.filter((perm) =>
            perm.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allPermissions, searchQuery]);

    const groupedPermissions = useMemo(() => {
        const groups: { [key: string]: Permission[] } = {};
        filteredPermissions.forEach((perm) => {
            const moduleName = perm.name.split(' ').pop() || 'Lainnya';
            const formattedModuleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
            if (!groups[formattedModuleName]) {
                groups[formattedModuleName] = [];
            }
            groups[formattedModuleName].push(perm);
        });
        return groups;
    }, [filteredPermissions]);

    function togglePermission(permissionName: string) {
        const newSelected = new Set(selectedPermissions);
        if (newSelected.has(permissionName)) {
            newSelected.delete(permissionName);
        } else {
            newSelected.add(permissionName);
        }
        setSelectedPermissions(newSelected);
    }

    async function handleSubmit(values: z.infer<typeof roleSchema>) {
        const dataToSubmit = {
            name: values.name,
            permissions: Array.from(selectedPermissions),
        };

        const promise = () => new Promise(async (resolve, reject) => {
            try {
                if (mode === 'create') {
                    await RoleService.createRole(dataToSubmit);
                } else if (mode === 'edit' && rolesId) {
                    await RoleService.updateRole(rolesId, dataToSubmit);
                }
                resolve("Sukses!");
            } catch (error: any) {
                reject(error.message);
            }
        });

        toast.promise(promise, {
            loading: 'Menyimpan role...',
            success: () => {
                router.push('/user-management/role');
                router.refresh();
                return mode === 'edit' ? 'Role berhasil diupdate!' : 'Role berhasil dibuat!';
            },
            error: (errorMessage) => errorMessage,
        });
    }

    const { isSubmitting } = form.formState;

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
                            <FormLabel className="text-base font-semibold">Search Permissions</FormLabel>
                            <Search
                                placeholder="Search by permission name..."
                                onSearch={(value) => setSearchQuery(value)}
                                className="max-w mt-2"
                            />
                        </div>
                        
                        <div className="space-y-4">
                            <FormLabel className="text-base font-semibold">Permissions</FormLabel>
                            
                            <div className="border rounded-lg bg-background">
                                <div className="max-h-96 overflow-y-auto p-4">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <p className="text-muted-foreground">Loading permissions...</p>
                                        </div>
                                    ) : Object.keys(groupedPermissions).length > 0 ? (
                                        <div className="space-y-6">
                                            {Object.entries(groupedPermissions)
                                            .sort(([moduleA], [moduleB]) => moduleA.localeCompare(moduleB))
                                            .map(([moduleName, perms]) => (
                                                <div key={moduleName} className="space-y-3">
                                                    {/* Module Header */}
                                                    <div className="border-b border-border pb-2">
                                                        <h3 className="font-semibold text-foreground capitalize">
                                                            {moduleName}
                                                        </h3>
                                                    </div>
                                                    
                                                    {/* Permission Items Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                        {perms.map((perm) => (
                                                            <label 
                                                                key={perm.id} 
                                                                className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group"
                                                            >
                                                                <div className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="h-4 w-4 rounded border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 accent-primary cursor-pointer"
                                                                        checked={selectedPermissions.has(perm.name)}
                                                                        onChange={() => togglePermission(perm.name)}
                                                                    />
                                                                </div>
                                                                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group-hover:text-foreground transition-colors">
                                                                    {perm.name.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center py-8">
                                            <p className="text-muted-foreground">
                                                No permissions found for "{searchQuery}".
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Selection Summary */}
                            {selectedPermissions.size > 0 && (
                                <div className="text-sm text-muted-foreground">
                                    {selectedPermissions.size} permission{selectedPermissions.size > 1 ? 's' : ''} selected
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button type="submit" className="cursor-pointer" disabled={isSubmitting || isLoading}>
                                {isSubmitting ? "Menyimpan..." : (mode === "edit" ? "Update" : "Simpan")}
                            </Button>
                            <Button type="button" variant="outline" className="cursor-pointer" onClick={() => router.back()} disabled={isSubmitting || isLoading}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}