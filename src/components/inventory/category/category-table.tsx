"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Category } from "@/datas/categories";

// Import komponen UI
import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { SortButton } from "@/components/ui/sort";

interface CategoriesTableProps {
  categories: Category[];
  onDelete: (categoryId: string) => void;
}

export function CategoriesTable({ categories, onDelete }: CategoriesTableProps) {

  const [displayCategories, setDisplayCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.id || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayCategories(filtered);
    setCurrentPage(1);
  }, [categories, searchQuery]);

  // Logika Pagination
  const totalPages = Math.ceil(displayCategories.length / itemsPerPage);
  const paginatedCategories = displayCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Category</h1>
        <Button asChild>
          <Link href="/inventory/category/new">New Category</Link>
        </Button>
      </div>
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Search
          placeholder="Search (ID/Category Name)"
          onSearch={setSearchQuery}
          className="max-w-sm"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                ID
                <SortButton<Category>
                  data={displayCategories}
                  sortKey="id"
                  onSort={setDisplayCategories}
                />
              </TableHead>
              <TableHead>
                Category Name
                <SortButton<Category>
                  data={displayCategories}
                  sortKey="name"
                  onSort={setDisplayCategories}
                />
              </TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCategories.length > 0 ? (
              paginatedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id ? category.id + '...' : 'N/A'}</TableCell>
                  <TableCell className="font-semibold">{category.name}</TableCell>
                  <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button 
                            asChild 
                            size="sm" 
                            type="button"
                            className="text-xs px-3 w-15"
                          >
                            <Link href={`/inventory/category/${category.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            type="button"
                            className="text-xs px-3 w-15 bg-red-500 hover:bg-red-500/90 cursor-pointer" 
                            onClick={() => onDelete(category.id ?? "")}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  No categories found for "{searchQuery}".
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
}