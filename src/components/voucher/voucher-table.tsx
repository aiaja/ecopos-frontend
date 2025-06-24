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

import { Voucher } from "@/datas/voucher";
import { deleteVoucher } from "@/services/vouchers";

export function VouchersTable({ vouchers }: { vouchers?: Voucher[] }) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredVouchers = vouchers
    ? vouchers.filter((voucher: Voucher) => {
        const query = searchQuery.toLowerCase();
        return (
          voucher.name.toLowerCase().includes(query) ||
          voucher.id.toString().includes(query)
        );
      })
      
    : [];

    
  const [sortedVouchers, setSortedVouchers] =
    useState<Voucher[]>(filteredVouchers);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(sortedVouchers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVouchers = sortedVouchers.slice(startIndex, endIndex);

  useEffect(() => {
    setSortedVouchers(filteredVouchers);
  }, [searchQuery]);

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id?: string;
    name?: string;
  }>({ open: false });

  const handleDeleteVoucher = async (id: string) => {
    try {
      const outletId = localStorage.getItem("outlet_id") || "";
      await deleteVoucher(outletId, id);
      alert("Voucher deleted successfully");
      console.log(`Deleting voucher with ID: ${id}`);
      setSortedVouchers((prev) => prev.filter((pm) => pm.id !== id));
    } catch (error) {
      console.error("Error deleting voucher:", error);
      alert("An error occurred while deleting the voucher.");
    }
    setDeleteDialog({ open: false });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Vouchers</h1>
        <Button asChild type="button" className="w-32">
          <Link href="/vouchers/new">New Voucher</Link>
        </Button>
      </div>

      {/* Table Container */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        {/* Search */}
        <Search
          placeholder="Search (ID/Name/Code)"
          onSearch={(value) => setSearchQuery(value)}
          className="max-w-sm"
        />

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code
                <SortButton<Voucher>
                  data={sortedVouchers}
                  sortKey="code"
                  onSort={setSortedVouchers}
                />
              </TableHead>
              <TableHead>Name
                <SortButton<Voucher>
                  data={sortedVouchers}
                  sortKey="name"
                  onSort={setSortedVouchers}
                />
              </TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">Nominal</TableHead>
              <TableHead className="text-center">Minimum Buying</TableHead>
              <TableHead className="text-center">Start Date</TableHead>
              <TableHead className="text-center">Expired Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedVouchers.length > 0 ? (
              paginatedVouchers.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell>{voucher.code}</TableCell>
                  <TableCell>{voucher.name}</TableCell>
                  <TableCell>{voucher.type}</TableCell>
                  <TableCell className="text-center">
                    {voucher.nominal}
                  </TableCell>
                  <TableCell className="text-center">
                    {voucher.minimum_buying}
                  </TableCell>
                  <TableCell className="text-right">
                    {voucher.start_date}
                  </TableCell>
                  <TableCell className="text-right">
                    {voucher.expired_date}
                  </TableCell>
                  <TableCell className="text-right">{voucher.status}</TableCell>
                  <TableCell className="text-center">
                    <Button asChild type="button" className="w-18">
                      <Link href={`/inventory/vouchers/${voucher.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} className="text-center">
                  No voucher found.
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
