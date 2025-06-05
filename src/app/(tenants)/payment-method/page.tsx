"use client"

import { PaymentMethodTable } from "@/components/payment-method/payment-method-table";
import { PaymentMethod } from "@/datas/paymentMethod";
import { PaymentMethodService } from "@/services/payment-method";
import { use, useEffect, useState } from "react";

export default function Home() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPaymentMethods = async () => {
    try{
      const response = await PaymentMethodService.getPaymentMethods(localStorage.getItem("outlet_id") || "");
    if (response) {
      setPaymentMethods(response as PaymentMethod[]);
    } else {
      console.error("Failed to fetch payment methods");
    }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      <PaymentMethodTable paymentMethods={paymentMethods} />
    </div>
  );
}