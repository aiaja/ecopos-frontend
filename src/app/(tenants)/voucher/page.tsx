"use client";

import { VoucherService } from "@/services/voucher";
import { VoucherTable } from "@/components/voucher/voucher-table";
import { Voucher } from "@/datas/voucher";
import { useState, useEffect } from "react";

export default function Home() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    const fetchVouchers = async () => {
      try {
        const response = await VoucherService.getVouchers(
          localStorage.getItem("outlet_id") || ""
        );
        console.log("Payment methods fetched:", response);
        if (response) {
          setVouchers(response as Voucher[]);
        } else {
          console.error("Failed to fetch vouchers");
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchVouchers();
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
      <VoucherTable vouchers={vouchers}/>
      {/* <DetailView /> */}
    </div>
  );
}
