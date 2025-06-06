"use client";
import { useState, useEffect } from "react";
import { ProductCard } from "@/datas/productCards";
import { Search } from "@/components/ui/search";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

export function ProductCards({
  productCards,
}: {
  productCards: ProductCard[];
}) {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sortedProductCards.map((productCard) => (
                <Card key={productCard.id}>
                  <CardHeader>
                    <CardTitle>{productCard.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={productCard.hero_image}
                      alt={productCard.name}
                      className="object-cover pb-6"
                    />
                    <p className="text-sm text-gray-500">
                      Stock: {productCard.stock}
                    </p>
                    <p className="text-primary/75 font-bold">
                      IDR {productCard.selling_price}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
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
