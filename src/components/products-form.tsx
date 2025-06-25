"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { productSchema } from "@/datas/products";
import { categories } from "@/datas/categories";
import products from "@/datas/products";
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

export function ProductsForm({ mode = "create", productId }: { mode?: "create" | "edit"; productId?: string }) {
  let defaultValues = {
    heroImages: undefined as FileList | undefined,
    name: "",
    barcode: "",
    sku: "",
    categoryId: "",
    stock: 0,
    unit: "",
    initialPrice: 0,
    sellingPrice: 0,
    type: "Product",
    nonStock: false,
  };

  if (mode === "edit" && productId) {
    const product = products.find((p) => p.id.toString() === productId);
    if (product) {
      defaultValues = {
        heroImages: undefined, // FileList tidak bisa diisi dari data, hanya saat upload baru
        name: product.name,
        barcode: product.barcode ?? "",
        sku: product.sku ?? "",
        categoryId: product.categoryId,
        stock: product.stock,
        unit: product.unit ?? "",
        initialPrice: product.initialPrice,
        sellingPrice: product.sellingPrice,
        type: product.type,
        nonStock: product.nonStock ?? false,
      };
    }
  }

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof productSchema>) {
    console.log(values);
  }

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">{mode === "edit" ? "Edit Product" : "New Products"}</h1>
      </div>
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Hero Images */}
            <FormField
              control={form.control}
              name="heroImages"
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
              {/* Barcode */}
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode</FormLabel>
                    <FormControl>
                      <Input placeholder="Product barcode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* SKU */}
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <FormSelect {...field}>
                        <option value="">Select an option</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </FormSelect>
                    </FormControl>
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
                    <FormLabel>Stock<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
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
                control={form.control}
                name="initialPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial price<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">IDR</span>
                        <Input type="number" min={0} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Selling price */}
              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling price<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">IDR</span>
                        <Input type="number" min={0} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Non stock */}
              <FormField
                control={form.control}
                name="nonStock"
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
              <Button type="submit">{mode === "edit" ? "Update" : "Create"}</Button>
              {mode !== "edit" && (
                <Button type="button" variant="outline">Create & create another</Button>
              )}
              <Button type="button" variant="outline">Cancel</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
