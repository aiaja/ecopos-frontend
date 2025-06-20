"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Penting untuk menampilkan gambar
import { Product, netProfit } from "@/datas/products"; // Pastikan path ini benar

// Import komponen UI
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search } from "@/components/ui/search";
import { SortButton } from "@/components/ui/sort";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Helper function untuk format mata uang, bisa juga ditaruh di file terpisah (misal: src/utils/formatters.ts)
const formatCurrency = (amount: number | string) => {
    const numberAmount = Number(amount);
    if (isNaN(numberAmount)) return "N/A";
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(numberAmount);
};

interface ProductsTableProps {
  products: Product[];
  onDelete: (productId: string) => void;
  onToggleStock: (productId: string, newStatus: boolean) => void; 
}

export default function ProductsTable({ products, onDelete, onToggleStock }: ProductsTableProps) {
  // PERBAIKAN LOGIKA STATE: Kita gunakan satu state utama `displayProducts`
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // useEffect untuk meng-handle filter dan sinkronisasi data dari props
  useEffect(() => {
    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.id ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayProducts(filtered);
    setCurrentPage(1); // Selalu kembali ke halaman 1 setiap kali filter/data berubah
  }, [products, searchQuery]);

  const totalPages = Math.ceil(displayProducts.length / itemsPerPage);
  const paginatedProducts = displayProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/inventory/products/new">New Product</Link>
        </Button>
      </div>

      <div className="m-6 px-6 bg-white border rounded-lg shadow-sm">
        <div className="py-6 space-y-4">
          <Search
            placeholder="Search (ID/Name/Category)"
            onSearch={setSearchQuery}
            className="max-w-md"
          />
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold text-gray-900">
                    ID
                    <SortButton<Product>
                      data={displayProducts}
                      sortKey="id"
                      onSort={setDisplayProducts}
                    />
                  </TableHead>
                  
                  <TableHead className="font-semibold text-gray-900 w-20">
                    Image
                  </TableHead>
                  
                  <TableHead className="font-semibold text-gray-900">
                    Name
                    <SortButton<Product>
                      data={displayProducts}
                      sortKey="name"
                      onSort={setDisplayProducts}
                    />
                  </TableHead>

                  <TableHead className="font-semibold text-gray-900">
                    Category
                    <SortButton<Product>
                      data={displayProducts}
                      sortKey="category.name"
                      onSort={setDisplayProducts}
                    />
                  </TableHead>
                  
                  <TableHead className="font-semibold text-gray-900 text-center">
                    Stock
                    <SortButton<Product>
                      data={displayProducts}
                      sortKey="stock"
                      onSort={setDisplayProducts}
                    />
                  </TableHead>
                  
                  <TableHead className="font-semibold text-gray-900">
                    Unit
                  </TableHead>
                  
                  <TableHead className="font-semibold text-gray-900 text-right">
                    Initial Price
                    <SortButton<Product>
                      data={displayProducts}
                      sortKey="initial_price"
                      onSort={setDisplayProducts}
                    />
                  </TableHead>
                  
                  <TableHead className="font-semibold text-gray-900 text-right">
                    Selling Price
                    <SortButton<Product>
                      data={displayProducts}
                      sortKey="selling_price"
                      onSort={setDisplayProducts}
                    />
                  </TableHead>
                  
                  <TableHead className="font-semibold text-gray-900 text-right">
                    Net Profit
                    <SortButton<Product>
                      data={displayProducts}
                      sortKey="net_profit"
                      onSort={setDisplayProducts}
                    />
                  </TableHead>
                  
                  <TableHead className="font-semibold text-gray-900 text-center">
                    Non-Stock
                  </TableHead>
                  
                  <TableHead className="font-semibold text-gray-900 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product, index) => (
                    <TableRow 
                      key={product.id} 
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                    >
                      <TableCell>
                        {product.id ?? ""}
                      </TableCell>
                      
                      <TableCell>
                        <div className="w-14 h-14 relative">
                          {product.hero_images ? (
                            <Image
                              src={product.hero_images}
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="rounded-lg object-cover border"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 rounded-lg border flex items-center justify-center">
                              <span className="text-xs text-gray-400 font-medium">No Image</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="font-bold text-gray-900">
                        {product.name}
                      </TableCell>
                      
                      <TableCell className="text-gray-700">
                        {product.category?.name || 'N/A'}
                      </TableCell>
                      
                      <TableCell className="text-center font-bold text-gray-900">
                        {product.stock}
                      </TableCell>
                      
                      <TableCell className="text-gray-700">
                        {product.unit}
                      </TableCell>
                      
                      <TableCell className="text-right text-gray-900">
                        {formatCurrency(product.initial_price)}
                      </TableCell>
                      
                      <TableCell className="text-right text-gray-900">
                        {formatCurrency(product.selling_price)}
                      </TableCell>
                      
                      <TableCell className="text-right font-bold text-gray-900">
                        {formatCurrency(netProfit(product))}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex justify-center">
                          <Switch 
                            checked={product.is_non_stock} 
                            onCheckedChange={(newStatus) => onToggleStock(product.id ?? "", newStatus)}
                          />
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button 
                            asChild 
                            size="sm" 
                            type="button"
                            className="text-xs px-3 w-15"
                          >
                            <Link href={`/inventory/products/${product.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            type="button"
                            className="text-xs px-3 w-15 bg-red-500 hover:bg-red-500/90 cursor-pointer" 
                            onClick={() => onDelete(product.id ?? "")}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center h-24 text-gray-500">
                      No products found for "{searchQuery}".
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}