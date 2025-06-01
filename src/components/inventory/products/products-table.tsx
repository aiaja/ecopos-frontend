"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search } from "@/components/ui/search";
import { SortButton } from "@/components/ui/sort";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import products, { Product } from "../../../datas/products";

export function ProductsTable() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortedProducts, setSortedProducts] = useState<Product[]>(products);

  const filteredProducts = products.filter((product) =>
    product.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);


  useEffect(() => {
    setSortedProducts(filteredProducts);
  }, [searchQuery]);

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild type="button" className="w-32">
          <Link href="/tenants/inventory/products/new">New Product</Link>
        </Button>
      </div>

      {/* TABLE */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        {/* Search Bar Row */}
        <Search
          placeholder="Search (ID/Name/Category)"
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
              <TableHead className="text-center">Non Stock</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-center">{product.stock}</TableCell>
                  <TableCell className="text-center">{product.unit}</TableCell>
                  <TableCell className="text-right">{product.initialPrice}</TableCell>
                  <TableCell className="text-right">{product.sellingPrice}</TableCell>
                  <TableCell className="text-right">{product.netProfit}</TableCell>
                  <TableCell className="text-center">
                    <Switch />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button asChild type="button" className="w-18">
                      <Link href={`/tenants/inventory/products/${product.id}/edit`}>
                        Edit
                      </Link>
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
        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

      </div>
    </div>
  );
}
