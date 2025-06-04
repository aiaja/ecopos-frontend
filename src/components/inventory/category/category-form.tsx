"use client";

import { useRouter } from "next/navigation";
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
import { id } from "date-fns/locale";
import { CategoryService } from "@/services/category";
import { useEffect, useState } from "react";

export function CategoryForm({
  mode = "create",
  categoryId,
}: {
  mode?: "create" | "edit";
  categoryId?: string;
}) {
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      if (mode === "edit" && categoryId) {
        try {
          const response = await CategoryService.getCategoryById(
            localStorage.getItem("outlet_id") || "",
            categoryId
          );
          if (response) {
            setDefaultValues({
              id: response.id || "",
              name: response.name,
            });
            form.reset({
              id: response.id || "",
              name: response.name,
            });
          } else {
            console.error("Category not found");
          }
        } catch (error) {
          console.error("Error fetching category:", error);
        }
      }
    };
    fetchCategory();
  }, [mode, categoryId]);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  async function handleSubmit(values: z.infer<typeof categorySchema>) {
    try {
      if (mode === "create") {
        const newCategory = {
          name: values.name,
          outlet_id: localStorage.getItem("outlet_id") || "",
        };

        const response = await CategoryService.createCategory(
          localStorage.getItem("outlet_id") || "",
          newCategory
        );
        if (response) {
          alert("Category created successfully");
        } else {
          alert("Failed to create category");
        }
      } else if (mode === "edit" && categoryId) {
        const updatedCategory = {
          id: values.id,
          name: values.name,
        };

        const response = await CategoryService.updateCategory(
          localStorage.getItem("outlet_id") || "",
          categoryId,
          updatedCategory
        );
        if (response) {
          alert("Category updated successfully");
        } else {
          alert("Failed to update category");
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
          {mode === "edit" ? "Edit Category" : "New Category"}
        </h1>
      </div>
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              defaultValue={mode === "edit" ? defaultValues.name : ""}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" className="cursor-pointer">
                {mode === "edit" ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.back()}
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
