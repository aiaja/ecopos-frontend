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

export function ProductsTable() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredProducts = products.filter((product) =>
    product.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [sortedProducts, setSortedProducts] = useState<Product[]>(filteredProducts);

  React.useEffect(() => {
    setSortedProducts(filteredProducts);
  }, [searchQuery]);

  return (
    <div className="">
      {/* TABLE */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Table>

          {/* Search Bar Row */}
          <TableHeader className="right">
            <TableRow>
              <TableCell colSpan={12} className="px-4 py-2">
                <Search
                  placeholder="Search products..."
                  onSearch={(value) => setSearchQuery(value)}
                  className="max-w-sm"
                />
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableHeader className="w-full col-span-4">
            <TableRow>
              <TableHead>ID
                <SortButton<Product>
                  data={sortedProducts}
                  sortKey="id"
                  onSort={setSortedProducts}
                />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Stock
                <SortButton<Product>
                  data={sortedProducts}
                  sortKey="stock"
                  onSort={setSortedProducts}
                />
              </TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Initial Price
                <SortButton<Product>
                  data={sortedProducts}
                  sortKey="initialPrice"
                  onSort={setSortedProducts}
                />
              </TableHead>
              <TableHead>Selling Price
                <SortButton<Product>
                  data={sortedProducts}
                  sortKey="sellingPrice"
                  onSort={setSortedProducts}
                />
              </TableHead>
              <TableHead>Net Profit
                <SortButton<Product>
                  data={sortedProducts}
                  sortKey="netProfit"
                  onSort={setSortedProducts}
                />
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Non Stock</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product: Product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell className="text-right">{product.stock}</TableCell>
                <TableCell className="text-right">{product.unit}</TableCell>
                <TableCell className="text-right">{product.initialPrice}</TableCell>
                <TableCell className="text-right">{product.sellingPrice}</TableCell>
                <TableCell className="text-right">{product.netProfit}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell className="text-center">
                  <Switch></Switch>
                </TableCell>
                <TableCell>
                  <Button type="submit" className="w-full text-center">
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
