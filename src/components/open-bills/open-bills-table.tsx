"use client";

import { Search } from "@/components/ui/search";
import React, { useState } from "react";
import { OpenBills } from "@/datas/openBills";

import { useRouter } from "next/navigation";

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
import { deleteOpenBills } from "@/services/openBills";
import DeleteDialog from "./open-bills-delete";

export function OpenBillsTable({ openBills }: { openBills?: OpenBills[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isOpenBillsDialogOpen, setOpenBillsDialogOpen] = useState(false);
  const [selectedOpenBill, setSelectedOpenBill] = useState<OpenBills | null>(
    null
  );

  const filteredOpenBillss = openBills
    ? openBills.filter((openBill: OpenBills) => {
        const query = searchQuery.toLowerCase();
        return (
          openBill.customer_name.toLowerCase().includes(query) ||
          openBill.code.toString().includes(query)
        );
      })
    : [];

  const [sortedOpenBillss, setSortedOpenBillss] =
    useState<OpenBills[]>(filteredOpenBillss);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedOpenBillss.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedOpenBillss.slice(startIndex, endIndex);

  useEffect(() => {
    setSortedOpenBillss(filteredOpenBillss);
  }, [searchQuery]);

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id?: string;
    name?: string;
  }>({ open: false });

  const handleDeleteOpenBills = async (id: string) => {
    try {
      const outletId = localStorage.getItem("outlet_id") || "";
      await deleteOpenBills(outletId, id);
      alert("Open Bills deleted successfully");
      console.log(`Deleting open bills with ID: ${id}`);
      setSortedOpenBillss((prev) => prev.filter((pm) => pm.id !== id));
    } catch (error) {
      console.error("Error deleting open bills:", error);
      alert("An error occurred while deleting the open bills.");
    }
    setDeleteDialog({ open: false });
  };

  const handleEditOpenBills = (openBill: OpenBills) => {
    setSelectedOpenBill(openBill);
    setOpenBillsDialogOpen(true);
    router.push(`/pos?id=${openBill.id}`);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Open Bills</h1>
      </div>
      {/* TABLE */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        {/* Search Bar Row */}
        <Search
          placeholder="Search (ID/Open Bills Name)"
          onSearch={(value) => setSearchQuery(value)}
          className="max-w-sm"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                ID
                <SortButton<OpenBills>
                  data={sortedOpenBillss}
                  sortKey="code"
                  onSort={setSortedOpenBillss}
                />
              </TableHead>
              <TableHead>
                Member Name
                <SortButton<OpenBills>
                  data={sortedOpenBillss}
                  sortKey="customer_name"
                  onSort={setSortedOpenBillss}
                />
              </TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOpenBillss.length > 0 ? (
              sortedOpenBillss.map((openBill: OpenBills) => (
                <TableRow key={openBill.code}>
                  <TableCell>{openBill.code}</TableCell>
                  <TableCell>{openBill.customer_name}</TableCell>
                  <TableCell className="text-center flex gap-2 justify-center">
                    <Button
                      type="button"
                      className="w-18"
                      onClick={() => handleEditOpenBills(openBill)}
                    >
                        Update
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          id: openBill.id,
                          name: openBill.customer_name,
                        })
                      }
                      className="cursor-pointer"
                    >
                      Closed
                    </Button>
                    <DeleteDialog
                      isOpen={
                        deleteDialog.open && deleteDialog.id === openBill.id
                      }
                      onClose={() => setDeleteDialog({ open: false })}
                      onConfirm={async () => {
                        if (deleteDialog.id)
                          await handleDeleteOpenBills(deleteDialog.id);
                      }}
                      itemName={openBill.customer_name}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No members method found.
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
