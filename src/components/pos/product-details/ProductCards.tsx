"use client";
import { useState, useEffect } from "react";
import { addToCartSchema, ProductCard } from "@/datas/productCards";
import { Search } from "@/components/ui/search";
import { ScrollArea } from "../../ui/scroll-area";
import { Separator } from "../../ui/separator";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { ProductCardsService } from "@/services/pos/productCards";
import { useRouter } from "next/navigation";

export function ProductCards({
  productCards,
}: {
  productCards: ProductCard[];
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProductCards = productCards
    ? productCards.filter((productCard: ProductCard) => {
        const query = searchQuery.toLowerCase();
        return (
          productCard.name.toLowerCase().includes(query) ||
          productCard.id.toString().includes(query)
        );
      })
    : [];

  const [sortedProductCards, setSortedProductCards] =
    useState<ProductCard[]>(filteredProductCards);

  useEffect(() => {
    setSortedProductCards(filteredProductCards);
  }, [searchQuery]);

  async function handleAddToCart(values: z.infer<typeof addToCartSchema>) {
    try {
      const addToCart = {
        product_id: values.productId,
        quantity: values.quantity,
        outlet_id: localStorage.getItem("outlet_id") || "",
      };

      const response = await ProductCardsService.addToCart(
        localStorage.getItem("outlet_id") || "",
        addToCart
      );
      if (response) {
        alert("Product added to cart successfully");
      } else {
        alert("Failed to add product to cart");
      }
      router.refresh();
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("An error occurred while processing your request.");
    }
  }

  return (
    <div>
      <div className="flex-1 border-r">
        <div className="p-4">
          <Search
            placeholder="Search (Product Name)"
            onSearch={(value) => setSearchQuery(value)}
            className="max-w-sm"
          />
        </div>
        <Separator />
        <ScrollArea className="p-4">
          <div className="gap-4 flex flex-col">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {sortedProductCards.map((productCard) => (
                <Card key={productCard.id} className="min-w-0 p-2">
                  <CardHeader className="px-2 pt-2">
                    <CardTitle className="text-sm truncate">
                      {productCard.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-2">
                    <img
                      src={productCard.hero_image}
                      alt={productCard.name}
                      className="object-cover h-10 w-full rounded"
                    />
                    <p className="text-xs text-gray-500 mb-1">
                      Stock: {productCard.stock}
                    </p>
                    <p className="text-primary/75 font-bold text-sm">
                      IDR {productCard.selling_price}
                    </p>
                  </CardContent>
                  <CardFooter className="w-full px-2">
                    <Button
                      variant="outline"
                      className="w-full h-8 text-xs"
                      onClick={() =>
                        handleAddToCart({
                          productId: productCard.id.toString(),
                          quantity: 1,
                        }).then(() => window.location.reload())
                      }
                    >
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
