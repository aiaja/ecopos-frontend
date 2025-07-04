"use client";

import { OrderDetails } from "@/components/pos/order-details/OrderDetails";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { mockOrders } from "@/datas/mockProducts";

import { useEffect, useState } from "react";
import { ProductCard } from "@/datas/productCards";
import { ProductCardsService } from "@/services/pos/productCards";
import { ProductCards } from "@/components/pos/product-details/ProductCards";
import { useSearchParams } from "next/navigation"; // To access query parameters (such as OpenBill ID)
import { OpenBillsService } from "@/services/openBills"; // Service to fetch OpenBill data

export default function Home() {
  const [productCards, setProductCards] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOpenBill, setSelectedOpenBill] = useState<any | null>(null); // Store selected OpenBill if in update mode

  // Access query parameters to determine if we're in update mode (based on the OpenBill ID)
  const searchParams = useSearchParams();
  const openBillId = searchParams.get("id");

  const fetchProductCards = async () => {
    try {
      const response = await ProductCardsService.getProductCards(
        localStorage.getItem("outlet_id") || ""
      );
      console.log("Product cards fetched:", response);
      if (response) {
        setProductCards(response as ProductCard[]);
      } else {
        console.error("Failed to fetch product cards");
      }
    } catch (error) {
      console.error("Error fetching product cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOpenBillData = async (id: string) => {
    try {
      const response = await OpenBillsService.getOpenBillById(
        localStorage.getItem("outlet_id") || "",
        id
      );
      setSelectedOpenBill(response); // Set the OpenBill details if update mode
    } catch (error) {
      console.error("Error fetching open bill data:", error);
    }
  };

  useEffect(() => {
    fetchProductCards();
    
    // If an OpenBill ID is found in the query parameters, fetch the OpenBill data
    if (openBillId) {
      fetchOpenBillData(openBillId);
    } else {
      setSelectedOpenBill(null); // In case there is no OpenBill ID, ensure selectedOpenBill is null for create mode
    }
  }, [openBillId]); // This effect runs when openBillId changes (or on initial render)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const mode = selectedOpenBill ? "update" : "create"; 

  return (
    <div className="flex h-screen w-full">
      {/* Left Section: Product Cards */}
      <div className="w-3/5">
        <ProductCards productCards={productCards} mode={mode} id_openBill={openBillId} />
      </div>

      {/* Right Section: Order Details */}
      <div className="w-2/5">
        <div className="p-5">
          <h2 className="text-xl font-bold">Order Details</h2>
        </div>
        <Separator />
        <ScrollArea className="p-2">
          <OrderDetails
            orders={mockOrders}
            mode={mode}  
            selectedOpenBill={selectedOpenBill}  
            transaction={null}
          />
        </ScrollArea>
      </div>
    </div>
  );
}