"use client";

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Search } from "@/components/ui/search";
import React, { useState } from "react";

import { 
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption, } from "./ui/table";

import products, { Product } from "../datas/products";
import { SortButton } from "./ui/sort";

export function CategoriesTable() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredProducts = products.filter((product) =>
    product.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [sortedProducts, setSortedProducts] = useState<Product[]>(filteredProducts);

  React.useEffect(() => {
    setSortedProducts(filteredProducts);
  }, [searchQuery]);

  return (
    <div className="">
      <div className="text-right">
        <Button type="submit">
          New Category
        </Button>
      </div>
      {/* TABLE */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Table>
          {/* Search Bar Row */}
          <TableHeader className="w-full col-span-4">
            <TableRow>
              <TableHead colSpan={12} className="px-4 py-2">
                <Search
                  placeholder="Search (ID/Category)"
                  onSearch={(value) => setSearchQuery(value)}
                  className="max-w-sm"
                />
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead>ID
                <SortButton<Product>
                  data={sortedProducts}
                  sortKey="id"
                  onSort={setSortedProducts}
                />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product: Product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">
                  <Button type="submit">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
