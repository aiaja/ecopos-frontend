"use client";

import { ProductList } from "@/components/pos/ProductList";
import { OrderDetails } from "@/components/pos/OrderDetails";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { mockProducts } from "@/datas/mockProducts";
import { mockOrders } from "@/datas/mockProducts"; 
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { useEffect, useState } from "react";
import { ProductCard } from "@/datas/productCards";
import { ProductCardsService } from "@/services/pos/productCards";
import { ProductCards } from "@/components/pos/ProductCards";

export default function Home() {

    const [productCards, setProductCards] = useState<ProductCard[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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
    
      useEffect(() => {
        fetchProductCards();
      }, []);
    
      if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            Loading...
          </div>
        );
      }

  return (
    <div className="flex h-screen">
      {/* Left Section: Product Cards */}
      <ProductCards productCards={productCards} />

      {/* Right Section: Order Details */}
      <div className="w-[400px]">
        <div className="p-5">
          <h2 className="text-xl font-bold">Order Details</h2>
        </div>
        <Separator />
        <ScrollArea className="p-4">
          <OrderDetails orders={mockOrders} />
        </ScrollArea>
      </div>
    </div>
  );
}