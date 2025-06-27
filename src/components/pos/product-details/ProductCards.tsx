"use client";
import { useState, useEffect } from "react";
import { addToCartSchema, addToOpenBillSchema, ProductCard } from "@/datas/productCards";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryService } from "@/services/category";
import { Category } from "@/datas/categories";
import { OpenBillsService } from "@/services/openBills";
import { openBillsSchema } from "@/datas/openBills";

export function ProductCards({
  productCards,
  mode,
  id_openBill,
}: {
  productCards: ProductCard[];
  mode?: "update" | "create";
  id_openBill?: string | null;
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

  async function handleUpdateCart(values: z.infer<typeof addToOpenBillSchema>) {
    try {
       const updateBill = {
        product_id: values.productId,
        qty: values.qty,
      };

      const response = await OpenBillsService.updateOpenBills(
        localStorage.getItem("outlet_id") || "",
        id_openBill || "",
        updateBill
      );
      if (response) {
        alert("Product updated in cart successfully");
      } else {
        alert("Failed to update product in cart");
      }
      router.refresh();
    } catch (error) {
      console.error("Error updating product in cart:", error);
      alert("An error occurred while processing your request.");
    }
  }


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

  const handleProductByCategory = async (categoryId: string) => {
    try {
      const products = await ProductCardsService.getProductByCategory(
        localStorage.getItem("outlet_id") || "",
        categoryId
      );
      // Map ProductByCategory[] to ProductCard[] and ensure 'id' is a string
      const mappedProducts = products.map((product: any) => ({
        ...product,
        id: product.id?.toString() ?? "",
      }));
      setSortedProductCards(mappedProducts);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      alert("An error occurred while fetching products.");
    }
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategories(
        localStorage.getItem("outlet_id") || ""
      );
      if (response) {
        setCategories(response as Category[]);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="flex-1 border-r ">
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex-1 p-4">
            <Search
              placeholder="Search (Product Name)"
              onSearch={(value) => setSearchQuery(value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex-1 px-4 ">
            <Select
              onValueChange={(categoryId) => {
                if (categoryId === "all") {
                  setSortedProductCards(filteredProductCards);
                } else {
                  handleProductByCategory(categoryId);
                }
              }}
              disabled={loading || categories.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={loading ? "Loading..." : "Select Category"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator />
        <ScrollArea className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {sortedProductCards.map((productCard) => (
              <Card key={productCard.id} className="min-w-0 p-2 flex flex-col gap-2">
                <CardHeader className="px-2">
                  <CardTitle className="text-sm truncate">{productCard.name}</CardTitle>
                </CardHeader>
                <CardContent className="px-2 flex flex-col items-center">
                  <img
                    src={productCard.hero_images}
                    alt={productCard.name}
                    className="object-cover w-full h-24 rounded mb-2"
                    style={{ maxHeight: "96px", minHeight: "96px" }}
                  />
                  <p className="text-xs text-gray-500 mb-1 self-start">
                    Stock: {productCard.stock}
                  </p>
                  <p className="text-primary/75 font-bold text-sm self-start">
                    IDR {productCard.selling_price}
                  </p>
                </CardContent>
                <CardFooter className="w-full px-2 mt-auto">
                  <Button
                    variant="outline"
                    className="w-full h-8 text-xs"
                    onClick={() =>
                      mode === "update"
                        ? handleUpdateCart({
                          productId: productCard.id.toString(),
                          qty: 1,
                        })
                        : handleAddToCart({
                          productId: productCard.id.toString(),
                          quantity: 1,
                        }).then(() => window.location.reload())
                    }
                  >
                    {mode === "update" ? "Update Cart" : "Add to Cart"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

        </ScrollArea>
      </div >
    </div >
  );
}
