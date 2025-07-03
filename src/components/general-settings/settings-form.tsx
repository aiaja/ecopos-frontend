"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { outletSchema } from '@/datas/outlets';
import { OutletService } from '@/services/outlets';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

// Tipe untuk nilai form, diambil dari skema Zod.
type OutletFormValues = z.infer<typeof outletSchema>;

export function SettingForm() { 
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<OutletFormValues>({
        resolver: zodResolver(outletSchema),
        defaultValues: {
            outlet_name: "",
            address: "",
            phone_number: "",
            tax: 0,
        },
    });

    // useEffect untuk mengambil data awal
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                // Ambil outletId dari localStorage
                const outletId = localStorage.getItem("outlet_id");
                if (!outletId) {
                    throw new Error("Outlet ID tidak ditemukan di local storage.");
                }

                const outletData = await OutletService.getOutletById(outletId);
                
                // Isi form dengan data yang didapat dari API.
                form.reset({
                    ...outletData,
                    tax: parseFloat(outletData.tax)
                });

            } catch (error: any) {
                toast.error("Gagal memuat pengaturan outlet", {
                    description: error.message,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [form, router]);

    // Ambil isSubmitting dari formState untuk disable tombol
    const { isSubmitting } = form.formState;

    // Fungsi submit dengan pola toast.promise
    async function handleSubmit(values: OutletFormValues) {
        const promise = () => new Promise(async (resolve, reject) => {
            try {
                const outletId = localStorage.getItem("outlet_id");
                if (!outletId) {
                    // Reject promise jika outletId tidak ditemukan
                    return reject("Outlet ID tidak ditemukan. Mohon login ulang.");
                }
                
                // Karena ini halaman setting, kita selalu update, tidak ada mode create
                await OutletService.updateOutlet(outletId, values);

                // Resolve promise jika berhasil
                resolve("Pengaturan berhasil disimpan!");
            } catch (error: any) {
                // Reject promise jika service gagal
                reject(error.message);
            }
        });

        toast.promise(promise, {
            loading: 'Menyimpan perubahan...',
            success: (message) => {
                // Opsional: refresh halaman atau lakukan sesuatu setelah berhasil
                // router.refresh(); 
                return `${message}`;
            },
            error: (errorMessage) => {
                return errorMessage;
            },
        });
    }

    if (isLoading) {
        return (
            <Card><CardContent className="pt-6"><p>Loading settings...</p></CardContent></Card>
        );
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField control={form.control} name="outlet_name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Outlet Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl><Textarea {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="phone_number" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="tax" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tax (%)</FormLabel>
                                <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button type="submit" className="cursor-pointer" disabled={isSubmitting || isLoading}>
                            {isSubmitting ? 'Menyimpan...' : 'Save Changes'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
