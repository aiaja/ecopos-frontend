"use client";

import { useParams } from "next/navigation"; // Use useParams() instead of query
import { useEffect, useState } from "react";
import { OpenBillsService } from "@/services/openBills";
import { OpenBills } from "@/datas/openBills";
import { OrderDetails } from "@/components/pos/order-details/OrderDetails";

export default function UpdateOpenBill() {
  const { openBillId } = useParams();  // Use useParams to access dynamic params

  const [openBill, setOpenBill] = useState<OpenBills | null>(null);

  useEffect(() => {
    if (openBillId) {
      const fetchOpenBill = async () => {
        try {
          const response = await OpenBillsService.getOpenBillById(
            localStorage.getItem("outlet_id") || "",
            openBillId as string
          );

          // Validate if response contains 'id' and 'code'
          if (response && response.id && response.code) {
            setOpenBill(response);
          } else {
            console.error("API response is missing 'id' or 'code'.", response);
            alert("Error: OpenBill is missing required fields.");
          }
        } catch (error) {
          console.error("Error fetching open bill:", error);
        }
      };
      fetchOpenBill();
    }
  }, [openBillId]);

  if (!openBill) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <OrderDetails orders={openBill.products} mode="update" selectedOpenBill={openBill} />
    </div>
  );
}
