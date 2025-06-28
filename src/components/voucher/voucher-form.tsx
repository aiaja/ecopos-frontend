"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { voucherSchema } from "@/datas/voucher";
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
import { VoucherService } from "@/services/voucher";
import { useEffect, useState } from "react";

export function VoucherForm({
  mode = "create",
  voucherId,
}: {
  mode?: "create" | "edit";
  voucherId?: string;
}) {
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState({
    code: "",
    name: "",
    type: "",
    nominal: "",
    start_date: "",
    expired_date: "",
    minimum_buying: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoucher = async () => {
      if (mode === "edit" && voucherId) {
        try {
          setLoading(true);
          const response = await VoucherService.getVoucherById(
            localStorage.getItem("outlet_id") || "",
            voucherId
          );
          console.log("voucherid :", voucherId)
          console.log("respons :", response)
          if (response) {
            setDefaultValues({
              code: response.code,
              name: response.name,
              type: response.type,
              nominal: response.nominal,
              start_date: response.start_date,
              expired_date: response.expired_date,
              minimum_buying: response.minimum_buying,
              status: response.status,
            });
            form.reset({
              code: response.code,
              name: response.name,
              type: response.type,
              nominal: response.nominal,
              start_date: response.start_date,
              expired_date: response.expired_date,
              minimum_buying: response.minimum_buying,
              status: response.status,
            });
          } else {
            console.error("Voucher not found");
          }
        } catch (error) {
          console.error("Error fetching voucher:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchVoucher();
  }, [mode, voucherId]);

  const form = useForm<z.infer<typeof voucherSchema>>({
    resolver: zodResolver(voucherSchema),
    defaultValues,
  });

  async function handleSubmit(values: z.infer<typeof voucherSchema>) {
    console.log("Form data being submitted:", values);

    try {
      if (mode === "create") {
        const newVoucher = {
          code: values.code,
          name: values.name,
          type: values.type,
          nominal: values.nominal,
          start_date: values.start_date,
          expired_date: values.expired_date,
          minimum_buying: values.minimum_buying,
          status: values.status,
          outlet_id: localStorage.getItem("outlet_id") || "",
        };

        const response = await VoucherService.createVoucher(
          localStorage.getItem("outlet_id") || "",
          newVoucher
        );
        if (response) {
          alert("Voucher created successfully");
        } else {
          alert("Failed to create voucher");
        }
      } else if (mode === "edit" && voucherId) {
        const editVoucher = {
          code: values.code,
          name: values.name,
          type: values.type,
          nominal: values.nominal,
          start_date: values.start_date,
          expired_date: values.expired_date,
          minimum_buying: values.minimum_buying,
          status: values.status,
          outlet_id: localStorage.getItem("outlet_id") || "",
        };
        const response = await VoucherService.updateVoucher(
          localStorage.getItem("outlet_id") || "",
          voucherId,
          editVoucher
        );
        if (response) {
          alert("Voucher updated successfully");
        } else {
          alert("Failed to update voucher");
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
          {mode === "edit" ? "Edit Voucher" : "New Voucher"}
        </h1>
      </div>
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Code<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Voucher code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Voucher name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Start Date<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Start date" {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expired_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Expired Date<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Expired date"
                        {...field}
                        type="date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nominal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nominal<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nominal" {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minimum_buying"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Minimum Buying<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Minimum buying"
                        {...field}
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Voucher type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Status" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="cursor-pointer"
              >
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
