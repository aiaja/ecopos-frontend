"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { getAllOutlets } from '@/services/outlet-service';
import type { Outlet } from '@/datas/outlet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "../date-picker";
import { Printer, Download } from "lucide-react";
import React from "react";

export function SettingsTabs() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutletId, setSelectedOutletId] = useState<string>(""); // Pakai string kosong sebagai nilai awal jika lebih mudah untuk Select
  const [activeOutletDetails, setActiveOutletDetails] = useState<Outlet | null>(null);

  const [isLoading, setIsLoading] = useState(false); // Untuk loading state
  const [error, setError] = useState<string | null>(null); // Untuk pesan error
  
  // State untuk menyimpan nilai dari form input
  const [formData, setFormData] = useState({
    outlet_name: "",
    address: "",
    phone_number: "",
    tax: "",
    email:"",
  });

  // useEffect untuk fetch data outlets saat komponen dimuat
  useEffect(() => {
    const fetchOutletsData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedOutlets = await getAllOutlets();
        setOutlets(fetchedOutlets);

        const storedOutletId = localStorage.getItem('activeOutletId');
        if (storedOutletId && fetchedOutlets.some(o => o.id === storedOutletId)) {
          setSelectedOutletId(storedOutletId);
        } else if (fetchedOutlets.length > 0) {
          // Jika tidak ada di localStorage dan ada outlet, bisa pilih yang pertama sebagai default
          // setSelectedOutletId(fetchedOutlets[0].id);
          // localStorage.setItem('activeOutletId', fetchedOutlets[0].id);
          // Atau biarkan kosong agar pengguna memilih
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data outlet.");
        console.error("Error fetching outlets:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOutletsData();
  }, []); // Array dependensi kosong, jadi hanya jalan sekali saat mount

  // useEffect untuk mengisi form ketika selectedOutletId atau daftar outlets berubah
  useEffect(() => {
    if (selectedOutletId && outlets.length > 0) {
      const foundOutlet = outlets.find(o => o.id === selectedOutletId);
      if (foundOutlet) {
        setActiveOutletDetails(foundOutlet);
        setFormData({
          outlet_name: foundOutlet.outlet_name || "",
          address: foundOutlet.address || "",
          phone_number: foundOutlet.phone_number || "",
          tax: foundOutlet.tax || "",
          email: foundOutlet.email || "",
        });
      }
    } else {
      setActiveOutletDetails(null);
      // Reset form jika tidak ada outlet dipilih
      setFormData({ outlet_name: "", address: "", phone_number: "", tax: "", email: "" });
    }
  }, [selectedOutletId, outlets]);

  // Handler untuk perubahan pilihan di dropdown outlet
  const handleOutletSelectChange = (newOutletId: string) => {
    if (newOutletId) {
      setSelectedOutletId(newOutletId);
      localStorage.setItem('activeOutletId', newOutletId); // Simpan ke localStorage
      setError(null); // Bersihkan error jika ada
    }
  };

  // Handler untuk perubahan di input fields form
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler untuk submit form (menyimpan perubahan)
  const handleSaveChanges = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Mencegah reload halaman
    if (!activeOutletDetails) {
      setError("Silakan pilih outlet terlebih dahulu.");
      return;
    }
    setIsLoading(true);
    setError(null);
    console.log("Data yang akan disimpan:", activeOutletDetails.id, formData);
    // Di sini nanti kamu akan memanggil service untuk update data outlet
    // contoh: await updateOutletService(activeOutletDetails.id, formData);
    alert(`Fitur "Save" untuk outlet ${formData.outlet_name} belum diimplementasikan sepenuhnya.\nCek console untuk data.`);
    setIsLoading(false);
  };
  
  return (
    <Card>
      <CardContent className="">
        {isLoading && outlets.length === 0 && <p>Memuat daftar outlet...</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* <p className="text-red-600 text-sm">{errorMessage}</p> */}
        
        {/* sementara, baut coba2 */}
        <div className="space-y-2">
          <Label htmlFor="outlet-select">Outlet Aktif</Label>
          <Select
            value={selectedOutletId}
            onValueChange={handleOutletSelectChange}
            disabled={isLoading || outlets.length === 0}
          >
            <SelectTrigger id="outlet-select" className="w-full md:w-[300px]">
              <SelectValue placeholder="Pilih Outlet" />
            </SelectTrigger>
            <SelectContent>
              {outlets.map((outlet) => (
                <SelectItem key={outlet.id} value={outlet.id}>
                  {outlet.outlet_name}
                </SelectItem>
              ))}
              {outlets.length === 0 && !isLoading && (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">Belum ada outlet.</div>
              )}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSaveChanges} className="">
          
          <div className="space-y-2">
            <Label htmlFor="outlet_name">Outlet Name</Label>
            <Input
              id="outlet_name"
              name="outlet_name" 
              value={formData.outlet_name}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address" 
              value={formData.address} 
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Masukkan alamat lengkap outlet"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              name="phone_number" 
              value={formData.phone_number} 
              onChange={handleInputChange}
              disabled={isLoading}
          />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email" 
              value={formData.email} 
              onChange={handleInputChange}
              disabled={isLoading}
          />
          </div>      

          <div className="space-y-2">
            <Label htmlFor="tax">Tax (Contoh: 0.1 untuk 10%)</Label>
            <Input
              id="tax"
              name="tax" 
              type="number" 
              step="0.01"
              value={formData.tax}
              onChange={handleInputChange}
              disabled={isLoading}
          />
          </div>

          <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Save"}
              </Button>
          </div>

        </form>
        {!activeOutletDetails && !isLoading && outlets.length > 0 && (
           <p className="text-sm text-muted-foreground pt-4">Pilih sebuah outlet untuk melihat atau mengubah detailnya.</p>
        )}
      </CardContent>
    </Card>
  );
}
