"use client";

import React, { useState, useEffect, useMemo } from "react";
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

import { Product, netProfit } from "../../../datas/products";

export default function ProductsTable({ products }: { products?: Product[] }) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 5;

  const netProfitProducts = useMemo(() => {
    if(!products) return [];
    return products.map((product) => ({
      ...product,
      net_profit: netProfit(product),
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return netProfitProducts.filter((product) => {
      return (
        product.id.toString().includes(query) ||
        product.name.toLowerCase().includes(query) ||
        (product.category?.name || "").toLowerCase().includes(query)
      );
    });
  }, [searchQuery, netProfitProducts]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setSortedProducts(filteredProducts);
  }, [searchQuery, filteredProducts]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild type="button" className="w-32">
          <Link href="/inventory/products/new">New Product</Link>
        </Button>
      </div>

      {/* Table Container */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        {/* Search */}
        <Search
          placeholder="Search (ID/Name/Category)"
          onSearch={(value) => setSearchQuery(value)}
          className="max-w-sm"
        />

        {/* Table */}
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
                  sortKey="initial_price"
                  onSort={setSortedProducts}
                />
              </TableHead>
              <TableHead className="text-center">
                Selling Price
                <SortButton<Product>
                  data={sortedProducts}
                  sortKey="selling_price"
                  onSort={setSortedProducts}
                />
              </TableHead>
              <TableHead className="text-center">
                Net Profit
                <SortButton<Product>
                  data={sortedProducts}
                  sortKey="net_profit"
                  onSort={setSortedProducts}
                />
              </TableHead>
              <TableHead className="text-center">Stock?</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-center">{product.stock}</TableCell>
                  <TableCell className="text-center">{product.unit}</TableCell>
                  <TableCell className="text-right">{product.initial_price}</TableCell>
                  <TableCell className="text-right">{product.selling_price}</TableCell>
                  <TableCell className="text-right">{product.net_profit !== undefined ? product.net_profit.toLocaleString() : 'N/A'}</TableCell>
                  <TableCell className="text-center">
                    <Switch checked={!product.is_non_stock} /> 
                  </TableCell>
                  <TableCell className="text-center">
                    <Button asChild type="button" className="w-18">
                      <Link href={`/inventory/products/${product.id}/edit`}>
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
