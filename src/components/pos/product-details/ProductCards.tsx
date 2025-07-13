"use client";
import { useState, useEffect, useCallback } from "react";
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
import { on } from "events";

interface ProductCardsProps {
  productCards: ProductCard[];
  mode?: "update" | "create";
  id_openBill?: string | null;
  onCartUpdate?: () => void; // Callback untuk update cart
  onShowSuccess?: (message: string) => void; // Callback untuk show success message
  onShowError?: (message: string) => void; // Callback untuk show error message
}

export function ProductCards({
  productCards,
  mode,
  id_openBill,
  onCartUpdate,
  onShowSuccess,
  onShowError,
}: ProductCardsProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortedProductCards, setSortedProductCards] = useState<ProductCard[]>(productCards);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Track which button is loading

  // Filter products based on search query
  const filteredProductCards = productCards
    ? productCards.filter((productCard: ProductCard) => {
        const query = searchQuery.toLowerCase();
        return (
          productCard.name.toLowerCase().includes(query) ||
          productCard.id.toString().includes(query)
        );
      })
    : [];

  // Update sorted products when search query changes
  useEffect(() => {
    setSortedProductCards(filteredProductCards);
  }, [searchQuery, productCards]);

  // Update sorted products when productCards prop changes
  useEffect(() => {
    setSortedProductCards(productCards);
  }, [productCards]);

  const handleUpdateCart = useCallback(async (values: z.infer<typeof addToOpenBillSchema>) => {
    const buttonId = `update-${values.productId}`;
    setActionLoading(buttonId);
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
        onShowSuccess?.("Product updated in cart successfully");
        onCartUpdate?.(); // Trigger parent to refetch cart data
      } else {
        onShowError?.("Failed to update product in cart");
      }
    } catch (error) {
      console.error("Error updating product in cart:", error);
      onShowError?.("An error occurred while processing your request.");
    } finally {
      setActionLoading(null);
    }
  }, [id_openBill, onCartUpdate, onShowSuccess, onShowError]);

  const handleAddToCart = useCallback(async (values: z.infer<typeof addToCartSchema>) => {
    const buttonId = `add-${values.productId}`;
    setActionLoading(buttonId);

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
        onShowSuccess?.("Product added to cart successfully");
        onCartUpdate?.(); // Trigger parent to refetch cart data
      } else {
        onShowError?.("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      onShowError?.("An error occurred while processing your request.");
    } finally {
      setActionLoading(null);
    }
  }, [onCartUpdate, onShowSuccess, onShowError]);

  const handleProductByCategory = useCallback(async (categoryId: string) => {
    try {
      const products = await ProductCardsService.getProductByCategory(
        localStorage.getItem("outlet_id") || "",
        categoryId
      );
      const mappedProducts = products.map((product: any) => ({
        ...product,
        id: product.id?.toString() ?? "",
      }));
      setSortedProductCards(mappedProducts);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      onShowError?.("An error occurred while fetching products.");
    }
  }, [onShowError]);

  const fetchCategories = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    if (categoryId === "all") {
      setSortedProductCards(filteredProductCards);
    } else {
      handleProductByCategory(categoryId);
    }
  }, [filteredProductCards, handleProductByCategory]);

  const handleProductAction = useCallback((productCard: ProductCard) => {
    const productId = productCard.id.toString();
    
    if (mode === "update") {
      handleUpdateCart({
        productId,
        qty: 1,
      });
    } else {
      handleAddToCart({
        productId,
        quantity: 1,
      });
    }
  }, [mode, handleUpdateCart, handleAddToCart]);

  return (
    <div>
      <div className="flex-1 border-r">
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex-1 p-4">
            <Search
              placeholder="Search (Product Name)"
              onSearch={(value) => setSearchQuery(value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex-1 px-4">
            <Select
              onValueChange={handleCategoryChange}
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
            {sortedProductCards.map((productCard) => {
              const buttonId = mode === "update" 
                ? `update-${productCard.id}` 
                : `add-${productCard.id}`;
              const isLoading = actionLoading === buttonId;
              
              return (
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
                      onClick={() => handleProductAction(productCard)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : (mode === "update" ? "Update Cart" : "Add to Cart")}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}