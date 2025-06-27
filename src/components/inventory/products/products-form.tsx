"use client";

import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from 'react';
import Image from 'next/image';

// Import "Single Source of Truth" kita
import { Product } from "@/datas/products";
import { productSchema } from "@/datas/products";
import { Category } from "@/datas/categories";

// Import Service Layer
import { ProductService } from '@/services/products';
import { CategoryService } from "@/services/category";

// Import Komponen UI dari shadcn/ui
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductsFormProps {
    mode?: "create" | "edit";
    productId?: string;
}

export function ProductsForm({ mode = "create", productId }: ProductsFormProps) {
    const router = useRouter();

    // State tidak berubah
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [nameWarning, setNameWarning] = useState<string>("");
    const [netProfitValue, setNetProfitValue] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading submit

    // Setup form tidak berubah
    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            category_id: "",
            stock: 0,
            unit: "",
            initial_price: "",
            selling_price: "",
            is_non_stock: false,
            hero_images: undefined,
        },
    });
    
    // Watchers tidak berubah
    const watchedName = form.watch("name");
    const watchedInitialPrice = form.watch("initial_price");
    const watchedSellingPrice = form.watch("selling_price");
    const watchedHeroImages = form.watch("hero_images");

    // useEffect hooks tidak berubah
    useEffect(() => {
        const fetchDependencies = async () => {
            setIsLoading(true);
            try {
                const outletId = localStorage.getItem("outlet_id") || "";
                const [categoriesData, productsData] = await Promise.all([
                    CategoryService.getCategories(outletId),
                    ProductService.getProducts(outletId)
                ]);

                setCategories((categoriesData || []).filter((cat): cat is Category & { id: string } => typeof cat.id === "string"));
                setAllProducts(productsData || []);

                if (mode === "edit" && productId) {
                    const productData = await ProductService.getProductById(outletId, productId);
                    form.reset({
                        name: productData.name,
                        category_id: productData.category_id,
                        stock: productData.stock,
                        unit: productData.unit || "",
                        initial_price: productData.initial_price,
                        selling_price: productData.selling_price,
                        is_non_stock: productData.is_non_stock,
                    });
                    if (productData.hero_images) {
                        setPreviewImage(productData.hero_images);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Failed to load initial data for the form.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDependencies();
    }, [mode, productId, form]);

    useEffect(() => {
        const name = watchedName?.trim().toLowerCase();
        if (!name) {
            setNameWarning("");
            return;
        }
        const isDuplicate = allProducts.some(
            (p) => p.name.trim().toLowerCase() === name && (mode !== "edit" || p.id !== productId)
        );
        setNameWarning(isDuplicate ? "Nama produk sudah ada, silakan ganti." : "");
    }, [watchedName, allProducts, mode, productId]);
    
    useEffect(() => {
        if (watchedHeroImages && watchedHeroImages.length > 0) {
            const file = watchedHeroImages[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else if (mode === "create") {
             setPreviewImage(null);
        }
    }, [watchedHeroImages, mode]);

    useEffect(() => {
        const initial = parseFloat(watchedInitialPrice || "0");
        const selling = parseFloat(watchedSellingPrice || "0");
        setNetProfitValue(selling - initial);
    }, [watchedInitialPrice, watchedSellingPrice]);

    // Fungsi submit utama
    async function performSubmit(values: z.infer<typeof productSchema>) {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("category_id", values.category_id);
        formData.append("stock", String(values.stock));
        formData.append("initial_price", values.initial_price);
        formData.append("selling_price", values.selling_price);
        formData.append("is_non_stock", values.is_non_stock ? "1" : "0");
        if (values.unit) {
            formData.append("unit", values.unit);
        }
        if (values.hero_images && values.hero_images.length > 0) {
            formData.append("hero_images", values.hero_images[0]);
        }

        try {
            const outletId = localStorage.getItem("outlet_id") || "";
            if (mode === "create") {
                await ProductService.createProduct(outletId, formData);
                alert("Product created successfully");
            } else if (mode === "edit" && productId) {
                await ProductService.updateProduct(outletId, productId, formData);
                alert("Product updated successfully");
            }
            return true; // Sukses
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form. Check console for details.");
            return false; // Gagal
        } finally {
            setIsSubmitting(false);
        }
    }
    
    async function handleSubmitAndRoute(values: z.infer<typeof productSchema>) {
        const success = await performSubmit(values);
        if (success) {
            router.push('/inventory/products');
            router.refresh();
        }
    }

    // LOGICAL FIX: Fungsi baru untuk tombol "Create & create another"
    async function handleCreateAndNew(values: z.infer<typeof productSchema>) {
        const success = await performSubmit(values);
        if (success) {
            // Reset form ke nilai awal
            form.reset();
            setPreviewImage(null);
            // Ambil lagi daftar produk untuk validasi duplikat yang akurat
            const outletId = localStorage.getItem("outlet_id") || "";
            const productsData = await ProductService.getProducts(outletId);
            setAllProducts(productsData || []);
        }
    }

    if (isLoading && mode === 'edit') {
        return <div className="flex justify-center items-center h-screen">Loading product data...</div>;
    }

return (
    <div>
        <div className="flex justify-between items-center mt-2 mx-6 mb-6">
            <h1 className="text-3xl font-bold">
                {mode === "edit" ? "Edit Product" : "New Product"}
            </h1>
        </div>
        <div className="m-6 px-4 bg-primary-foreground text-card-foreground rounded-xl border shadow-sm">
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(handleSubmitAndRoute)} 
                    className="py-6 space-y-6">
                
                    {/* Product Image & Name Section */}
                    <div className="space-y-4">
                        {/* FormField untuk hero_images */}
                        <FormField
                            control={form.control}
                            name="hero_images"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Image</FormLabel>
                                <FormControl>
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                    <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                                        <Input 
                                            type="file" 
                                            accept="image/png, image/jpeg, image/gif"
                                            ref={field.ref}
                                            onChange={e => field.onChange(e.target.files)} 
                                        />
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Supported formats: JPG, PNG, GIF (max 5MB)
                                        </p>
                                    </div>
                                    </div>
                                    {previewImage && (
                                    <div className="flex-shrink-0 relative">
                                        <div className="w-24 h-24 rounded-lg overflow-hidden border border-border">
                                            <Image 
                                                src={previewImage} 
                                                alt="Product preview" 
                                                width={96} 
                                                height={96} 
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewImage(null);
                                                form.resetField('hero_images');
                                            }}
                                            className="absolute top-[-5px] right-[-5px] bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                            aria-label="Remove image"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                    )}
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        {/* FormField untuk name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name<span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter product name" {...field} />
                                    </FormControl>
                                    {nameWarning && (<p className="text-sm font-medium text-destructive mt-1">{nameWarning}</p>)}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Category, Stock, Unit in one row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Category */}
                        <FormField 
                            control={form.control} 
                            name="category_id" 
                            render={({ field }) => ( 
                            <FormItem> 
                                <FormLabel>Category <span className="text-destructive">*</span></FormLabel> 
                                <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger className="w-full"> {/* Tambahkan w-full di sini */}
                                    <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )} 
                        />
                        
                        {/* Stock */}
                        <FormField 
                            control={form.control} 
                            name="stock" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            min={0} 
                                            placeholder="0" 
                                            {...field} 
                                            onChange={(e) => { 
                                                const value = e.target.value === '' ? '' : Number(e.target.value); 
                                                field.onChange(value); 
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />
                        
                        {/* Unit */}
                        <FormField 
                            control={form.control} 
                            name="unit" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unit <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="pcs, kg, box..." 
                                            {...field} 
                                            value={field.value ?? ""} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Initial price */}
                    <FormField 
                        control={form.control} 
                        name="initial_price" 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">
                                    Initial Price <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium">
                                            IDR
                                        </span>
                                        <Input 
                                            type="number" 
                                            min={0} 
                                            step={100} 
                                            placeholder="10,000" 
                                            className="h-10 pl-12" 
                                            {...field} 
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} 
                    />
                    {/* Selling price */}
                    <FormField 
                        control={form.control} 
                        name="selling_price" 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">
                                    Selling Price <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium">
                                            IDR
                                        </span>
                                        <Input 
                                            type="number" 
                                            min={0} 
                                            step={100} 
                                            placeholder="15,000" 
                                            className="h-10 pl-12" 
                                            {...field} 
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} 
                    />
                    {/* Net Profit */}
                    <div className="flex flex-col justify-end h-full py-2">
                        <span className="text-sm text-muted-foreground">Net Profit:</span>
                        <span className="font-bold text-lg">IDR {netProfitValue.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                    {/* Non-Stock Checkbox */}
                    <FormField
                        control={form.control}
                        name="is_non_stock"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Non-Stock Product</FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-4 border-t">
                        <Button className="cursor-pointer" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (mode === "edit" ? "Update" : "Create")}
                        </Button>
                        {mode !== "edit" && (
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={form.handleSubmit(handleCreateAndNew)}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Create & create another'}
                            </Button>
                        )}
                        <Button 
                            className="cursor-pointer"
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