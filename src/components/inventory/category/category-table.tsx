"use client";

import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";
import React, { useState, useEffect } from "react";
import Link from "next/link";
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

import { categories, Category } from "../../../datas/categories"; 
import { SortButton } from "@/components/ui/sort";

export default function CategoriesTable({
  categories,
} : {  categories?: Category[];}) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCategories = categories ? categories.filter((category: Category) => {
    const query = searchQuery.toLowerCase();
    return (
      category.name.toLowerCase().includes(query) ||
      category.id.toString().includes(query)
    );
  }) : [];

  const [sortedCategories, setSortedCategories] = useState<Category[]>(filteredCategories);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = sortedCategories.slice(startIndex, endIndex);

  useEffect(() => {
      setSortedCategories(filteredCategories);
    }, [searchQuery]);

  return (
    <div className="">
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Category</h1>

        <Button asChild type="button" className="w-32">
          <Link href="/inventory/category/new">New Category</Link>
        </Button>
      </div>
      {/* TABLE */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        {/* Search Bar Row */}
        <Search
          placeholder="Search (ID/Category Name)"
          onSearch={(value) => setSearchQuery(value)}
          className="max-w-sm"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID
                <SortButton<Category>
                  data={sortedCategories}
                  sortKey="id"
                  onSort={setSortedCategories}
                />
              </TableHead>
              <TableHead>Category Name
                <SortButton<Category>
                    data={sortedCategories}
                    sortKey="name"
                    onSort={setSortedCategories}
                  />
              </TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCategories.length > 0 ? (
              sortedCategories.map((category: Category) => ( 
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="text-center">
                    <Button asChild type="button" className="w-18">
                      <Link href={`/inventory/category/${category.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No category found.
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