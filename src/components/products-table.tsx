"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search } from "@/components/ui/search";
import { useSidebar } from "./ui/sidebar";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table";
import products, { Product } from "../datas/products";
import { SortButton } from "./ui/sort";

export function ProductsTable() {
  const { open } = useSidebar();
  const sidebarWidthRem = 16;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredProducts = products.filter((product) =>
    product.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [sortedProducts, setSortedProducts] = useState<Product[]>(filteredProducts);

  useEffect(() => {
    setSortedProducts(filteredProducts);
  }, [searchQuery]);

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button type="submit" className="w-32">
          New Product
        </Button>
      </div>
      {/* TABLE */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        {/* Search Bar */}
        <Search
          placeholder="Search (ID/Name/Category/SKU)"
          onSearch={setSearchQuery}
          className="max-w-sm"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                ID
                <SortButton<Product>
                  data={sortedProducts}
                  sortKey="id"
                  onSort={setSortedProducts}
                />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-center">
                Stock
                <SortButton<Product>
                  data={sortedProducts}
                  sortKey="stock"
                  onSort={setSortedProducts}
                />
              </TableHead>
              <TableHead className="text-center">Unit</TableHead>
              <TableHead className="text-center">
                Initial Price
                <SortButton<Product>
                  data={sortedProducts}
                  sortKey="initialPrice"
                  onSort={setSortedProducts}
                />
              </TableHead>
              <TableHead className="text-center">
                Selling Price
                <SortButton<Product>
                  data={sortedProducts}
                  sortKey="sellingPrice"
                  onSort={setSortedProducts}
                />
              </TableHead>
              <TableHead className="text-center">
                Net Profit
                <SortButton<Product>
                  data={sortedProducts}
                  sortKey="netProfit"
                  onSort={setSortedProducts}
                />
              </TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">Non Stock</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell >{product.id}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell className="text-center">{product.stock}</TableCell>
                  <TableCell className="text-center">{product.unit}</TableCell>
                  <TableCell className="text-right">{product.initialPrice}</TableCell>
                  <TableCell className="text-right">{product.sellingPrice}</TableCell>
                  <TableCell className="text-right">{product.netProfit}</TableCell>
                  <TableCell className="text-center">{product.type}</TableCell>
                  <TableCell className="text-center">
                    <Switch />
                  </TableCell>
                  <TableCell  className="text-center">
                    <Button type="submit" className="w-18">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} className="text-center">
                  No product found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
