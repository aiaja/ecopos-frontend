"use client";

import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categorySchema, categories } from "@/datas/categories";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function CategoryForm({
  mode = "create",
  categoryId,
}: {
  mode?: "create" | "edit";
  categoryId?: string;
}) {
  const router = useRouter();


  let defaultValues = {
    id: "",
    name: "",
  };

  if (mode === "edit" && categoryId) {
    const categoryToEdit = categories.find((cat) => cat.id === categoryId);
    if (categoryToEdit) {
      defaultValues = {
        id: categoryToEdit.id,
        name: categoryToEdit.name,
      };
    }
  }

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  function handleSubmit(values: z.infer<typeof categorySchema>) {
    console.log("Data yang di-submit:", values);
    alert("Cek console browser untuk melihat data yang disubmit!");
  }

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">{mode === "edit" ? "Edit Category" : "New Category"}</h1>
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
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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