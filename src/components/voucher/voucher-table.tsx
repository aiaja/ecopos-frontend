"use client";

import { Search } from "@/components/ui/search";
import React, { useState } from "react";
import { Voucher } from "@/datas/voucher";

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
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

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { SortButton } from "../ui/sort";
import { SquarePen, Trash2 } from "lucide-react";
import { deleteVoucher } from "@/services/voucher";
import DeleteDialog from "./voucher-delete"; 

export function VoucherTable({
  vouchers,
}: {
  vouchers?: Voucher[];
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredVouchers = vouchers
    ? vouchers.filter((voucher: Voucher) => {
        const query = searchQuery.toLowerCase();
        return (
          voucher.name.toLowerCase().includes(query) ||
          voucher.code.toLowerCase().includes(query)
        );
      })
    : [];

  const [sortedVouchers, setSortedVouchers] = useState<
    Voucher[]
  >(filteredVouchers);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedVouchers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedVouchers.slice(startIndex, endIndex);

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
            alert("voucher deleted successfully"); 
            console.log(`Deleting voucher with ID: ${id}`);
            setSortedVouchers((prev) =>
              prev.filter((pm) => pm.id !== id)
            );
        } catch (error) {
            console.error("Error deleting voucher:", error);
            alert("An error occurred while deleting the voucher.");
        }
    setDeleteDialog({ open: false });
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Vouchers</h1>

        <Button asChild type="button">
          <Link href="/voucher/new">New Voucher</Link>
        </Button>
      </div>
      {/* TABLE */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        {/* Search Bar Row */}
        <Search
          placeholder="Search (ID/Voucher Name)"
          onSearch={(value) => setSearchQuery(value)}
          className="max-w-sm"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Code
                <SortButton<Voucher>
                  data={sortedVouchers}
                  sortKey="code"
                  onSort={setSortedVouchers}
                />
              </TableHead>
              <TableHead>
                Voucher Name
                <SortButton<Voucher>
                  data={sortedVouchers}
                  sortKey="name"
                  onSort={setSortedVouchers}
                />
              </TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedVouchers.length > 0 ? (
              sortedVouchers.map((voucher: Voucher) => (
                <TableRow key={voucher.code}>
                  <TableCell>{voucher.code}</TableCell>
                  <TableCell>{voucher.name}</TableCell>
                  <TableCell className="text-center flex gap-2 justify-center">
                    <Button asChild type="button" className="w-18">
                      <Link href={`/voucher/${voucher.id}/edit`}>
                        Edit
                        <SquarePen className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          id: voucher.id,
                          name: voucher.name,
                        })
                      }
                      className="cursor-pointer"
                    >
                      Delete
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <DeleteDialog
                      isOpen={deleteDialog.open && deleteDialog.id === voucher.id}
                      onClose={() => setDeleteDialog({ open: false })}
                      onConfirm={async () => {
                        if (deleteDialog.id)
                          await handleDeleteVoucher(deleteDialog.id);
                      }}
                      itemName={voucher.name}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
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
