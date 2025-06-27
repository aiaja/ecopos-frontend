"use client";

import { useEffect, useState } from "react";
import { OpenBills } from "@/datas/openBills";
import { OpenBillsService } from "@/services/openBills";
import { OpenBillsTable } from "@/components/open-bills/open-bills-table";

export default function Home() {
  const [openBills, setOpenBills] = useState<OpenBills[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOpenBills = async () => {
    try {
      const response = await OpenBillsService.getOpenBills(
        localStorage.getItem("outlet_id") || ""
      );
      console.log("Payment methods fetched:", response);
      if (response) {
        setOpenBills(response as OpenBills[]);
      } else {
        console.error("Failed to fetch payment methods");
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenBills();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <OpenBillsTable openBills={openBills} />
    </div>
  );
}
