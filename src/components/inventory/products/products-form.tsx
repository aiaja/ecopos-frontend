"use client";

import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { productSchema } from "@/datas/products";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSelect,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {id} from "date-fns/locale";
import { ProductService } from '@/services/products';
import { CategoryService } from "@/services/category";
import { useEffect, useState } from 'react';
import { Category, categories } from "@/datas/categories";

export function ProductsForm({
  mode = "create",
  productId,
}: {
  mode?: "create" | "edit";
  productId?: string;
}) {
  const router = useRouter();

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const outletId = localStorage.getItem("outlet_id") || "";
        const response = await CategoryService.getCategories(outletId);
        setAvailableCategories(
          (response || []).map((cat: any) => ({
            ...cat,
            id: cat.id ?? "",
          }))
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
        setAvailableCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const [defaultValues, setDefaultValues] = useState({
    id: "",
    hero_images: undefined as string | undefined,
    name: "",
    category_id: "",
    stock: 0,
    unit: "",
    initial_price: "0",
    selling_price: "0",
    is_non_stock: false,
    category:{
      id: "",
      name: "",
    }
  });

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (mode === "edit" && productId) {
        try {
          const response = await ProductService.getProductById(
            localStorage.getItem("outlet_id") || "",
            productId
          );

          if (response) {
                      setDefaultValues({
                        id: response.id || "",
                        hero_images: response.hero_images ?? undefined,
                        name: response.name,
                        category_id: response.category_id || "",
                        stock: response.stock ?? 0,
                        unit: response.unit || "",
                        initial_price: response.initial_price || "0",
                        selling_price: response.selling_price || "0",
                        is_non_stock: response.is_non_stock ?? false,
                        category: response.category || { id: "", name: "" },
                      });
                      form.reset({
                        id: response.id || "",
                        hero_images: response.hero_images ?? undefined,
                        name: response.name,
                        category_id: response.category_id || "",
                        stock: response.stock ?? 0,
                        unit: response.unit || "",
                        initial_price: response.initial_price || "0",
                        selling_price: response.selling_price || "0",
                        is_non_stock: response.is_non_stock ?? false,
                        category: response.category || { id: "", name: "" },
                      });
                    } else {
                      console.error("Product not found");
                    }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };
    fetchProduct();
  }, [mode, productId]);

  async function handleSubmit(values: z.infer<typeof productSchema>) {
    try {
      if (mode === "create") {
        const foundCategory = availableCategories.find(cat => cat.id === values.category_id);
        if (!foundCategory) {
          alert("Selected category not found.");
          return;
        }
        const newProduct = {
          hero_images: values.hero_images,
          name: values.name,
          category_id: values.category_id,
          stock: values.stock,
          unit: values.unit ?? null,
          initial_price: values.initial_price.toString(),
          selling_price: values.selling_price.toString(),
          is_non_stock: values.is_non_stock ?? false,
          outlet_id: localStorage.getItem("outlet_id") || "",
          category: foundCategory,
        };

        const response = await ProductService.createProduct(
        localStorage.getItem("outlet_id") || "",
        newProduct
        );

        if (response) {
          alert("Product created successfully");
        } else {
          alert("Failed to create product");
        }
      } else if (mode === "edit" && productId) {
        const foundCategory = availableCategories.find(cat => cat.id === values.category_id);
        if (!foundCategory) {
          alert("Selected category not found.");
          return;
        }
        const updatedProduct = {
          hero_images: values.hero_images,
          name: values.name,
          category_id: values.category_id,
          stock: values.stock,
          unit: values.unit ?? null,
          initial_price: values.initial_price.toString(),
          selling_price: values.selling_price.toString(),
          is_non_stock: values.is_non_stock ?? false,
          outlet_id: localStorage.getItem("outlet_id") || "",
          category: foundCategory,
        };

        const response = await ProductService.updateProduct(
          localStorage.getItem("outlet_id") || "",
          productId,
          updatedProduct
        );
         if (response) {
          alert("Product updated successfully");
        } else {
          alert("Failed to update product");
        }
      }
    router.back();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while processing your request.");
    }
  }

  if (mode === "edit" && !defaultValues.name) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">
           {mode === "edit" ? "Edit Product" : "New Products"}
        </h1>
      </div>
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Form {...form}>
          <form 
          onSubmit={form.handleSubmit(handleSubmit)} 
          className="space-y-8">
            
            {/* Hero Images */}
            <FormField
              defaultValue={mode === "edit" ? defaultValues.hero_images : undefined}
              control={form.control}
              name="hero_images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Images</FormLabel>
                  <FormControl>
                    <Input type="file" multiple onChange={e => field.onChange(e.target.files)} />
                  </FormControl>
                  <FormDescription>Drag & Drop your files or Browse</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Grid for 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <FormField
                defaultValue={mode === "edit" ? defaultValues.name : undefined}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />        
              {/* Stock */}
              <FormField
                defaultValue={mode === "edit" ? defaultValues.stock : undefined}
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category */}
              <FormField
                defaultValue={mode === "edit" ? defaultValues.category_id : undefined}
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <FormSelect
                        {...field}
                        value={field.value ?? ""}
                      >
                        <option value="">Select an option</option>
                        {availableCategories.map ((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </FormSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Unit */}
              <FormField
                defaultValue={mode === "edit" ? defaultValues.unit : undefined}
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="Unit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Initial price */}
              <FormField
                defaultValue={mode === "edit" ? defaultValues.initial_price : undefined}  
                control={form.control}
                name="initial_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial price<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">IDR</span>
                        <Input type="number" min={0} step="1000" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Selling price */}
              <FormField
                defaultValue={mode === "edit" ? defaultValues.selling_price : undefined}  
                control={form.control}
                name="selling_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling price<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">IDR</span>
                        <Input type="number" min={0} step="1000" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Non stock */}
              <FormField
                defaultValue={mode === "edit" ? defaultValues.is_non_stock : false}
                control={form.control}
                name="is_non_stock"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 mt-8">
                    <FormControl>
                      <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                    </FormControl>
                    <FormLabel>Non stock</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Action buttons */}
            <div className="flex gap-2">
              <Button className="cursor-pointer" type="submit">
                {mode === "edit" ? "Update" : "Create"}
              </Button>
              {mode !== "edit" && (
                <Button 
                type="button"
                variant="outline">
                  Create & create another
                </Button>
              )}
              <Button 
                className="cursor-pointer"
                type="button" 
                variant="outline"
                onClick={() => router.back()}
              >Cancel</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
