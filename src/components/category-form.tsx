"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categorySchema, Category } from "@/datas/categories";
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

export function CategoryForm({
  mode = "create",
  defaultValues,
  onSubmit,
}: {
  mode?: "create" | "edit";
  defaultValues?: Partial<Category>;
  onSubmit?: (values: z.infer<typeof categorySchema>) => void;
}) {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: { id: defaultValues?.id || "", name: defaultValues?.name || "" },
  });

  function handleSubmit(values: z.infer<typeof categorySchema>) {
    if (onSubmit) {
      onSubmit(values);
    } else {
      console.log(values);
    }
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
              <Button type="submit">{mode === "edit" ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline">Cancel</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
