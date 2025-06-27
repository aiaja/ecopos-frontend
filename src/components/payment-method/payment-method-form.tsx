"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { paymentMethodSchema } from "@/datas/paymentMethod";
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
import { PaymentMethodService } from "@/services/payment-method";
import { useEffect, useState } from "react";

export function PaymentMethodForm({
  mode = "create",
  paymentMethodId,
}: {
  mode?: "create" | "edit";
  paymentMethodId?: string;
}) {
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState({
    id: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      if (mode === "edit" && paymentMethodId) {
        try {
          const response = await PaymentMethodService.getPaymentMethodById(
            localStorage.getItem("outlet_id") || "",
            paymentMethodId
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
            console.error("Payment method not found");
          }
        } catch (error) {
          console.error("Error fetching payment method:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPaymentMethod();
  }, [mode, paymentMethodId]);

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues,
  });

  async function handleSubmit(values: z.infer<typeof paymentMethodSchema>) {
    try {
      if (mode === "create") {
        const newPaymentMethod = {
          name: values.name,
          outlet_id: localStorage.getItem("outlet_id") || "",
        };

        const response = await PaymentMethodService.createPaymentMethod(
          localStorage.getItem("outlet_id") || "",
          newPaymentMethod
        );
        if (response) {
          alert("Payment method created successfully");
        } else {
          alert("Failed to create payment method");
        }
      } else if (mode === "edit" && paymentMethodId) {
        const updatedPaymentMethod = {
          id: values.id,
          name: values.name,
        };

        const response = await PaymentMethodService.updatePaymentMethod(
          localStorage.getItem("outlet_id") || "",
          paymentMethodId,
          updatedPaymentMethod
        );
        if (response) {
          alert("Payment method updated successfully");
        } else {
          alert("Failed to update payment method");
        }
      }
      router.back();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while processing your request.");
    }
  }

  if (mode === "edit" && loading) {
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
          {mode === "edit" ? "Edit Payment Method" : "New Payment Method"}
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
                    <Input placeholder="Payment method name" {...field} />
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
