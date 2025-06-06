"use client";

import { ProductCard } from "@/datas/productCards";
import { ProductCardsService } from "@/services/pos/productCards";
import { useEffect, useState } from "react";
import { ProductCards } from "@/components/pos/ProductCards";

export default function ProductCardsPage() {
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
      <ProductCards productCards={productCards} />
    </div>
  );
}
